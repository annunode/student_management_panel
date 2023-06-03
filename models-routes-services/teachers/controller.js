const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
const TeachersModel = require('../teachers/model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { removenull, catchError, pick} = require('../../helper/utilities.services')
const config = require('../../config/config')

class TeacherAuth {
	async login(req, res) {
		try {
			req.body = pick(req.body, ['login', 'password'])
			removenull(req.body)
			let { login, sPushToken, password } = req.body
			// check rate limit for password sending from same ip at multiple time. we'll make sure not too many request from same ip will occurs.
			// const rateLimit = await checkRateLimit(5, `rlpassword:${login}`, getIp(req))
			// if (rateLimit === 'LIMIT_REACHED') return res.status(status.TooManyRequest).jsonp({ status: jsonStatus.TooManyRequest, message: messages[req.userLanguage].limit_reached.replace('##', messages[req.userLanguage].password) })
  
			login = String(login).toLowerCase().trim()
  
			let teacher = await TeachersModel.findOne({ $or: [{ email: login }, { phoneNumber: login }], status: 'Y' })

  
			if (!teacher) {
				return res.status(status.NotFound).jsonp({
					status: jsonStatus.NotFound,
					message: messages[req.userLanguage].auth_failed
				})
			}
  
			if (password!==teacher.password) {
				return res.status(status.BadRequest).jsonp({
					status: jsonStatus.BadRequest,
					message: messages[req.userLanguage].auth_failed
				})
			}

  
			const newToken = {
				sToken: jwt.sign({ _id: (teacher._id).toHexString() }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY }),
				sPushToken
			}
  
			// teacher can login in LOGIN_HARD_LIMIT_teacher time.
			// for e.g. LOGIN_HARD_LIMIT_teacher=5 -> teacher can login only for 5 times, After that we'll remove first login token from db.
			if (teacher.aJwtTokens.length < config.LOGIN_HARD_LIMIT_teacher || config.LOGIN_HARD_LIMIT_teacher === 0) {
				teacher.aJwtTokens.push(newToken)
			} else {
				teacher.aJwtTokens.splice(0, 1)
				teacher.aJwtTokens.push(newToken)
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
}

module.exports = new TeacherAuth()