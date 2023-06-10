const ClassModel = require('./model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, getPaginationValues, pick } = require('../../helper/utilities.services')
const TeachersModel = require('../teachers/model')

class classController {
	async list(req,res) {
		try{
			const { start, limit, sorting } = getPaginationValues(req.query)
			const data = await ClassModel.find().skip(start).limit(limit).sort(sorting).lean()
            const total = await ClassModel.countDocuments()
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].success.replace('##',  messages[req.userLanguage].classes),
				data,
                total
			})

		}catch(error){
			return catchError('ClassController.list', error, req,res)
		}
	}

	async getClass(req,res) {
		try{
			const data = await ClassModel.findOne({_id: req.params.id}).lean()
			if(!data) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].Student),
		})
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].success.replace('##',  messages[req.userLanguage].classes),
				data
			})
			
		}catch(error){
			return catchError('ClassController.getClass', error, req,res)
		}
	}

    async addClass(req,res) {
		try{
            req.body = pick(req.body, ['name', 'status', 'standard'])

            const teacher = TeachersModel.findOne({_id: req.teacher.id, status: 'Y' }, { _id: 1 }).lean()
            if(!teacher) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest,  message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].teacher) })

			const data = await ClassModel.create({...req.body, classTeacherId:req.teacher.id})
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].add_success.replace('##',  messages[req.userLanguage].class),
				data
			})
			
		}catch(error){
			return catchError('ClassController.addClass', error, req,res)
		}
	}
}

module.exports = new classController()
