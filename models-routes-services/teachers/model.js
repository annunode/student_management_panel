/* eslint-disable no-mixed-spaces-and-tabs */
const mongoose = require('mongoose')
const config = require('../../config/config')
const jwt = require('jsonwebtoken')

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
		required: true,
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
})

teacherSchema.statics.filterData = function (teacher) {
	teacher.__v = undefined
	teacher.aJwtTokens = undefined
	teacher.password = undefined
	teacher.dUpdatedAt = undefined
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
const TeacherModel = mongoose.model('Teacher', teacherSchema)

module.exports = TeacherModel