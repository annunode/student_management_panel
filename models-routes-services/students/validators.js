const { body, param } = require('express-validator')

const login = [
	body('login').not().isEmpty(),
	body('password').not().isEmpty()
]

const getStudent = [
	param('id').not().isEmpty().isMongoId()
]
  
module.exports = {
	login,
	getStudents
}