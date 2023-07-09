const mongoose = require('mongoose')
const TeacherModel = require('../../teachers/model')
const StudentModel = require('../../students/model')
const HomeWorkModel = require('../model')
const AdminModel = require('../../admin/model')

const comments = new mongoose.Schema({
	homeworkId:{
        type: mongoose.Types.ObjectId,
        ref: HomeWorkModel,
    },
    teacherId: {
        type: mongoose.Types.ObjectId,
        ref: TeacherModel,
    },
    adminId: {
        type: mongoose.Types.ObjectId,
        ref: AdminModel,
    },
    studenId:{
        type: Number,
        ref: StudentModel,
    },
    comment:{
        type: String,
        required: true
    }
},{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })


const commentsModel = mongoose.model('comments', comments)

module.exports = commentsModel
