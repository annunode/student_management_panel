/* eslint-disable no-mixed-spaces-and-tabs */
const mongoose = require('mongoose')
const config = require('../../config/config')
const jwt = require('jsonwebtoken')
const RolesModel = require('./roles/model')
const bcrypt = require('bcryptjs')
const saltRounds = 1
const salt = bcrypt.genSaltSync(saltRounds)

const teacherSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		unique: true
	},
	phoneNumber: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	status: {
		type: String,
		default: 'Y'
	},
	aJwtTokens: [{
		sToken: { type: String },
		dTimeStamp: { type: Date, default: Date.now }
	}],
	roleId: { type: mongoose.Types.ObjectId , ref:RolesModel, required: true}
},{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

teacherSchema.statics.filterData = function (teacher) {
	teacher.__v = undefined
	teacher.aJwtTokens = undefined
	teacher.password = undefined
	teacher.updatedAt = undefined
	return teacher
}
teacherSchema.statics.findByToken = function (token) {
	var teacher = this
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
	return teacher.findOne(query)
}

teacherSchema.pre('save', function (next) {
	var teacher = this
	if (teacher.isModified('password')) {
	  teacher.password = bcrypt.hashSync(teacher.password, salt)
	}
	if (teacher.isModified('email')) {
	  teacher.email = teacher.email.toLowerCase()
	}
	next()
  })
  

const TeacherModel = mongoose.model('Teacher', teacherSchema)

module.exports = TeacherModel