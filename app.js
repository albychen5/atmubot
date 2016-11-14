var tmi = require('tmi.js');
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

var client = new tmi.client(options);
client.connect();

client.on('chat', function(channel, user, message, self) {
	if(self) return

	if(message === "-help" || message === "-h") {
		helpActions = "-add to add a song, -currentSong for the current song, -twitter for my twitter handle";
		client.action(channel, helpActions);
	}

	if(message.startsWith("-twitter ") ) {
		reply = message.substring(9,message.length);
		client.action(channel, reply);
	}
});

client.on('connected', function(address,port) {
	client.action(channel, "Welcome to Atmu! To see a list of commands, type '-help' ");
});

client.on('disconnected', function(reason) {
	client.action(channel, "Goodbye.")
});