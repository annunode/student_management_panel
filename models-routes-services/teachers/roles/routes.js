const router = require('express').Router()
const roleController = require('./controller')
const validators = require('./validators')
const { validateTeacher, validateAdmin } = require('../../../middlewares/middleware')

router.post('/teacher/role/v1', validators.roleAdd, roleController.add)

router.get('/teacher/role/v1', validateTeacher('ROLE', 'R'), roleController.list)

router.get('/teacher/role/list/v1', validateTeacher('ROLE', 'R'), roleController.adminList)

router.get('/teacher/role/:id/v1', validateTeacher('ROLE', 'R'), roleController.get)

router.put('/teacher/role/:id/v1', validators.roleUpdate, validateTeacher('ROLE', 'W'), roleController.update)

router.delete('/teacher/role/:id/v1', validateTeacher('ROLE', 'W'), roleController.delete)


router.post('/admin/role/v1', validators.roleAdd, roleController.add)

router.get('/admin/role/v1', validateAdmin('ROLE', 'R'), roleController.list)

router.get('/admin/role/list/v1', validateAdmin('ROLE', 'R'), roleController.adminList)

router.get('/admin/role/:id/v1', validateAdmin('ROLE', 'R'), roleController.get)

router.put('/admin/role/:id/v1', validators.roleUpdate, validateAdmin('ROLE', 'W'), roleController.update)

router.delete('/admin/role/:id/v1', validateAdmin('ROLE', 'W'), roleController.delete)
module.exports = router