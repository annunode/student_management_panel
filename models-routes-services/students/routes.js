
const router = require('express').Router()
const studentController = require('./controller')
const validators = require('./validators')
const { validate } = require('../../middlewares/middleware')

router.post('/student/login/v1', validators.login, validate, studentController.login)


module.exports = router
