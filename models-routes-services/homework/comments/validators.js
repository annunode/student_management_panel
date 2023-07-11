const { body, param } = require('express-validator')

const addComent = [
	body('comment').not().isEmpty().isString(),
	body('homeworkId').optional()
]
const updateComment = [
	body('comment').optional().isString(),
]

const list = [
	body('homeworkId').optional()
]
const getComment = [
	param('id').not().isEmpty().isMongoId()
]

module.exports = {
	addComent,
	updateComment,
	list,
	getComment
}