const { body, param } = require('express-validator')

const login = [
	body('login').optional(),
	body('password').not().isEmpty()
]

const add = [
body('name').not().isEmpty().isString(),
body('username').not().isEmpty().isString(),
body('phoneNumber').not().isEmpty().isString(),
body('email').optional().isString(),
body('password').not().isEmpty().isString(),
body('roleId').not().isEmpty().isMongoId()
]


const update = [
body('name').optional().isString(),
body('email').optional().isString(),
body('phoneNumber').optional().isString(),
body('password').optional().isString(),
body('roleId').optional().isMongoId()
]


const get = [
param('id').isMongoId()]
module.exports = {
	login,
	add,
	update,
	get
}