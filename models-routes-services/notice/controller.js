const NoticeModel = require('./model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, getPaginationValues, pick } = require('../../helper/utilities.services')
const ClassModel = require('../class/model')
const StudentsModel = require('../students/model')

class noticeController {
	async list(req,res) {
		try{
			const { start, limit, sorting } = getPaginationValues(req.query)
			const data = await NoticeModel.find({classId: req.params.classId }).skip(start).limit(limit).sort(sorting).lean()
            const total = await NoticeModel.countDocuments({classId: req.params.classId })

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
				message: messages[req.userLanguage].success.replace('##',  messages[req.userLanguage].notice),
				results,
                total
			})

		}catch(error){
			return catchError('noticeController.list', error, req,res)
		}
	}

	async get(req,res) {
		try{
			const data = await NoticeModel.findOne({_id: req.params.id}).lean()
			if(!data) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].Student),
		})
		const comments = await commentsModel.find({homeworkId: data._id}).lean()
		if(comments.length) data.comments = comments
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].success.replace('##',  messages[req.userLanguage].notice),
				data
			})
			
		}catch(error){
			return catchError('noticeController.getClass', error, req,res)
		}
	}

    async addNotice(req,res) {
		try{
			const adminId = req?.admin?._id ? req?.admin?._id : ''
			const teacherId = req?.teacher?._id ? req?.teacher?._id : ''
			const { classId ='' , studentId =''} = req.body

			if (req.body.classId){
			const oClass = await ClassModel.findById(classId, {_id: 1 } ).lean()
			if(!oClass) return res.status(status.BadRequest).jsonp({status:jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace("##", messages[req.userLanguage].class)})
			}

			if (req.body.studentId){
				const student = await StudentsModel.findById(studentId, { _id: 1 } ).lean()
				if(!student) return res.status(status.BadRequest).jsonp({status:jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace("##", messages[req.userLanguage].student)})
				}
            req.body = pick(req.body, ['title', 'description', 'classId', 'subject', 'studentId', 'type'])

			const data = await NoticeModel.create({...req.body, teacherId, adminId})
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].add_success.replace('##',  messages[req.userLanguage].notice),
				data
			})
			
		}catch(error){
			return catchError('noticeController.add', error, req,res)
		}
	}
	async update(req,res) {
		try{
			const adminId = req?.admin?._id ? req?.admin?._id : ''
			const teacherId = req?.teacher?._id ? req?.teacher?._id : ''
			const { classId ='' , studentId =''} = req.body
			
			const notice = await NoticeModel.findById(req.params.id, { id: 1 }).lean()
			if(!notice) return res.status(status.BadRequest).jsonp({status:jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace("##", messages[req.userLanguage].notice)})


			if (req.body.classId){
			const oClass = await ClassModel.findById(classId, {_id: 1 } ).lean()
			if(!oClass) return res.status(status.BadRequest).jsonp({status:jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace("##", messages[req.userLanguage].class)})
			}

			if (req.body.studentId){
				const student = await StudentsModel.findById(studentId, { _id: 1 } ).lean()
				if(!student) return res.status(status.BadRequest).jsonp({status:jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace("##", messages[req.userLanguage].student)})
				}
				req.body = pick(req.body, ['title', 'description', 'classId', 'subject', 'studentId', 'type'])

			//add validation for same teacher add update
			await NoticeModel.updateOne({ _id: req.params.id },{...req.body, teacherId, adminId })
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].update_success.replace('##',  messages[req.userLanguage].notice)})
			
		}catch(error){
			return catchError('noticeController.update', error, req,res)
		}
	}
}

module.exports = new noticeController()
