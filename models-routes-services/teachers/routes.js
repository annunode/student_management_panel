
const router = require('express').Router()
const teacherController = require('./controller')
const validators = require('./validators')
const { validate } = require('../../middlewares/middleware')

router.post('/teacher/login/v1', validators.login, validate, teacherController.login)

router.post('/admin/teacher/v1', validators.add, validate, teacherController.add)
router.put('/admin/teacher/:id/v1', validators.update, validate, teacherController.update)
router.get('/admin/teacher/v1',  validate, teacherController.list)
router.get('/admin/teacher/:id/v1', validators.get, validate, teacherController.get)

router.get('/student/teacher/v1', validate, teacherController.list)
router.get('/student/teacher/:id/v1', validators.get, validate, teacherController.get)


module.exports = router
