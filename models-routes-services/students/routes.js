
const router = require('express').Router()
const studentController = require('./controller')
const validators = require('./validators')
const { validate, validateTeacher } = require('../../middlewares/middleware')

router.post('/student/login/v1', validators.login, validate, studentController.login)
router.get('/student/:id/v1', validators.getStudent, validate, studentController.getSingeleStudent)
router.get('/student/list/v1', validate, studentController.list)

router.post('/teacher/student/v1',validators.addStudent, validateTeacher('STUDENT','W'), studentController.addStudent)
router.put('/teacher/student/:id/v1',validators.addStudent, validateTeacher('STUDENT','W'), studentController.updateStudent)


module.exports = router
