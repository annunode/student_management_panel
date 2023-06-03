const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	dateOfBirth: {
		type: Date,
		required: true
	},
	gender: {
		type: String,
		enum: ['Male', 'Female', 'Other'],
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	phoneNumber: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	aCourse: [{

	}]
})

const Student = mongoose.model('Student', studentSchema)

module.exports = Student