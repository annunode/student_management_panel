
const router = require('express').Router()
const cronController = require('./controller')

router.get('/cron/change-attendace-status/v1', cronController.updateAttendance)



module.exports = router
