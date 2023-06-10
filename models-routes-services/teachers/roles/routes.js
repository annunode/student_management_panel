const router = require('express').Router()
const roleController = require('./controller')
const validators = require('./validators')
const { validateTeacher } = require('../../../middlewares/middleware')

router.post('/teacher/role/v1', validators.roleAdd, roleController.add)

router.get('/teacher/role/v1', validateTeacher('ROLE', 'R'), roleController.list)

router.get('/teacher/role/list/v1', validateTeacher('ROLE', 'R'), roleController.adminList)

router.get('/teacher/role/:id/v1', validateTeacher('ROLE', 'R'), roleController.get)

router.put('/teacher/role/:id/v1', validators.roleUpdate, validateTeacher('ROLE', 'W'), roleController.update)

router.delete('/teacher/role/:id/v1', validateTeacher('ROLE', 'W'), roleController.delete)

module.exports = router