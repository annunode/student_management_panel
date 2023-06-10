const { body } = require('express-validator')

const addAttendance = [
	body('classId').not().isEmpty().isMongoId(),
	body('aStudentAttendance').not().isEmpty().isArray()
]

const updateAttendance = [
	body('aStudentAttendance').not().isEmpty().isArray()
]

module.exports = {
	addAttendance,
	updateAttendance
}