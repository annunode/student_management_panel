const HomeWorkModel = require('./model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, getPaginationValues, pick } = require('../../helper/utilities.services')
const commentsModel = require('./comments/model')

class homeworkController {
	async list(req,res) {
		try{
			const { start, limit, sorting } = getPaginationValues(req.query)
			const data = await HomeWorkModel.find({classId: req.params.classId }).skip(start).limit(limit).sort(sorting).lean()
            const total = await HomeWorkModel.countDocuments({classId: req.params.classId })

			const aHomeWorkId = data.map(item=>item._id)
			const comments = await commentsModel.find({homeworkId:{ $in: aHomeWorkId }}).lean()

			let results 
			if(comments.length){
			results = data.map(homework=>{
				const hwComments = comments[comments.findIndex(item=>item.homeworkId.toString()===homework._id.toString())]
				return { ...homework, hwComments }
			})}else{
				results = data
			}
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].success.replace('##',  messages[req.userLanguage].homework),
				results,
                total
			})

		}catch(error){
			return catchError('homeworkController.list', error, req,res)
		}
	}

	async getHomework(req,res) {
		try{
			const data = await HomeWorkModel.findOne({_id: req.params.id}).lean()
			if(!data) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].Student),
		})
		const comments = await commentsModel.find({homeworkId: data._id}).lean()
		if(comments.length) data.comments = comments
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].success.replace('##',  messages[req.userLanguage].homework),
				data
			})
			
		}catch(error){
			return catchError('homeworkController.getClass', error, req,res)
		}
	}

    async addHomework(req,res) {
		try{
            req.body = pick(req.body, ['title', 'description', 'classId', 'subject'])

			const data = await HomeWorkModel.create({...req.body, teacherId: req.teacher._id})
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].add_success.replace('##',  messages[req.userLanguage].homework),
				data
			})
			
		}catch(error){
			return catchError('homeworkController.addClass', error, req,res)
		}
	}
	async updateHomework(req,res) {
		try{
            req.body = pick(req.body, ['title', 'description', 'classId', 'subject',])

			//add validation for same teacher add update
			await HomeWorkModel.updateOne({ _id: req.params.id },{...req.body, teacherId: req.teacher._id})
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].update_success.replace('##',  messages[req.userLanguage].homework)})
			
		}catch(error){
			return catchError('homeworkController.addClass', error, req,res)
		}
	}
}

module.exports = new homeworkController()
