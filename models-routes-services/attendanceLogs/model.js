const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const attendanceSchema = new mongoose.Schema({
	iTeacherId,iStudentId, attendance, onDAte
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

// module.exports = StudentsModel
