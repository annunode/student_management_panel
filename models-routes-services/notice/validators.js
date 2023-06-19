const { body, param } = require('express-validator')
const { noticeTypes } = require('../../data')
const ObjectId = require('mongoose').Types.ObjectId

const add = [
	body('title').not().isEmpty().isString(),
	body('description').not().isEmpty().isString(),
	body('type').not().isEmpty().isIn(noticeTypes),
	body('classId').custom((value, { req }) => {
		if (req.body.type === 'CLASS' && (!value || !ObjectId.isValid(value))) {
			throw new Error()
		}

		return true
	}),
	body('studentId').custom((value, { req }) => {
		if (req.body.type === 'PERSONAL' && (!value || !ObjectId.isValid(value))) {
			throw new Error()
		}
		return true
})
]
const update = [
	param('id').not().isEmpty(),
	body('title').optional().isString(),
	body('description').optional().isString(),
	body('type').not().isEmpty().isIn(noticeTypes),
	body('classId').custom((value, { req }) => {
		if (req.body.type === 'CLASS' && (!value || !ObjectId.isValid(value))) {
			throw new Error()
		}

		return true
	}),
	body('studentId').custom((value, { req }) => {
		if (req.body.type === 'PERSONAL' && (!value || !ObjectId.isValid(value))) {
			throw new Error()
		}
		return true
})
]

const get = [
	param('id').not().isEmpty().isMongoId()
]

const list = [
	param('classId').not().isEmpty().isMongoId()
]
  
  
module.exports = {
	add,
	update,
	get,
	list
}