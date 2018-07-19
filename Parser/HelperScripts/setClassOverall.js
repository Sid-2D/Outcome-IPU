var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(process.env.MONGO_URL || 'mongodb://localhost/Result', function (err, db) {
	if (err) {
		console.log("Crashed at init:");
		console.log(err);
		process.exit();
	}
	db.collection("Analyze").aggregate([
		{ $match: { "_id.Batch": { $gte: "2014" } } },
		{ $group: {
			_id: { Programme: "$_id.Programme", Batch: "$_id.Batch", CollegeCode: "$_id.CollegeCode" },
			Semesters: { $push: { Sem: "$_id.Semester", Students: "$Students" } },
		} },
		// { $unwind: "$Students" },
		// { $sort: { "Students.Scores": -1 } },
		// { $group: {
		// 	_id: "$_id",
		// 	Students: { $push: "$Students" },
		// 	count: { $sum: 1 }
		// } },
		{ $project: { 
			Semesters: 1,
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