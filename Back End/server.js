var app = require('express')(),
	// MongoClient = require('mongodb').MongoClient,
	bodyParser = require('body-parser'),
	path = require('path');

app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header("Allow-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/../Front End/index.html'));
});

app.get('/:roll', function(req, res) {
	res.json({"num": 1});
});

app.listen(3001, function () {
	console.log("Listening on port 3001");
});