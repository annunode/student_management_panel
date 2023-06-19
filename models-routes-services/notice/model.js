const mongoose = require('mongoose')
const ClassModel = require('../class/model')
const TeacherModel = require('../teachers/model')
const StudentsModel = require('../students/model')
const { noticeTypes } = require('../../data')

const notice = new mongoose.Schema({
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
    },
    classId:{
        type: mongoose.Types.ObjectId,
        ref: ClassModel  
    },
    studentId:{
        type: mongoose.Types.ObjectId,
        ref: TeacherModel  
    },
    teacherId:{
        type: mongoose.Types.ObjectId,
        ref: StudentsModel  
    },
    type:{
        type: String,
        enum: noticeTypes,
        required: true
    }
},{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })


const NoticeModel = mongoose.model('notice', notice)

module.exports = NoticeModel
