
const router = require('express').Router()
const userController = require('./controller')
const validators = require('./validators')
const { validate } = require('../../middlewares/middleware')

router.post('/teacher/login/v1', validators.login, validate, userController.login)


module.exports = router
