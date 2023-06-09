const mongoose = require('mongoose')
const TeacherModel = require('../teachers/model')
const classSchema = new mongoose.Schema({
	name: {
        type: String
    },
	status: {
		type: String,
		default: 'Y'
	},
    classTeacherId: {
        type: mongoose.Types.ObjectId,
        ref: TeacherModel
    }
})


const ClassModel = mongoose.model('classes', classSchema)

module.exports = ClassModel
