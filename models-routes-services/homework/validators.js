const { body, param } = require('express-validator')

const addHomework = [
	body('title').not().isEmpty().isString(),
	body('description').not().isEmpty().isString(),
	body('subject').not().isEmpty().isString(),
	body('classId').not().isEmpty().isMongoId()
]
const updateHomework = [
	body('title').optional().isString(),
	body('description').optional().isString(),
	body('subject').optional().isString(),
	body('classId').optional().isMongoId()
]

const getHomework = [
	param('id').not().isEmpty().isMongoId()
]

const list = [
	param('classId').not().isEmpty().isMongoId()
]
  
  
module.exports = {
	addHomework,
	updateHomework,
	getHomework,
	list
}