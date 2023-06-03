const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

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
	username:{
		type: String,
		required: true,
		unique: true
	},
	password:{
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	aCourse: [{

	}],
	status: {
		type: String,
		default: 'Y'
	},
	aJwtTokens: [{
		sToken: { type: String },
		dTimeStamp: { type: Date, default: Date.now }
	}],
})

studentSchema.statics.filterData = function (student) {
	student.__v = undefined
	student.aJwtTokens = undefined
	student.sPassword = undefined
	student.dUpdatedAt = undefined
	student.password = undefined
	return student
}
studentSchema.statics.findByToken = function (token) {
	var student = this
	var decoded
	try {
		decoded = jwt.verify(token, config.JWT_SECRET)
	} catch (e) {
		return Promise.reject(e)
	}
	var query = {
		_id: decoded._id,
		status: 'Y'
	}
	return student.findOne(query)
}
const StudentsModel = mongoose.model('Student', studentSchema)

module.exports = StudentsModel
