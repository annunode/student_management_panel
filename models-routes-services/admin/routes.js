const router = require('express').Router()
const AdminCo = require('./services')
const validators = require('./validators')
const { validateAdmin, validate, isAdminAuthenticated, decrypt } = require('../../../middlewares/middleware')

router.post('/admin/auth/login/v1', validators.adminLogin, validate, AdminCo.login)

router.post('/admin/auth/sub-admin/v3', validators.createSubAdminV3, validateAdmin('SUBADMIN', 'W'), decrypt, AdminCo.createSubAdminV3)

router.put('/admin/auth/logout/v1', isAdminAuthenticated, AdminCo.logout)
