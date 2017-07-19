// import { MongoClient } from 'mongodb'
var MongoClient = require('mongodb').MongoClient

MongoClient.connect(process.env.MONGO_URL || 'mongodb://localhost/Result', (err, db) => {
	if (err) {
		console.log('Crashed at mongodb connect:')
		console.log(err)
		process.exit()
	}
	db.collection('Student').find({
		Score: null,
		Examination: { $regex: /regular/gi }
	}).toArray((err, students) => {
		students.forEach((student, index) => {
			var updates = {}
			updates['Score'] = student.Marks.reduce((sum, value) => (sum + parseInt(value.Total)), 0)
			updates['Score'] /= student.Marks.length
			updates['Credit'] = student.Marks.reduce((sum, value) => (sum + parseInt(value.Total) * parseInt(value.Credits)), 0)
			updates['Credit'] /= student.Marks.reduce((sum, value) => (sum + parseInt(value.Credits)), 0)
			db.collection('Student').update({ _id: student['_id'] }, { $set: updates }, err => {
				if (err) {
					console.log('Crashed at Mongodb Update:')
					console.log(err)
					db.close()
					process.exit()
				}
				if (index === students.length - 1) {
					console.log('Done.')
					db.close()
				}
			})
		})
		if (students.length === 0) {
			console.log('No records matched.')
			db.close()
		}
	})
})