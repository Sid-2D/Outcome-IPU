var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(process.env.MONGO_URL || 'mongodb://localhost/Result', function (err, db) {
	if (err) {
		console.log("Crashed at init:");
		console.log(err);
		process.exit();
	}
	db.collection("Analyze").aggregate([
		{ $match: { "_id.Batch": { $gte: "2014" } } },
		{ $unwind: "$Students" },
		{ $group: {
			_id: { Programme: "$_id.Programme", Batch: "$_id.Batch", CollegeCode: "$_id.CollegeCode", Roll: "$Students.EnrollmentNumber", Name: "$Students.Name" },
			Results: { $push: "$Students.Scores" },
			Average: { $avg: "$Students.Scores" },
			Semesters: { $sum: 1 }
		} },
		{ $group: {
			_id: { Programme: "$_id.Programme", Batch: "$_id.Batch", CollegeCode: "$_id.CollegeCode" },
			Students: { $push: { Name: "$_id.Name", EnrollmentNumber: "$_id.Roll", Average: "$Average", Semesters: "$Semesters" } },
			count: { $sum: 1 }
		} },
		{ $project: { 
			Students: 1,
			count: 1
		} },
		{ $out: "ClassOverall" }
	]).toArray(function (err) {
		if (err) {
			console.log("Crashed at Aggregate framework:");
			console.log(err);
			db.close();
			process.exit();
		}
		console.log("Done.");
		db.close();
	});
});