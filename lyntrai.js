// DUMBAI bot -- by @geodebreaker
// MIT lisense
// paste in dev console (ctrl+shift+i) to run
// type "end()" to stop ai
// IF YOU DO NOT TRUST IT, ASK A PROGRAMMER TO CHECK IT FOR YOU

// command to answer to:
var command = "[dumbai]";

// personality of ai:
var personality = 
	"Provide an awnser to this question (max 280 chars). Also keep your replies as short as"+
	" possible and also neutural, not positive but not negitive:"

getposts=()=> // get all posts that contain the command
	fetch("https://lyntr.com/api/search?q="+command, {"credentials": "include"})
	.then(x=>x.json()).then(x=>filterpost(x));

time = 5e3; // do not change

function filterpost(x){ // filter posts w/ command
	var z = 0; 
	console.log('fetched lynts');
	x.forEach(y=>{
		var c = y.id; // lynt id
		if(y.content.startsWith(command) && y.commentCount == 0){ // if valid for replying
			var prompt = y.content.replace(command, ''); // get prompt from lynt
			fetch("https://yw85opafq6.execute-api.us-east-1.amazonaws.com/default/boss_mode_15aug?"+
						"text="+personality+encodeURI(prompt)) // prompt ai
				.then(e=>e.json()).then(aires=>{ // get the response
					var aires = aires.match(/^.{0,280}/)[0]; // make sure it is 280 chars long
					console.log(y.username, '::', prompt, '->', aires); // log request
					var f = () =>
						setTimeout(
							async ()=>{
								apipost( // send reply
									'comment',
									JSON.stringify({id: c, content: aires})
								).then(x => {
									if(x != 201) // check if fail
										f();
								});
								console.log('sent');
							}, z)
				});
			z+=time;
		}
	});
}
async function apipost(x, y){ // api method
	return fetch("https://lyntr.com/api/" + x, {
		"body": y,
		"method": "POST",
		"credentials": "include"
	}).then(e=>e.status);
}

getposts(); // run bot
var TO = setInterval( // loop bot
	getposts,
	time*5
);
end = () => clearInterval(TO); //stop loop
