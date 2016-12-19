var tmi = require('tmi.js');
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyUser = '1238380192'; //spotify username
var spotifyPlaylist = '01jHwHi5D6jxefCMP1q7uy';
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var request = require('request'); // "Request" library

var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/'));
app.listen(5000);


var channel = 'albychen5' // channel
var spotifyApi = new SpotifyWebApi(credentials);
var stateKey = 'spotify_auth_state';
var accessToken = '';
var refreshToken = '';

// spotify credentials
var credentials = {
  clientId : '0a1ac6471975407ba1492994a094e157',
  clientSecret : '03da7fe68a554b8e8e0ba67521962bb5',
  redirectUri : 'http://localhost:5000/callback'
};

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};




 app.use(express.static(__dirname + '/public'))
    .use(cookieParser());


// getting auth
app.get('/login', function(req, res) {

   var state = generateRandomString(16);
   res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: credentials['clientId'],
      scope: scope,
      redirect_uri: credentials['redirectUri'],
      state: state
    }));
});



// app requests refresh and access tokens
// after checking the state parameter
app.get('/callback', function(req, res) {

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: credentials['redirectUri'],
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(credentials['clientId'] + ':' + credentials['clientSecret']).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var accessToken = body.access_token,
            refreshToken = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + accessToken },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: accessToken,
            refresh_token: refreshToken
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

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




spotifyApi.setAccessToken(accessToken);
console.log("setAccessToken function called\n");
console.log("AccessToken is currently : " + accessToken +"\n");

app.get('/start', function(req, res) {



});


// creating the spotify client
// var spotifyApi = new SpotifyWebApi(credentials);
// // super janky by copy pasting the spotify auth code from web-api-auth-examples
// spotifyApi.setAccessToken(accessToken);
// console.log("setAccessToken function called\n");
// console.log("AccessToken is currently : " + accessToken +"\n");

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
		j// add a track to the Test Playlist
		songUri = message.substring(5, message.length);
		spotifyApi.addTracksToPlaylist(spotifyUser, spotifyPlaylist, [songUri])
			.then(function(data) {
				console.log ('Added ' + songUri + ' to playlist');
				client.action(channel, 'Added ' + songUri + ' to playlist');
			}, function(err) {
				console.log('Something went wrong!', err);
				client.action(channel, 'error occured, track not added');
			});
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