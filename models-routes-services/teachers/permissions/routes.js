const router = require('express').Router()
const permissionController = require('./controller')
const validators = require('./validators')
const { validateAdmin, validateTeacher } = require('../../../middlewares/middleware')

router.post('/teacher/permission/v1', validators.permissionAdd,  permissionController.add)

router.get('/teacher/permission/v1', validateTeacher('PERMISSION', 'R'), permissionController.list)

router.get('/teacher/permission/list/v1', validateTeacher('PERMISSION', 'R'), permissionController.adminList)

router.get('/teacher/permission/:id/v1', validateTeacher('PERMISSION', 'R'), permissionController.get)

router.put('/teacher/permission/:id/v1', validators.permissionUpdate, validateTeacher('PERMISSION', 'W'), permissionController.update)


router.post('/admin/permission/v1', validators.permissionAdd,  permissionController.add)

router.get('/admin/permission/v1', validateAdmin('PERMISSION', 'R'), permissionController.list)

router.get('/admin/permission/list/v1', validateAdmin('PERMISSION', 'R'), permissionController.adminList)

router.get('/admin/permission/:id/v1', validateAdmin('PERMISSION', 'R'), permissionController.get)

router.put('/admin/permission/:id/v1', validators.permissionUpdate, validateAdmin('PERMISSION', 'W'), permissionController.update)

module.exports = router