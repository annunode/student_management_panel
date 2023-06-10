const router = require('express').Router()
const homeworkController = require('./controller')
const validators = require('./validators')
const { validateTeacher } = require('../../middlewares/middleware')

router.post('/teacher/homework/v1', validators.addHomework, validateTeacher('CLASS','W'), homeworkController.addHomework)
router.put('/teacher/homework/:id/v1', validators.updateHomework, validateTeacher('CLASS','W'), homeworkController.updateHomework)

router.get('/teacher/homework/:id/v1',validators.getHomework, validateTeacher('CLASS','R'), homeworkController.getHomework)
router.get('/teacher/homework/list/:classId/v1',validators.list,  validateTeacher('CLASS','R'), homeworkController.list)

router.get('/student/homework/:id/v1',validators.getHomework, validateTeacher('CLASS','R'), homeworkController.getHomework)
router.get('/student/homework/list/:classId/v1',validators.list,  validateTeacher('CLASS','R'), homeworkController.list)


module.exports = router
