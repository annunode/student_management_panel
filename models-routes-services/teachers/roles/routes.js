const router = require('express').Router()
const roleController = require('./controller')
const validators = require('./validators')
const { validateAdmin } = require('../../../middlewares/middleware')

router.post('/admin/role/v1', validators.roleAdd, validateAdmin('ADMIN_ROLE', 'W'), roleController.add)

router.get('/admin/role/v1', validateAdmin('ADMIN_ROLE', 'R'), roleController.list)

router.get('/admin/role/list/v1', validateAdmin('ADMIN_ROLE', 'R'), roleController.adminList)

router.get('/admin/role/:id/v1', validateAdmin('ADMIN_ROLE', 'R'), roleController.get)

router.put('/admin/role/:id/v1', validators.roleUpdate, validateAdmin('ADMIN_ROLE', 'W'), roleController.update)

router.delete('/admin/role/:id/v1', validateAdmin('ADMIN_ROLE', 'W'), roleController.delete)

module.exports = router