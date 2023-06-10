const { body, param } = require('express-validator')
const { status } = require('../../data')

const addClass = [
	body('name').not().isEmpty().isString(),
    body('status').optional().isIn(status),
	body('standard').not().isEmpty().isInt(),
]

const getClass = [
	param('id').not().isEmpty().isMongoId()
]
  
module.exports = {
	addClass,
	getClass
}