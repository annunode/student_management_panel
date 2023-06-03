const jwt = require('jsonwebtoken')
// const bcrypt = require('bcryptjs')
const StudentsModel = require('../students/model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { removenull, catchError, pick} = require('../../helper/utilities.services')
const config = require('../../config/config')

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
			if (student.aJwtTokens.length < config.LOGIN_HARD_LIMIT_student || config.LOGIN_HARD_LIMIT_student === 0) {
				student.aJwtTokens.push(newToken)
			} else {
				student.aJwtTokens.splice(0, 1)
				student.aJwtTokens.push(newToken)
			}
  
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
			return catchError('StudentAuth.login', error, req, res)
		}
	}
}

module.exports = new StudentAuth()
