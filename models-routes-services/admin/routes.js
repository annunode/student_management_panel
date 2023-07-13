const router = require('express').Router()
const adminController = require('./controller')
const validators = require('./validators')
const { validateAdmin, validate, isAdminAuthenticated, decrypt } = require('../../middlewares/middleware')

router.post('/admin/login/v1', validators.login, validate, adminController.login)

router.post('/admin/sub-admin/v1', validators.createSubAdmin, validateAdmin('SUBADMIN', 'W'), decrypt, adminController.createSubAdmin)
router.put('/admin/sub-admin/:id/v3', validators.updateSubAdminV2, validateAdmin('SUBADMIN', 'W'), decrypt, adminController.update)

router.get('/admin/sub-admin/list/v1', validateAdmin('SUBADMIN', 'R'), adminController.list)
router.get('/admin/sub-admin/:id/v1', validateAdmin('SUBADMIN', 'R'), adminController.get)

router.put('/admin/logout/v1', isAdminAuthenticated, adminController.logout)


module.exports = router