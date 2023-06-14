
const router = require('express').Router()
const cronController = require('./controller')

router.get('/cron/attendance/v1', cronController.updateAttendance)



module.exports = router
