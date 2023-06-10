const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
	courseName: {
		type: String,
		required: true
	},
	teacher: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Teacher',
		required: true
	}
},{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

const Course = mongoose.model('Course', courseSchema)

module.exports = Course