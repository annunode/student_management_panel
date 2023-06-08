const { body, param } = require('express-validator')

const login = [
	body('login').not().isEmpty(),
	body('password').not().isEmpty()
]

const getStudent = [
	param('id').not().isEmpty().isMongoId()
]

const addStudent = [
	
]
  
module.exports = {
	login,
	getStudent,
	addStudent
}