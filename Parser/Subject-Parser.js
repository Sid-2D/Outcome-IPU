var os = require('os');
var len = 0, final = [];
var previousList = [];

module.exports = function (lists, db, cb) {
	lists.forEach((list, index) => {
		// Get clean data about the subjects.
		subjects = list.split(os.EOL).filter((ele) => (!(/^(S\.No\.)|(RESULT)/.test(ele)||(/^\f/.test(ele)))));
		for (var i = 0; i < subjects.length; i++) {
			if (/^Prepared Date:/.test(subjects[i])) {
				subjects = subjects.slice(0, i);
				break;
			}
		}
		currentList = [];
		// process.exit()
		subjects.forEach(function (subject) {
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
			currentList.push(obj);
		});
		final.push(currentList);
		if (index == lists.length - 1) {
			cb(final);
		}
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