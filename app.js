var tmi = require('tmi.js');

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
	if(message === "!twitter") {
		client.action("albychen5", "twitter.com/algebraprodigy");
	}
	client.action("albychen5", "hello " + user['display-name']);
});

client.on('connected', function(address,port) {
	client.action("albychen5", "Hello World");
});