const mongoose = require('mongoose')
const TeacherModel = require('../teachers/model')
const ClassModel = require('../class/model')

const homework = new mongoose.Schema({
	title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    teacherId: {
        type: mongoose.Types.ObjectId,
        ref: TeacherModel,
        required: true
    },
    classId:{
        type: mongoose.Types.ObjectId,
        ref: ClassModel,
        required: true
    }
},{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })


const HomeWorkModel = mongoose.model('homework', homework)

module.exports = HomeWorkModel
