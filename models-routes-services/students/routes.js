
const router = require('express').Router()
const studentController = require('./controller')
const validators = require('./validators')
const { validate, validateTeacher, validateAdmin } = require('../../middlewares/middleware')

router.post('/student/login/v1', validators.login, validate, studentController.login)
router.get('/student/:id/v1', validators.getStudent, validate, studentController.getSingleStudent)
router.get('/student/list/v1', validate, studentController.list)

router.post('/teacher/student/v1',validators.addStudent, validateTeacher('STUDENT','W'), studentController.addStudent)
router.put('/teacher/student/:id/v1',validators.updateStudent, validateTeacher('STUDENT','W'), studentController.updateStudent)
router.get('/teacher/student/:id/v1', validators.getStudent, validate, studentController.getSingleStudent)
router.get('/teacher/student/v1', validate, studentController.list)


router.post('/admin/student/v1',validators.addStudent, validateAdmin('STUDENT','W'), studentController.addStudent)
router.put('/admin/student/:id/v1',validators.updateStudent, validateAdmin('STUDENT','W'), studentController.updateStudent)
router.get('/admin/student/:id/v1', validators.getStudent, validate, studentController.getSingleStudent)
router.get('/admin/student/v1', validate, studentController.list)


module.exports = router
