# ATMUBOT - the bridge between Twitch and Spotify
Will allow users to submit songs to a twitch bot that will be added to the spotify playlist of the stream

## Required packages:
- tmi.js (https://docs.tmijs.org/)
	- used to connect to a twitch channel's chat
- spotify-web-api-node (https://github.com/thelinmichael/spotify-web-api-node)
	- used as a wrapper to send HTTPs requests for spotify
- express.js
	- used as a lightweight web framework to create the authentication page

## Specifications
- Allows users to submit spotify songs through the twitch chat via URI, song name, or even artists and add them to a playlist
- Only uses copyright free music from NCS
- Runs on a DigitalOcean or AWS instance for production
- Also runs on a localhost for development purposes
- Can respond to other commands, such as a link to the kickstarter, website, or a description of what's going on
- Can respond to multiple users

## Future Features
- Fix the authentication issue by creating an Express.JS page that allows users to sign in to Spotify and authenticate the app
- Reply with the song name instead of just the URI when a song is added
- Suggest songs when a user submits an artist
- Add a random song if asked to
- Use refresh tokens to keep the app connected
- Fix parsing issues and graceful failure
- Add in new features/commands
- Deployed on a cloud server so can actually be used
- Multiple branches to learn the fundamentals of github

## Get Started
- Currently, pull both the Atmubot repository and the web-auth-api-examples repo (https://github.com/spotify/web-api-auth-examples)
- Open Terminal
	- BONUS: install iTerm like a real programmer
- cd into web-api-auth-examples
- `npm install`
- cd into authorization_code
- `node app.js`
- Open localhost:<whatever port it's connected to>
- Login to spotify
- Copy URL into a new sublime window
- Copy the access token ONLY (everything before '&refreshToken')
- Paste it into the accessToken var of atmubot/app.js
	- Access token is only valid for 6 minutes I believe... so if you get an authentication error re-copy it over
- open a new terminal window (CMD + T on iTerm)
- cd into atmubot
- `npm install`
- cd into atmubot
- `node app.js`
- Open twitch.com/albychen5
- You should now be able to type '-help' and the twitch bot should respond
- Now fix all of the problems !!

## Documentation/Reading
- https://developer.spotify.com/web-api/authorization-guide/
	- To understand the OAuth 2 workflow we are using
- https://docs.tmijs.org/
	- To understand how the tmi.js plugin works
- http://michaelthelin.se/spotify-web-api-node/
	- Documentation on the spotify node wrapper