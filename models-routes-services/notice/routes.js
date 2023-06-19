const router = require('express').Router()
const noticeController = require('./controller')
const validators = require('./validators')
const { validateTeacher, validateAdmin, isStudentAuthenticated } = require('../../middlewares/middleware')

router.post('/teacher/notice/v1', validators.add, validateTeacher('CLASS','W'), noticeController.addNotice)
router.put('/teacher/notice/:id/v1', validators.update, validateTeacher('CLASS','W'), noticeController.update)
// router.get('/teacher/notice/:id/v1',validators.getHomework, validateTeacher('CLASS','R'), noticeController.getHomework)
// router.get('/teacher/notice/list/v1',validators.list,  validateTeacher('CLASS','R'), noticeController.list)



// router.post('/admin/notice/v1', validators.addHomework, validateAdmin('CLASS','W'), noticeController.addHomework)
// router.put('/admin/notice/:id/v1', validators.updateHomework, validateAdmin('CLASS','W'), noticeController.updateHomework)
// router.get('/admin/notice/:id/v1',validators.getHomework, validateAdmin('CLASS','R'), noticeController.getHomework)
// router.get('/admin/notice/list/v1',validators.list,  validateAdmin('CLASS','R'), noticeController.list)

// router.get('/student/notice/:id/v1',validators.getHomework, isStudentAuthenticated, noticeController.getHomework)
// router.get('/student/notice/list/v1',validators.list,  isStudentAuthenticated, noticeController.list)



module.exports = router
