var express = require('express'),
	app = express(),
	MongoClient = require('mongodb').MongoClient,
	bodyParser = require('body-parser'),
	path = require('path'),
	downloader = require('../Downloader/app.js'),
	sanitize = require('mongo-sanitize'),
	url = require('url');

const OLD_LIST = ['027', '072', '028', '073'];

app.use(bodyParser.json());

app.use(function (req, res, next) {
	console.log(`Connected client IP -> ${req.connection.remoteAddress}, port -> ${req.connection.remotePort}`);
	console.log(`${req.method} ${url.parse(req.url).path}`);
	console.log(`User-agent: ${req.headers['user-agent']}`);
	next();
});

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '/../Downloader/views'));

app.use('/download', downloader);

app.use(express.static(path.join(__dirname, '/../Front End/dist')));

app.get('/find/:roll', function (req, res) {
	var cleanRollNumber = sanitize(req.params['roll']);
	if (!/^\d{11}$/.test(cleanRollNumber)) {
		return res.send([]);
	}
	var subject = cleanRollNumber.substr(6, 3);
	var DB_URL = process.env.MONGO_URL_NEW || 'mongodb://localhost:27017/Result';
	if (OLD_LIST.includes(subject)) {
		DB_URL = process.env.MONGO_URL_OLD || 'mongodb://localhost:27017/Result';
	}
	MongoClient.connect(DB_URL, function (err, db) {
		if (err) {
			return res.send(err);			
		}
		db.collection('Student').find({'EnrollmentNumber': cleanRollNumber}).toArray(function (err, docs) {
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
	var subject = req.body['subject'];
	delete req.body['subject'];
	var DB_URL = process.env.MONGO_URL_NEW || 'mongodb://localhost:27017/Result';
	if (OLD_LIST.includes(subject)) {
		DB_URL = process.env.MONGO_URL_OLD || 'mongodb://localhost:27017/Result';
	}
	MongoClient.connect(DB_URL, function (err, db) {
		if (err) {
			return res.send(err);
		}
		var clean = sanitize(req.body);
		db.collection('Analyze').findOne({_id: clean}, function (err, doc) {
			if (err) {
				db.close();
				return res.send(err);				
			}
			res.send(doc);
			db.close();
		});
	});
});

// Default Route
app.get('*', function (req, res) {
	res.redirect('/');
});

app.listen(process.env.PORT || 3001, function () {
	console.log("Listening on port 3001");
});