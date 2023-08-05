const { body } = require('express-validator')
const data = require('../../data')

const login = [
  body('login').not().isEmpty(),
  body('password').not().isEmpty()
]

const createSubAdmin = [
  body('name').not().isEmpty(),
  body('username').not().isEmpty(),
  body('email').isEmail().not().isEmpty().escape(),
  body('phoneNumber').not().isEmpty(),
  body('password').not().isEmpty(),
  body('roleId').not().isEmpty(),
  body('type').not().isEmpty().isIn(data.adminTypes)
]
const updateSubAdminV2 = [
  body('name').not().isEmpty(),
  body('username').not().isEmpty(),
  body('email').isEmail().escape(),
  body('phoneNumber').not().isEmpty(),
  body('roleId').not().isEmpty()
]

module.exports = {
  createSubAdmin,
  login,
  updateSubAdminV2
}
