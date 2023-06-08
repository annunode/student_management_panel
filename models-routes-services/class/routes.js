
const router = require('express').Router()
const classController = require('./controller')
const validators = require('./validators')
const { validate } = require('../../middlewares/middleware')

router.post('/class/v1', validate, classController.addClass)
router.get('/class/:id/v1', validate, classController.getSingeleclass)
router.get('/class/list/v1', validate, classController.list)


module.exports = router
