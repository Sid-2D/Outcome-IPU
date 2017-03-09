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
	res.sendFile(path.join(__dirname + '/../Front End/index.html'));
});

app.get('/:roll', function(req, res) {
	MongoClient.connect(process.env.MONGO_URL, function (err, db) {
		if (!err) {
			db.collection('Student').find({'EnrollmentNumber': req.params['roll']}).toArray(function (err, docs) {
				if (!err) {
					var returnDocument = [];
					docs.forEach(function(doc, index) {
						var subIds = doc.Marks.map(obj => obj.Id);
						db.collection('Subject').find({"_id" : {"$in" : subIds}}, {'_id': 1, 'Name': 1}).toArray(function (err, subs) {
							for (let i = 0; i < doc.Marks.length; i++) {
								for (let j = 0; j < subs.length; j++) {
									if (doc.Marks[i].Id === subs[j]['_id']) {
										doc.Marks[i].Name = subs[j].Name;
										break;
									}
								}
							}
							returnDocument.push(doc);
							if (index === docs.length - 1) {
								db.close();
								res.send(returnDocument);
							}
						});
					});
					if (docs.length === 0) {
						db.close();
						res.send([]);
					}
				} else {
					db.close();
					res.send(err);
				}
			});	
		} else {
			res.send(err);
		}
	});
});

app.listen(process.env.PORT || 3001, function () {
	console.log("Listening on port 3001");
});