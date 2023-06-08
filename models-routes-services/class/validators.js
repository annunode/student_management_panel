const { body, param } = require('express-validator')
const { status } = require('../../data')

const addClass = [
	body('classTeacherId').not().isEmpty().isMongoId(),
	body('name').not().isEmpty().isString(),
    body('status').not().isEmpty().isIn(status)
]

const getClass = [
	param('id').not().isEmpty().isMongoId()
]
  
module.exports = {
	login,
	getStudent
}