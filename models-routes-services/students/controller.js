const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
const StudentsModel = require('../students/model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { removenull, catchError, pick, getPaginationValues} = require('../../helper/utilities.services')
const config = require('../../config/config')
// const TeachersModel = require('../teachers/model')
const ClassModel = require('../class/model')
const TeacherModel = require('../teachers/model')

class StudentAuth {
	async login(req, res) {
		try {
			req.body = pick(req.body, ['login', 'password'])
			removenull(req.body)
			let { login, sPushToken, password } = req.body
			// check rate limit for password sending from same ip at multiple time. we'll make sure not too many request from same ip will occurs.
			// const rateLimit = await checkRateLimit(5, `rlpassword:${login}`, getIp(req))
			// if (rateLimit === 'LIMIT_REACHED') return res.status(status.TooManyRequest).jsonp({ status: jsonStatus.TooManyRequest, message: messages[req.userLanguage].limit_reached.replace('##', messages[req.userLanguage].password) })
  
			login = String(login).toLowerCase().trim()
  
			let student = await StudentsModel.findOne({ $or: [{ email: login }, { phoneNumber: login }, { username: login }], status: 'Y' })

  
			if (!student) {
				return res.status(status.NotFound).jsonp({
					status: jsonStatus.NotFound,
					message: messages[req.userLanguage].auth_failed
				})
			}
  
			if (password!==student.password) {
				return res.status(status.BadRequest).jsonp({
					status: jsonStatus.BadRequest,
					message: messages[req.userLanguage].auth_failed
				})
			}

  
			const newToken = {
				sToken: jwt.sign({ _id: (student._id).toHexString() }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY }),
				sPushToken
			}
  
			// student can login in LOGIN_HARD_LIMIT_student time.
			// for e.g. LOGIN_HARD_LIMIT_student=5 -> student can login only for 5 times, After that we'll remove first login token from db.
  
			student.dLoginAt = new Date()
			await student.save()
    
			student = StudentsModel.filterData(student)
  
			return res.status(status.OK).set('Authorization', newToken.sToken).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].succ_login,
				data: student,
				Authorization: newToken.sToken
			})
		} catch (error) {
			return catchError('studentController.login', error, req, res)
		}
	}

	async list(req,res) {
		try{
			const { start, limit, sorting } = getPaginationValues(req.query)
			const data = await StudentsModel.find().skip(start).limit(limit).sort(sorting).lean()
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].success.replace('##',  messages[req.userLanguage].students),
				data
			})

		}catch(error){
			return catchError('studentController.list', error, req,res)
		}
	}

	async getSingleStudent(req,res) {
		try{
			const data = await StudentsModel.findOne({_id: req.params.id}).lean()
			if(!data) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].Student),
			})
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].success.replace('##',  messages[req.userLanguage].student),
				data
			})
			
		}catch(error){
			return catchError('StudentAuth.getSingeleStudent', error, req,res)
		}
	}
	async addStudent(req,res) {
		try{
			const { classId, username, email, phoneNumber } = req.body
			req.body = pick(req.body, ['classId','firstName','lastName','dateOfBirth','gender','email','phoneNumber','username','address','status','password','rollNo'])

			const classes = ClassModel.findOne({_id: classId, status: 'Y' }, { _id: 1 }).lean()
			if(!classes) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest,  message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].class) })
			
			const userExist = await StudentsModel.findOne({$or:[{ username },{ email }, { phoneNumber }]}, { _id: 1}).lean()
			if(userExist) return res.status(status.BadRequest).jsonp({status: jsonStatus.BadRequest, message: messages.English.already_exist.replace('##', messages.English.teacher)})
			
			const data = await StudentsModel.create({...req.body})
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].add_success.replace('##',  messages[req.userLanguage].student),
				data
			})
			
		}catch(error){
			return catchError('studentController.addClass', error, req,res)
		}
	}
	async updateStudent(req,res) {
		try{
			const { classId, username, email, phoneNumber } = req.body
			req.body = pick(req.body, ['classId','firstName','lastName','gender','email','phoneNumber','address','status','rollNo'])

			const classes = ClassModel.findOne({_id: classId, status: 'Y' }, { _id: 1 }).lean()
			if(!classes) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest,  message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].teacher) })

			const userExist = await StudentsModel.findOne({_id: {$ne: req.params.id }, $or:[{ username },{ email }, { phoneNumber }]}, { _id: 1}).lean()
			if(userExist) return res.status(status.BadRequest).jsonp({status: jsonStatus.BadRequest, message: messages.English.already_exist.replace('##', messages.English.teacher)})
			
			await StudentsModel.updateOne({_id: req.params.id }, {...req.body})
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].update_success.replace('##',  messages[req.userLanguage].student),
			})
			
		}catch(error){
			return catchError('studentController.updateStudent', error, req,res)
		}
	}
}

module.exports = new StudentAuth()
