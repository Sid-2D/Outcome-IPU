var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/Result', function (err, db) {
	if (err) {
		console.log("Crashed at init:");
		console.log(err);
		process.exit();
	}
	db.collection('Student').aggregate([
		{ $match: { Score: null } },
		{ $unwind: "$Marks" },
		{ $lookup: {
          from: "Subject",
          localField: "Marks.Id",
          foreignField: "_id",
          as: "Sub"
        } },
        { $unwind: "$Sub" },
		{ $group: {
			_id: "$_id", 
			Marks: { $push: "$Marks" },
			Names: { $push: "$Sub" },
			Examination: { $first: "$Examination" },
			EnrollmentNumber: { $first: "$EnrollmentNumber" }
		} },
		{ $project: {
			_id: 1,
			Marks: 1,
			Names: 1,
			Examination: 1,
			EnrollmentNumber: 1,
			Score: { $sum: "$Marks.Total" }
		} }
	]).toArray(function (err, studentArray) {
		if (err) {
			console.log("Crashed at aggregate:");
			console.log(err);
			db.close();
			process.exit();
		}
		studentArray.forEach(function (student, index) {
			// Update the student record with Subject names and score
			var updates = {};
			updates['Marks'] = student.Marks;
			for (let i = 0; i < student.Marks.length; i++) {
				updates['Marks'][i]['Name'] = student.Names[i].Name;
			}
			if (/regular/gi.test(student.Examination)) {
				updates['Score'] = Number((student.Score / student.Marks.length).toFixed(2)); 
			} else {
				updates['Score'] = '-';
			}
			updates['CollegeCode'] = student.EnrollmentNumber.substr(3, 3);
			db.collection('Student').update({_id: student['_id']}, { $set: updates }, function (err) {
				if (err) {
					console.log("Crashed at update:");
					console.log(err);
					db.close();
					process.exit();
				}
				if (index === studentArray.length - 1) {
					console.log("Done.");
					db.close();
				}
			});	
		});
	});
});