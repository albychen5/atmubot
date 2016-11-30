var tmi = require('tmi.js');
var SpotifyWebApi = require('spotify-web-api-node');

var channel = 'albychen5' //twitch channel username

// required optons for tmi bot
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

// spotify credentials
var credentials = {
  clientId : 'e5be13d5c6b543bea64f7b54a509cbc3',
  clientSecret : '68c1b24e910a444e989713f30a00da94',
  redirectUri : 'http://localhost:5000/callback'
};

// creating the spotify client
var spotifyApi = new SpotifyWebApi(credentials);
// super janky by copy pasting the spotify auth code from web-api-auth-examples
spotifyApi.setAccessToken('BQAlJHIbt6VJW780QBrqkLOcFvJnccaasgxKGFohbkXaJd42WhWRimDf9eVGS4WkaSLi0xXC3GbMH4rbKGTwv7wiudJAfb56fvhexXeVhQaXJsV_s8tbSK2oNcWkTmW2gpotTVV3nvYdt-791lgTK101p7tY2pSi37ze3NLIX5TQQ9NiLQeoTKBFzlYA2E7OepcO8imYPv9n');

// not sure what code this is, something in the spotify-web-api-node example code
// var code = 'MQCbtKe23z7YzzS44KzZzZgjQa621hgSzHN';

// attempt at using the spotify-web-api-node authorizationCodeGrant to get the authorization code
// spotifyApi.authorizationCodeGrant(code)
//   .then(function(data) {
//     console.log('The token expires in ' + data.body['expires_in']);
//     console.log('The access token is ' + data.body['access_token']);
//     console.log('The refresh token is ' + data.body['refresh_token']);

//     // Set the access token on the API object to use it in later calls
//     spotifyApi.setAccessToken(data.body['access_token']);
//     spotifyApi.setRefreshToken(data.body['refresh_token']);
//   }, function(err) {
//     console.log('Something went wrong!', err);
//   });

// creating the tmi client and connecting to the twitch channel
var client = new tmi.client(options);
client.connect();

// when someone sends a chat into the client
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

	// if bot detects someone trying to add a song
	// expected structure is -add songUri
	if(message.startsWith('-add '))
	{

		songUri = message.substring(5, message.length);

		// add a track to the Test Playlist

		// spotifyApi.addTracksToPlaylist('albychen', '5s8NXNEjuuRWXf28GcLxmG', ["spotify:track:4ckuS4Nj4FZ7i3Def3Br8W"])
		// .then(function(data) {
		// 	console.log('Added tracks to playlist!');
		// 	client.action(channel, 'added track to playlist');
		// }, function(err) {
		// 	console.log('Something went wrong!', err);
		// 	client.action(channel, 'error occured, track not added');
		// });
	}
});

// when chat bot connects, show welcome message
client.on('connected', function(address,port) {
	client.action(channel, "Welcome to Atmu! To see a list of commands, type '-help' ");
});


// when chat bot disconnects, show goodbye message
client.on('disconnected', function(reason) {
	client.action(channel, "Goodbye.")
});