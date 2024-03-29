const jwt = require('jsonwebtoken')
const StudentsModel = require('../students/model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { removenull, catchError, pick, getPaginationValues} = require('../../helper/utilities.services')
const config = require('../../config/config')
const ClassModel = require('../class/model')
const bcrypt = require('bcryptjs')


class StudentAuth {
	async login(req, res) {
		try {
			req.body = pick(req.body, ['login', 'password'])
			removenull(req.body)
			let { login, sPushToken, password } = req.body
  
			login = String(login).toLowerCase().trim()
  
			let student = await StudentsModel.findOne({ $or: [{ email: login }, { phoneNumber: login }, { username: login }], status: 'Y' })

  
			if (!student) {
				return res.status(status.NotFound).jsonp({
					status: jsonStatus.NotFound,
					message: messages[req.userLanguage].auth_failed
				})
			}
  
			if (!bcrypt.compareSync(password, student.password)) {
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
			const query = {}
			query._id = req?.params?.id ? req.params.id : req?.student?.id

			const data = await StudentsModel.findOne(query).lean()
			if(!data) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].student),
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
			req.body = pick(req.body, ['classId','firstName','lastName','dateOfBirth','gender','email','phoneNumber','username','address','status','password','rollNo', 'grNo', 'motherName', 'fatherName'])

			const classes = ClassModel.findOne({_id: classId, status: 'Y' }, { _id: 1 }).lean()
			if(!classes) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest,  message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].class) })
			
			const userExist = await StudentsModel.findOne({$or:[{ username },{ email }, { phoneNumber }]}, { _id: 1}).lean()
			if(userExist) return res.status(status.BadRequest).jsonp({status: jsonStatus.BadRequest, message: messages.English.already_exist.replace('##', messages.English.student)})
			
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
			req.body = pick(req.body, ['classId','firstName','lastName','gender','email','phoneNumber','address','status','rollNo', 'grNo', 'motherName', 'fatherName'])

			const classes = ClassModel.findOne({_id: classId, status: 'Y' }, { _id: 1 }).lean()
			if(!classes) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest,  message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].student) })

			const userExist = await StudentsModel.findOne({_id: {$ne: req.params.id }, $or:[{ username },{ email }, { phoneNumber }]}, { _id: 1}).lean()
			if(userExist) return res.status(status.BadRequest).jsonp({status: jsonStatus.BadRequest, message: messages.English.already_exist.replace('##', messages.English.student)})
			
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

