var fs = require('fs'),
	child_process = require('child_process'),
	subjectParser = require('./Subject-Parser'),
	MongoClient = require('mongodb').MongoClient,
	studentParser = require('./Student-Parser'),
	fileName = process.argv[2].match(/Upload\\(.+?).pdf/)[1];

child_process.execSync(`pdftotext -raw Upload/${fileName}.pdf TXT/${fileName}.txt`);

var pdf = fs.readFileSync(`TXT/${fileName}.txt`, 'utf8');

var regexForStudents = /Result of Programme Code:([^]*?)\f/g;
var regexForSubjects = /S\.No\. Paper([^]*?)RESULT TAB/g;

var students = pdf.match(regexForStudents);
var subjects = pdf.match(regexForSubjects);

fs.writeFileSync('subjectsData.json', JSON.stringify(subjects, null, 2));
fs.writeFileSync('studentsData.json', JSON.stringify(subjects, null, 2));

process.env.LOCAL = 'mongodb://localhost/Result';

MongoClient.connect(process.env.LOCAL, function (err, db) {
	// Properly parse subjects and store them in MongoDB.
	if (err) {
		console.log("Crashed while connecting to db");
		console.log(err);
		process.exit();
	}
	subjectParser(subjects, db, function (subjectArray) {
		if (subjectArray.length) {
			fs.writeFileSync(`./FinalLists/Subjects/${fileName}-Subjects.txt`, JSON.stringify(subjectArray, null, 2));			
		}
		console.log('Subjects parsed.');
		// Properly parse students and store them in MongoDB.
		studentParser(students, subjectArray, db, function (final) {
			if (final.length) {
				fs.writeFileSync(`./FinalLists/Students/${fileName}-Students.txt`, JSON.stringify(final, null, 2));
			}
			console.log('Students parsed.');
			db.close();
		});
	});
});