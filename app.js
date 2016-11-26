var tmi = require('tmi.js');
var SpotifyWebApi = require('spotify-web-api-node');
var channel = 'albychen5'

var options = {
	options: {
		debug: true
	},
	connection: {
		cluster: "aws",
		reconnect: true
	},
	identity: {
		username: "atmubot",
		password: "oauth:0flc2o06b2a8sgfh0kw1x6q1xouowg"
	},
	channels: ["albychen5"]
};

//creating the spotify client
var spotifyApi = new SpotifyWebApi({
  clientId : 'e5be13d5c6b543bea64f7b54a509cbc3',
  clientSecret : '68c1b24e910a444e989713f30a00da94'
});

//creating the tmi client and connecting to the channels
var client = new tmi.client(options);
client.connect();

//when someone sends a chat into the client
client.on('chat', function(channel, user, message, self) {
	if(self) return

	// help command
	if(message === "-help" || message === "-h") {
		helpActions = "-add to add a song, -currentSong for the current song, -twitter for my twitter handle";
		client.action(channel, helpActions);
	}

	// twitter command
	if(message.startsWith("-twitter") ) {
		reply = message.substring(9,message.length);
		client.action(channel, reply);
	}

	if(message === '-add')
	{
		spotifyApi.addTracksToPlaylist('albychen', '5s8NXNEjuuRWXf28GcLxmG', ["spotify:track:4ckuS4Nj4FZ7i3Def3Br8W"])
		.then(function(data) {
			console.log('Added tracks to playlist!');
			client.action(channel, 'added track to playlist');
		}, function(err) {
			console.log('Something went wrong!', err);
			client.action(channel, 'error occured, track not added');
		});
	}
});

client.on('connected', function(address,port) {
	client.action(channel, "Welcome to Atmu! To see a list of commands, type '-help' ");
});

client.on('disconnected', function(reason) {
	client.action(channel, "Goodbye.")
});