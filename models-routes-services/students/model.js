const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const ClassModel = require('../class/model')
const { gender } = require('../../data')
const config = require('../../config/config')
const bcrypt = require('bcryptjs')
const saltRounds = 1
const salt = bcrypt.genSaltSync(saltRounds)

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
		enum: gender,
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
	classId: 
		{
			type: mongoose.Types.ObjectId,
			ref: ClassModel,
			required: true
		}
	,
	rollNo: { type: String, required: true },
	grNo: { type: String, required: true },
	motherName:  { type: String },
	fatherName:  { type: String },
},{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

studentSchema.statics.filterData = function (student) {
	student.__v = undefined
	student.aJwtTokens = undefined
	student.password = undefined
	student.updatedAt = undefined
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

studentSchema.pre('save', function (next) {
	var student = this
	if (student.isModified('password')) {
	student.password = bcrypt.hashSync(student.password, salt)
	}
	if (student.isModified('email')) {
	student.email = student.email.toLowerCase()
	}
	next()
  })
  
const StudentsModel = mongoose.model('Student', studentSchema)

module.exports = StudentsModel
