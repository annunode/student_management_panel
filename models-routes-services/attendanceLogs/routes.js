
const router = require('express').Router()
const attendanceController = require('./controller')
const validators = require('./validators')
const {  validateTeacher } = require('../../middlewares/middleware')

router.post('/teacher/attendance/v1', validators.addAttendance,  validateTeacher('ATTENDANCE','W'), attendanceController.addAttendance)
router.put('/teacher/attendance/:id/v1', validators.updateAttendance,  validateTeacher('ATTENDANCE','W'), attendanceController.updateAttendance)

router.get('/teacher/attendance/:id/v1', validateTeacher('ATTENDANCE','R'), attendanceController.getSingleDayAttendance )
router.get('/teacher/attendance/v1', validateTeacher('ATTENDANCE','R'), attendanceController.list )


module.exports = router
