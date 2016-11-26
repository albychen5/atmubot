var express = require('express');
var app = express();
var PORT = 5000;

app.get('/', function(req, res){
	res.send('hello world');
});

app.listen(PORT, function() {
	console.log('Webapp started on port ' + PORT)
});