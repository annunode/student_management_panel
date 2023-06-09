const mongoose = require('mongoose')
const StudentsModel = require('../students/model')
const TeachersModel = require('../teachers/model')
const { attendanceStatus } = require('../../data')

const attendanceSchema = new mongoose.Schema({
	teacherId: {type: mongoose.Types.ObjectId, ref:TeachersModel, required: true},
	studentId: {type: mongoose.Types.ObjectId, ref:StudentsModel, required: true},
	attendance:{type:String, enum: attendanceStatus, required: true},
	onDate: { type: Date}
})


const AttendanceLogsModel = mongoose.model('Student', attendanceSchema)

module.exports = AttendanceLogsModel
