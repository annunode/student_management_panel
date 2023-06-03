
const router = require('express').Router()
const teacherContrller = require('./controller')
const validators = require('./validators')
const { validate } = require('../../middlewares/middleware')

router.post('/teacher/login/v1', validators.login, validate, teacherContrller.login)


module.exports = router
