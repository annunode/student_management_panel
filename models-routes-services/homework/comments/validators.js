const { body, param } = require('express-validator')

const addComent = [
	body('comment').not().isEmpty().isString(),
	body('homeworkId').not().isEmpty().isMongoId(),
]
const updateComment = [
	body('comment').optional().isString(),
]

const list = [
	param('homeworkId').not().isEmpty().isMongoId()
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