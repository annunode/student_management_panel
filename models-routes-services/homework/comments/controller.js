const CommentModel = require('./model')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { catchError, getPaginationValues, pick, removenull } = require('../../../helper/utilities.services')

class commentsController {
	async list(req,res) {
		try{
			const { start, limit, sorting } = getPaginationValues(req.query)
			const data = await CommentModel.find({ homeworkId: req.params.homeworkId }).skip(start).limit(limit).sort(sorting).lean()
            const total = await CommentModel.countDocuments({ homeworkId: req.params.homeworkId })
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].success.replace('##',  messages[req.userLanguage].comments),
				data,
                total
			})

		}catch(error){
			return catchError('commentsController.list', error, req,res)
		}
	}

	async getComment(req,res) {
		try{
			const data = await CommentModel.findOne({_id: req.params.id}).lean()
			if(!data) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].Student),
		})
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].success.replace('##',  messages[req.userLanguage].comments),
				data
			})
			
		}catch(error){
			return catchError('commentsController.getClass', error, req,res)
		}
	}

    async addComment(req,res) {
		try{
            req.body = pick(req.body, ['comment','homeworkId'])

			req.body.teacherId = req?.teacher?._id ? req.teacher._id : ''
			req.body.studentId = req?.student?._id ? req.student._id : ''

			removenull(req.body)

			const data = await CommentModel.create({...req.body })
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].add_success.replace('##',  messages[req.userLanguage].comments),
				data
			})
			
		}catch(error){
			return catchError('commentsController.addClass', error, req,res)
		}
	}
	async updateComment(req,res) {
		try{
            req.body = pick(req.body, ['comment'])

			await CommentModel.updateOne({_id:req.params.id},{...req.body})
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].update_success.replace('##',  messages[req.userLanguage].comments),
			})
			
		}catch(error){
			return catchError('commentsController.updateComment', error, req,res)
		}
	}
	async deleteComment(req,res) {
		try{
            await CommentModel.deleteOne({_id: req.params._id })
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].del_success.replace('##',  messages[req.userLanguage].comments),
			})	
		}catch(error){
			return catchError('commentsController.deleteComment', error, req,res)
		}
	}
}

module.exports = new commentsController()
