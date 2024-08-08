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

time = 11e3; // do not change

function filterpost(x){ // filter posts w/ command
	var z = 0; 
	console.log('fetched lynts');
	x.forEach(y=>{
		var c = y.id; // lynt id
		if(y.content.startsWith(command) && y.commentCount == 0){ // if valid for replying
			z+=time;
			var prompt = y.content.replace(command, ''); // get prompt from lynt
			fetch("https://yw85opafq6.execute-api.us-east-1.amazonaws.com/default/boss_mode_15aug?"+
						"text="+personality+encodeURI(prompt)) // prompt ai
				.then(e=>e.json()).then(aires=>{ // get the response
					var aires = aires.match(/^.{0,280}/)[0]; // make sure it is 280 chars long
					console.log(y.username, '::', prompt, '->', aires); // log request
					var f = () =>
						setTimeout(
							()=>{
								apipost( // send reply
									'comment',
									JSON.stringify({id: c, content: aires})
								).then(x => {
									console.log('sent to', y.username, 'with code', x);
								});
							}, z)
					f()
				});
		}
	});
}
async function apipost(x, y){ // api method
	return new Promise((z)=>{
		fetch("https://lyntr.com/api/" + x, {
			"body": y,
			"method": "POST",
			"credentials": "include"
		}).catch(e=>{}).then(e=>z(e.status));
	});
}

getposts(); // run bot
var TO = setInterval( // loop bot
	getposts,
	time*2
);
end = () => clearInterval(TO); //stop loop
