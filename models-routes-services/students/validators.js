const { body, param } = require('express-validator')
const { gender, status }= require('../../data')

const login = [
	body('login').not().isEmpty(),
	body('password').not().isEmpty()
]

const getStudent = [
	param('id').not().isEmpty().isMongoId()
]

const addStudent = [
	body('classId').not().isEmpty().isMongoId(),
	body('firstName').not().isEmpty().isString(),
	body('lastName').not().isEmpty().isString(),
	body('password').not().isEmpty().isString(),
	body('dateOfBirth').not().isEmpty().isString(),
	body('gender').not().isEmpty().isIn(gender),
	body('email').not().isEmpty().isEmail(),
	body('phoneNumber').not().isEmpty().isMobilePhone(),
	body('username').not().isEmpty().isAlphanumeric(),
	body('address').optional().isString(),
	body('status').optional().isIn(status),
	body('rollNo').not().isEmpty().isString(),
	body('grNo').not().isEmpty().isString()
]
const updateStudent = [
		body('classId').optional().isMongoId(),
		body('firstName').optional().isString(),
		body('lastName').optional().isString(),
		body('dateOfBirth').optional().isString(),
		body('gender').optional().isIn(gender),
		body('email').optional().isEmail(),
		body('phoneNumber').optional().isMobilePhone(),
		body('address').optional().isString(),
		body('status').optional().isIn(status),
		body('rollNo').optional().isString()

]
  
module.exports = {
	login,
	getStudent,
	addStudent,
	updateStudent
}