const { body } = require('express-validator')

const login = [
	body('login').not().isEmpty(),
	body('password').not().isEmpty()
]
  
module.exports = {
	login
}