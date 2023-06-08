const router = require('express').Router()
const permissionController = require('./controller')
const validators = require('./validators')
const { validateAdmin } = require('../../../middlewares/middleware')

router.post('/admin/permission/v1', validators.permissionAdd, validateAdmin('PERMISSION', 'W'), permissionController.add)

router.get('/admin/permission/v1', validateAdmin('PERMISSION', 'R'), permissionController.list)

router.get('/admin/permission/list/v1', validateAdmin('PERMISSION', 'R'), permissionController.adminList)

router.get('/admin/permission/:id/v1', validateAdmin('PERMISSION', 'R'), permissionController.get)

router.put('/admin/permission/:id/v1', validators.permissionUpdate, validateAdmin('PERMISSION', 'W'), permissionController.update)

module.exports = router