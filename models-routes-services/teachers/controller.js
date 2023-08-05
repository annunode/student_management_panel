const jwt = require('jsonwebtoken')
const TeachersModel = require('../teachers/model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { removenull, catchError, pick, getPaginationValues} = require('../../helper/utilities.services')
const config = require('../../config/config')
const RolesModel = require('./roles/model')
const ObjectId = require('mongoose').Types.ObjectId
const bcrypt = require('bcryptjs')

class TeacherAuth {
	async login(req, res) {
		try {
			req.body = pick(req.body, ['login', 'password'])
			removenull(req.body)
			let { login, sPushToken, password } = req.body
			
			login = String(login).toLowerCase().trim()
  
			let teacher = await TeachersModel.findOne({ $or: [{ email: login }, { phoneNumber: login }, { username: login }], status: 'Y' })

  
			if (!teacher) {
				return res.status(status.NotFound).jsonp({
					status: jsonStatus.NotFound,
					message: messages[req.userLanguage].auth_failed
				})
			}
  
			if (!bcrypt.compareSync(password, teacher.password)) {
				return res.status(status.BadRequest).jsonp({
				status: jsonStatus.BadRequest,
				message: messages[req.userLanguage].auth_failed
				})
			}

  
			const newToken = {
				sToken: jwt.sign({ _id: (teacher._id).toHexString() }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY }),
				sPushToken
			}
  
			teacher.dLoginAt = new Date()
			await teacher.save()
    
			teacher = TeachersModel.filterData(teacher)
  
			return res.status(status.OK).set('Authorization', newToken.sToken).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].succ_login,
				data: teacher,
				Authorization: newToken.sToken
			})
		} catch (error) {
			return catchError('teacherAuth.login', error, req, res)
		}
	}

async list(req,res) {
		try{
			const { start, limit, sorting } = getPaginationValues(req.query)
			let query = { status: 'Y' }

			const data = await TeachersModel.find(query).skip(start).limit(limit).sort(sorting).lean()
            const total = await TeachersModel.countDocuments(query)

			const filterData = data.map(item=>TeachersModel.filterData(item))
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].success.replace('##',  messages[req.userLanguage].teacher),
				data:filterData,
                total
			})

		}catch(error){
			return catchError('TeacherAuth.list', error, req,res)
		}
	}

	async get(req,res) {
		try{
			const data = await TeachersModel.findOne({_id: req.params.id}).lean()
			if(!data) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].teacher),
		})
		TeachersModel.filterData(data)
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].success.replace('##',  messages[req.userLanguage].teacher),
				data
			})
			
		}catch(error){
			return catchError('TeacherAuth.getClass', error, req,res)
		}
	}

    async add(req,res) {
		try{
			const adminId = req?.admin?._id ? req?.admin?._id : ''
			const teacherId = req?.teacher?._id ? req?.teacher?._id : ''
			const { roleId, username, email } = req.body

			const userExist = await TeachersModel.findOne({$or:[{ username },{ email }]}, { _id: 1}).lean()
			if(userExist) return res.status(status.BadRequest).jsonp({status: jsonStatus.BadRequest, message: messages.English.already_exist.replace('##', messages.English.teacher)})
			
			const role = await RolesModel.findOne({_id:roleId, eStatus: 'Y'}).lean()
			if(!role) return res.status(status.BadRequest).jsonp({status: jsonStatus.BadRequest, message: messages.English.invalid.replace('##', messages.English.role)})
			


            req.body = pick(req.body, ['name', 'username', 'email', 'phoneNumber', 'password', 'status', 'roleId'])

			const data = await TeachersModel.create({...req.body, teacherId, adminId})
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].add_success.replace('##',  messages[req.userLanguage].teacher),
				data
			})
			
		}catch(error){
			return catchError('TeacherAuth.add', error, req,res)
		}
	}
	async update(req,res) {
		try{
			
			const teacher  = await TeachersModel.findById(req.params.id, { id: 1 }).lean()
			if(!teacher) return res.status(status.BadRequest).jsonp({status:jsonStatus.BadRequest, message: messages[req.userLanguage].not_exist.replace("##", messages[req.userLanguage].teacher)})
			
			const { username, email, roleId } = req.body
			const userExist = await TeachersModel.findOne({_id: { $ne: req.params.id } ,$or:[{ username },{ email }]}, { _id: 1}).lean()
			if(userExist) return res.status(status.BadRequest).jsonp({status: jsonStatus.BadRequest, message: messages.English.already_exist.replace('##', messages.English.teacher)})
			
			if(req.body.roleId){
			const role = await RolesModel.findOne({_id:roleId, eStatus: 'Y'}).lean()
			if(!role) return res.status(status.BadRequest).jsonp({status: jsonStatus.BadRequest, message: messages.English.invalid.replace('##', messages.English.role)})
			}

			req.body = pick(req.body, ['name', 'username', 'email', 'phoneNumber', 'status', 'roleId'])

			//add validation for same teacher add update
			await TeachersModel.updateOne({ _id: ObjectId(req.params.id) },{...req.body })
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].update_success.replace('##',  messages[req.userLanguage].teacher)})
			
		}catch(error){
			return catchError('TeacherAuth.update', error, req,res)
		}
	}



}
module.exports = new TeacherAuth()
