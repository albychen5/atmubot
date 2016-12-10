// Atmubot Node.js application
// Creating a chatbot to take user spotify requests and putting it into a playlist

// ========= some initial setup that's required =========
//  required module for twitch chat
var tmi = require('tmi.js');

// required module so that we don't have to write HTTP requests when talking with spotify API (it's a wrapper)
var SpotifyWebApi = require('spotify-web-api-node');

// twitch channel username
var channel = 'albychen5';

// spotify username
var spotifyUser = 'albychen';

// spotify playlist
var spotifyPlaylist = '5s8NXNEjuuRWXf28GcLxmG';

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

// creating the tmi client and connecting to the twitch channel
var client = new tmi.client(options);
client.connect();

// spotify credentials from the Spotify Web API
var credentials = {
  clientId : 'e5be13d5c6b543bea64f7b54a509cbc3',
  clientSecret : '68c1b24e910a444e989713f30a00da94',
  redirectUri : 'http://localhost:5000/callback'
};

// creating the spotify client
var spotifyApi = new SpotifyWebApi(credentials);

// super janky by copy pasting the spotify auth code from web-api-auth-examples
// TODO (annie): figure out how to use the spotify node.js wrapper to authenticate
var accessToken = 'BQC8Wqm4NqAgixrWKBlw2Cyht8OY0o6b_hy_AQjacAuoISdrIxgWQnpr0v1y75gHpq8_r8YXa_W4W9QRsxCnNKvaudhzR-U6ou36Q7PW8x4kvwZDUmonPlg3SRSFzX1cqX5BevjefVpU5uNCrIOUFxGXLaPehxy5k9QV3KifNXnDTwFZsRZizOX8NtWw2pzJOOGpORkVJZC0';
spotifyApi.setAccessToken(accessToken);

// not sure what code this is, something in the spotify-web-api-node example code
// var code = 'MQCbtKe23z7YzzS44KzZzZgjQa621hgSzHN';

// Albert: attempt at using the spotify-web-api-node authorizationCodeGrant to get the authorization code
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

// ========= REAL code starts here =========
// when someone sends a chat into the client
client.on('chat', function(channel, user, message, self) {
	if(self) return

	// help command
	if(message === "-help" || message === "-h") {
		helpActions = "-add <songURI> to add a song, -twitter for my twitter handle";
		client.action(channel, helpActions);
	}

	// twitter command
	if(message.startsWith("-twitter") ) {
		reply = message.substring(9,message.length);
		client.action(channel, reply);
	}

	// if bot detects someone trying to add a song
	// expected structure is -add songUri
	// TODO (annie): some better command parsing, ensure that the format of the song URI is correct
	if(message.startsWith('-add '))
	{
		songUri = message.substring(5, message.length);
		spotifyApi.addTracksToPlaylist(spotifyUser, spotifyPlaylist, [songUri])
			.then(function(data) {
				console.log ('Added ' + songUri + ' to playlist');
				client.action(channel, 'Added ' + songUri + ' to playlist');
			}, function(err) {
				console.log('Something went wrong!', err);
				client.action(channel, 'error occured, track not added');
			});

		// add a track to the Test Playlist
		// TODO (annie): output the song name instead of the song URI to the twitch chat/console
		// TODO (annie): output the song artist as well
		spotifyApi.addTracksToPlaylist(spotifyUser, spotifyPlaylist, songUri)
			.then(function(data) {
				console.log('Added new track ' + songUri + ' to the playlist!');

				// Notifying user in twitch chat that song was added
				client.action(channel, 'Added new track ' + songUri + ' to the playlist!');
			}, function(err) {
				console.log('Error with input, song was not added');

				// Notifying user in twitch chat that there was an error
				client.action(channel, 'Error with input, add request ' + songUri + ' was not processed');
			});
	}

	// TODO (annie): add command to recommend some songs if user requests it
});

// when chat bot connects, show welcome message
client.on('connected', function(address,port) {
	client.action(channel, "Welcome to Atmu! To see a list of commands, type '-help' ");
});

// when chat bot disconnects, show goodbye message
// however, if you ^C the program from the terminal, this message will not show
client.on('disconnected', function(reason) {
	client.action(channel, "Goodbye.")
});
