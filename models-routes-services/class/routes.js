
const router = require('express').Router()
const classController = require('./controller')
const validators = require('./validators')
const { validateTeacher } = require('../../middlewares/middleware')

router.post('/teacher/class/v1', validators.addClass, validateTeacher('CLASS','W'), classController.addClass)
router.get('/teacher/class/:id/v1',validators.getClass, validateTeacher('CLASS','R'), classController.getClass)
router.get('/teacher/class/list/v1',  validateTeacher('CLASS','R'), classController.list)


module.exports = router
