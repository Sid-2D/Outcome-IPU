var app = require('express')(),
	MongoClient = require('mongodb').MongoClient,
	bodyParser = require('body-parser'),
	path = require('path'),
	downloader = require('../Downloader/app.js'),
	sanitize = require('mongo-sanitize'),
	url = require('url');
	
app.use(bodyParser.json());

app.use(function (req, res, next) {
	console.log(`Connected client IP -> ${req.connection.remoteAddress}, port -> ${req.connection.remotePort}`);
	console.log(`${req.method} ${url.parse(req.url).path}`);
	next();
});

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '/../Downloader/views'));

app.use('/download', downloader);

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/../Front End/index.html'));
});

app.get('/:roll', function (req, res) {
	MongoClient.connect(process.env.MONGO_URL, function (err, db) {
		if (err) {
			return res.send(err);			
		}
		var clean = sanitize(req.params['roll']);
		db.collection('Student').find({'EnrollmentNumber': clean}).toArray(function (err, docs) {
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

app.listen(process.env.PORT || 3001, function () {
	console.log("Listening on port 3001");
});