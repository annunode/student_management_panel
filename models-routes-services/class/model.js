const mongoose = require('mongoose')
const TeacherModel = require('../teachers/model')
const classSchema = new mongoose.Schema({
	name: {
        type: String,
        required: true
    },
	status: {
		type: String,
		default: 'Y'
	},
    classTeacherId: {
        type: mongoose.Types.ObjectId,
        ref: TeacherModel,
        required: true
    },
    standard:
    {
        type: Number,
        required: true
    }
},{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })


const ClassModel = mongoose.model('classes', classSchema)

module.exports = ClassModel
