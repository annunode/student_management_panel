const { body, param, query } = require('express-validator')
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
	query('classId').custom((value, { req }) => {
		if (req.query.type === 'CLASS' && (!value || !ObjectId.isValid(value)) && req?.student?.id) {
			throw new Error()
		}

		return true
	}),
	query('studentId').custom((value, { req }) => {
		if (req.query.type === 'PERSONAL' && (!value || !ObjectId.isValid(value)) && req?.student?.id) {
			throw new Error()
		}
		return true
})]
  
  
module.exports = {
	add,
	update,
	get,
	list
}