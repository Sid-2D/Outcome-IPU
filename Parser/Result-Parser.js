var fs = require('fs'),
	child_process = require('child_process'),
	subjectParser = require('./Subject-Parser'),
	MongoClient = require('mongodb').MongoClient,
	studentParser = require('./Student-Parser'),
	fileName = process.argv[2].match(/Upload\\(.+?).pdf/)[1];

child_process.execSync(`pdftotext -raw Upload/${fileName}.pdf TXT/${fileName}.txt`);

var pdf = fs.readFileSync(`TXT/${fileName}.txt`, 'utf8');

var regexForStudents = /Result of Programme Code:([^]*?)\f/g;
var regexForSubjects = /S\.No\. Paper([^]*?)RESULT/g;

var students = pdf.match(regexForStudents);
var subjects = pdf.match(regexForSubjects);

// Get clean data about subjects.
subjects = subjects.join('').split('\r\n').filter((ele) => (!(/^(S\.No\.)|(RESULT)/.test(ele)||(/^\f/.test(ele)))));

process.env.LOCAL = 'mongodb://localhost/Result';

MongoClient.connect(process.env.LOCAL, function (err, db) {
	// Properly parse subjects and store them in MongoDB.
	if (err) {
		console.log("Crashed while connecting to db");
		console.log(err);
		process.exit();
	}
	subjectParser(subjects, db, function (final) {
		if (final.length) {
			fs.writeFileSync(`./FinalLists/Subjects/${fileName}-Subjects.txt`, JSON.stringify(final, null, 2));			
		}
		console.log('Subjects parsed.');
		// Properly parse students and store them in MongoDB.
		studentParser(students, db, function (final) {
			if (final.length) {
				fs.writeFileSync(`./FinalLists/Students/${fileName}-Students.txt`, JSON.stringify(final, null, 2));
			}
			console.log('Students parsed.');
			db.close();
		});
	});
});