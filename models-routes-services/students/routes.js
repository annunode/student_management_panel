
const router = require('express').Router()
const studentController = require('./controller')
const validators = require('./validators')
const { validate } = require('../../middlewares/middleware')

router.post('/student/login/v1', validators.login, validate, studentController.login)
router.get('/student/:id/v1', validators.getStudents, validate, studentController.getSingeleStudent)
router.get('/student/list/v1', validate, studentController.list)


module.exports = router
