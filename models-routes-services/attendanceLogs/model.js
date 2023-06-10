const mongoose = require('mongoose')
const StudentsModel = require('../students/model')
const TeachersModel = require('../teachers/model')
const ClassModel = require('../class/model')
const { status } = require('../../data')

const attendanceSchema = new mongoose.Schema({
	teacherId: { type: mongoose.Types.ObjectId, ref: TeachersModel, required: true },
	aStudentAttendance: [{ studentId:{ type: mongoose.Types.ObjectId, ref: StudentsModel },  status:{ type: String, enum: status}}],
	classId: { type: mongoose.Types.ObjectId, ref: ClassModel, required: true },
}, { timestamps: { createdAt: 'onDate', updatedAt: 'onUpdatedDate' } })


const AttendanceLogsModel = mongoose.model('attendancelogs', attendanceSchema)

module.exports = AttendanceLogsModel
