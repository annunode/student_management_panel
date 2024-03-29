/* eslint-disable no-empty */
/**
 * Auth middleware containes the common methods to authenticate user or admin by token.
 * @method {validateAdmin('NOTICE','R')} is for authenticating the token and make sure its a admin.
 * @method {isUserAuthenticated} is for authenticating the token.
 */
const jwt = require('jsonwebtoken')
const AdminsModel = require('../models-routes-services/admin/model')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { messages, status, jsonStatus } = require('../helper/api.responses')
const { validationResult } = require('express-validator')
const config = require('../config/config')
const RolesModel = require('../models-routes-services/teachers/roles/model')
const TeachersModel = require('../models-routes-services/teachers/model')

const validateAdmin = (sKey, eType) => {
	return async (req, res, next) => {
		try {
			const token = req.header('Authorization')
			req.userLanguage = 'English'
			if (!token) {
				return res.status(status.Unauthorized).jsonp({
					status: jsonStatus.Unauthorized,
					message: messages[req.userLanguage].err_unauthorized
				})
			}
			let admin
			try {
				admin = await AdminsModel.findByToken(token)
			} catch (err) {
				return res.status(status.Unauthorized).jsonp({
					status: jsonStatus.Unauthorized,
					message: messages[req.userLanguage].err_unauthorized
				})
			}
			if (!admin) {
				return res.status(status.Unauthorized).jsonp({
					status: jsonStatus.Unauthorized,
					message: messages[req.userLanguage].err_unauthorized
				})
			}
			req.admin = admin

			let errors
			if (req.admin.type === 'SUPER') {
				errors = validationResult(req)
				if (!errors.isEmpty()) {
					return res.status(status.UnprocessableEntity).jsonp({
						status: jsonStatus.UnprocessableEntity,
						errors: errors.array()
					})
				}

				return next(null, null)
			} else {
				if (!req.admin.roleId) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].access_denied })

				const role = await RolesModel.findOne({ _id: ObjectId(req.admin.roleId), eStatus: 'Y' }, { aPermissions: 1 }).lean()
				if (!role) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].access_denied })

				const hasPermission = role.aPermissions.find((permission) => {
					return (
						permission.sKey === sKey &&
            (permission.eType === eType ||
              (eType === 'R' && permission.eType === 'W'))
					)
				})

				if (!hasPermission) {

					if (!hasPermission) {
						let message

						switch (eType) {
						case 'R':
							message = messages[req.userLanguage].read_access_denied.replace('##', sKey)
							break
						case 'W':
							message = messages[req.userLanguage].write_access_denied.replace('##', sKey)
							break
						case 'N':
							message = messages[req.userLanguage].access_denied
							break
						}

						return res.status(status.Unauthorized).jsonp({
							status: jsonStatus.Unauthorized,
							message
						})
					}
				}
				errors = validationResult(req)
				if (!errors.isEmpty()) {
					return res.status(status.UnprocessableEntity).jsonp({
						status: jsonStatus.UnprocessableEntity,
						errors: errors.array()
					})
				}

				return next(null, null)
			}
		} catch (error) {
			return res.status(status.InternalServerError).jsonp({
				status: jsonStatus.InternalServerError,
				message: messages[req.userLanguage].error
			})
		}
	}
}

const validateTeacher = (sKey, eType) => {
	return async (req, res, next) => {
		try {
			const token = req.header('Authorization')
			req.userLanguage = 'English'
			if (!token) {
				return res.status(status.Unauthorized).jsonp({
					status: jsonStatus.Unauthorized,
					message: messages[req.userLanguage].err_unauthorized
				})
			}
			let teacher
			try {
				teacher = await TeachersModel.findByToken(token)
			} catch (err) {
				return res.status(status.Unauthorized).jsonp({
					status: jsonStatus.Unauthorized,
					message: messages[req.userLanguage].err_unauthorized
				})
			}
			if (!teacher) {
				return res.status(status.Unauthorized).jsonp({
					status: jsonStatus.Unauthorized,
					message: messages[req.userLanguage].err_unauthorized
				})
			}
			req.teacher = teacher

			let errors
				if (!req.teacher.roleId) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].access_denied })

				const role = await RolesModel.findOne({ _id: ObjectId(req.teacher.roleId), eStatus: 'Y' }, { aPermissions: 1 }).lean()
				if (!role) return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].access_denied })

				const hasPermission = role.aPermissions.find((permission) => {
					return (
						permission.sKey === sKey &&
            (permission.eType === eType ||
              (eType === 'R' && permission.eType === 'W'))
					)
				})

				if (!hasPermission) {
						let message

						switch (eType) {
						case 'R':
							message = messages[req.userLanguage].read_access_denied.replace('##', sKey)
							break
						case 'W':
							message = messages[req.userLanguage].write_access_denied.replace('##', sKey)
							break
						case 'N':
							message = messages[req.userLanguage].access_denied
							break
						}

						return res.status(status.Unauthorized).jsonp({
							status: jsonStatus.Unauthorized,
							message
						})
					
					}
				errors = validationResult(req)
				if (!errors.isEmpty()) {
					return res.status(status.UnprocessableEntity).jsonp({
						status: jsonStatus.UnprocessableEntity,
						errors: errors.array()
					})
				}

				return next(null, null)
			
		} catch (error) {
			return res.status(status.InternalServerError).jsonp({
				status: jsonStatus.InternalServerError,
				message: messages[req.userLanguage].error
			})
		}
	}
}

