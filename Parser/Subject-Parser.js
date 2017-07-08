var len = 0, final = [];

module.exports = function (subjects, db, cb) {
	subjects.forEach((subject, index) => {
		var obj = subjectBlueprint();
		subject = subject.split(' ');
		subject.shift();	// Get rid of the S.No.
		obj['_id'] = subject.shift();
		obj['PaperCode'] = subject.shift();
		obj['PassMarks'] = subject.pop();
		obj['MaxMarks'] = subject.pop();
		obj['Major'] = subject.pop();
		obj['Minor'] = subject.pop();
		obj['Kind'] = subject.pop();
		obj['Mode'] = subject.pop();
		obj['Exam'] = subject.pop();
		obj['Type'] = subject.pop();
		obj['Credits'] = subject.pop();
		obj['Name'] = subject.join(' ');
		db.collection('Subject').update({'_id': obj['_id']}, {$set: {'Name': obj['Name']}}, {upsert: true}, function (err) {
			if (!err) {
				final[len++] = obj;
			}
			if (index == subjects.length - 1) {
				cb(final);
			}
		});
	});
}

var subjectBlueprint = function () {
	return {
		'_id': null,
		'PaperCode': null,
		'Name': null,
		'Credits': null,
		'Type': null,
		'Exam': null,
		'Mode': null,
		'Kind': null,
		'Minor': null,
		'Major': null,
		'MaxMarks': null,
		'PassMarks': null
	};
};