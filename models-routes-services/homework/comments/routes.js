
const router = require('express').Router()
const commentsController = require('./controller')
const validators = require('./validators')
const { validateTeacher, isStudentAuthenticated } = require('../../../middlewares/middleware')

router.post('/teacher/comments/v1', validators.addComent, validateTeacher('COMMENTS','W'), commentsController.addComment)
router.put('/teacher/comments/:id/v1', validators.updateComment, validateTeacher('COMMENTS','W'), commentsController.updateComment)
router.delete('/teacher/comments/:id/v1', validators.updateComment, validateTeacher('COMMENTS','W'), commentsController.deleteComment)

router.get('/teacher/comments/:id/v1',validators.updateComment, validateTeacher('COMMENTS','R'), commentsController.getComment)
router.get('/teacher/comments/list/:homeWorkId/v1', validators.list, validateTeacher('COMMENTS','R'), commentsController.list)

router.get('/student/comments/:id/v1', validators.updateComment, isStudentAuthenticated, commentsController.getComment)
router.get('/student/comments/:homeworkId/v1', validators.list, isStudentAuthenticated, commentsController.list)
router.put('/student/comments/:id/v1', validators.updateComment, isStudentAuthenticated, commentsController.updateComment)
router.post('/student/comments/v1', validators.addComent, isStudentAuthenticated, commentsController.addComment)
router.delete('/student/comments/:id/v1', validators.updateComment, isStudentAuthenticated, commentsController.deleteComment)




module.exports = router
