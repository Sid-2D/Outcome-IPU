var app = require('express')(),
	MongoClient = require('mongodb').MongoClient,
	bodyParser = require('body-parser'),
	path = require('path');
	
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header("Allow-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/../Front End/debug.html'));
});

app.get('/:roll', function (req, res) {
	MongoClient.connect(process.env.MONGO_URL, function (err, db) {
		if (err) {
			return res.send(err);			
		}
		db.collection('Student').find({'EnrollmentNumber': req.params['roll']}).toArray(function (err, docs) {
			if (err) {
				db.close();
				return res.send(err);
			}
			res.send(docs);
			db.close();
		});
	});
});

app.post('/rank', function (req, res) {
	MongoClient.connect(process.env.MONGO_URL, function (err, db) {
		if (err) {
			return res.send(err);
		}
		db.collection('Analyze').findOne({_id: req.body}, function (err, doc) {
			if (err) {
				db.close();
				return res.send(err);				
			}
			res.send(doc);
			db.close();
		});
	});
});

app.listen(process.env.PORT || 3001, function () {
	console.log("Listening on port 3001");
});