const isAdminAuthenticated = async (req, res, next) => {
	try {
		const token = req.header('Authorization')
		const lang = req.header('Language')
		if (lang === 'English') {
			req.userLanguage = 'English'
		}
		req.userLanguage = 'English'
		if (!token) {
			return res.status(status.Unauthorized).jsonp({
				status: jsonStatus.Unauthorized,
				message: messages[req.userLanguage].err_unauthorized
			})
		}
		const admin = await AdminsModel.findByToken(token)
		if (!admin) {
			return res.status(status.Unauthorized).jsonp({
				status: jsonStatus.Unauthorized,
				message: messages[req.userLanguage].err_unauthorized
			})
		}
		req.admin = admin

		return next(null, null)
	} catch (error) {
		
		return res.status(status.InternalServerError).jsonp({
			status: jsonStatus.InternalServerError,
			message: messages[req.userLanguage].error
		})
	}
}


const validate = function (req, res, next) {
	const lang = req.header('Language')
	if (lang === 'English') {
		req.userLanguage = 'English'
	}
	req.userLanguage = 'English'
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res
			.status(status.UnprocessableEntity)
			.jsonp({ status: jsonStatus.UnprocessableEntity, errors: errors.array() })
	}
	next()
}

const isTeacherAuthenticated = async (req, res, next) => {
	try {
		const token = req.header('Authorization')
		const lang = req.header('Language')
		if (lang === 'English') {
			req.userLanguage = 'English'
		}
		req.userLanguage = 'English'
		if (!token) {
			return res.status(status.Unauthorized).jsonp({
				status: jsonStatus.Unauthorized,
				message: messages[req.userLanguage].err_unauthorized
			})
		}

		req.teacher= {}
		let user
		try {
			user = jwt.verify(token, config.JWT_SECRET)
		} catch (err) {
			return res.status(status.Unauthorized).jsonp({
				status: jsonStatus.Unauthorized,
				message: messages[req.userLanguage].err_unauthorized
			})
		}

		if (!user) {
			return res.status(status.Unauthorized).jsonp({
				status: jsonStatus.Unauthorized,
				message: messages[req.userLanguage].err_unauthorized
			})
		}
		req.teacher= user
		req.teacher._id = ObjectId(user._id)

		if (!req.user?._id) {
			return res.status(status.InternalServerError).jsonp({
				status: jsonStatus.InternalServerError,
				message: messages[req.userLanguage].error
			})
		}
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(status.UnprocessableEntity).jsonp({
				status: jsonStatus.UnprocessableEntity,
				errors: errors.array()
			})
		}
		return next(null, null)
	} catch (error) {
		
		return res.status(status.InternalServerError).jsonp({
			status: jsonStatus.InternalServerError,
			message: messages[req.userLanguage].error
		})
	}
}

const isStudentAuthenticated = async (req, res, next) => {
    try {
      const token = req.header('Authorization')
      if (!token) {
        return res.status(status.Unauthorized).jsonp({
          status: jsonStatus.Unauthorized,
          message: messages[req.userLanguage].err_unauthorized
        })
      }
      req.student= {}
      let user
	user= jwt.verify(token, config.JWT_SECRET)
      try {
        user = jwt.verify(token, config.JWT_SECRET)
      } catch (err) {
        if (err.message === 'jwt expired') {}
        return res.status(status.Unauthorized).jsonp({
          status: jsonStatus.Unauthorized,
          message: messages[req.userLanguage].err_unauthorized
        })
      }
  
      if (!user) {
        return res.status(status.Unauthorized).jsonp({
          status: jsonStatus.Unauthorized,
          message: messages[req.userLanguage].err_unauthorized
        })
      }

      req.student= user
      req.student.id= ObjectId(user._id)
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(status.UnprocessableEntity).jsonp({
          status: jsonStatus.UnprocessableEntity,
          errors: errors.array()
        })
      }
      return next(null, null)
    } catch (error) {
      return res.status(status.InternalServerError).jsonp({
        status: jsonStatus.InternalServerError,
        message: messages[req.userLanguage].error
      })
    }
  }
  

module.exports = {
	validateAdmin,
	validate,
	isTeacherAuthenticated,
	isAdminAuthenticated,
	validateTeacher,
	isStudentAuthenticated
}
