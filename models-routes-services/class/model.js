const mongoose = require('mongoose')
const TeacherModel = require('../teachers/model')
const courseSchema = new mongoose.Schema({
	name: {
        type: String
    },
	status: {
		type: String,
		default: 'Y'
	},
    classTeacherId: {
        type: mongoose.Schema.DataTypes.ObjectId,
        ref: TeacherModel
    }
})


const CourseModel = mongoose.model('classes', courseSchema)

module.exports = CourseModel
