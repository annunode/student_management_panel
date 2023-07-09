const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const AdminsModel = require('../../admin/model')
const RolesModel = require('../roles/model')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const { removenull, catchError, pick, checkAlphanumeric, getIp, validateMobile } = require('../../../helper/utilities.services')
const config = require('../../../config/config')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

class AdminAuth {
  async login(req, res) {
    try {
      req.body = pick(req.body, ['sLogin', 'sPassword', 'sPushToken', 'sDeviceToken'])
      removenull(req.body)
      let { sLogin, sPushToken, sPassword } = req.body

      sLogin = sLogin.toLowerCase().trim()

      let admin = await AdminsModel.findOne({ $or: [{ sEmail: sLogin }, { sMobNum: sLogin }], eStatus: 'Y' }).populate({ path: 'iRoleId' })

      if (!admin) {
        return res.status(status.NotFound).jsonp({
          status: jsonStatus.NotFound,
          message: messages[req.userLanguage].auth_failed
        })
      }

        if (!bcrypt.compareSync(sPassword, admin.sPassword)) {
            return res.status(status.BadRequest).jsonp({
                status: jsonStatus.BadRequest,
                message: messages[req.userLanguage].auth_failed
            })
        }

      const newToken = {
        sToken: jwt.sign({ _id: (admin._id).toHexString() }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY }),
        sIpAddress: getIp(req),
        sPushToken
      }

      // Admin can login in LOGIN_HARD_LIMIT_ADMIN time.
      // for e.g. LOGIN_HARD_LIMIT_ADMIN=5 -> Admin can login only for 5 times, After that we'll remove first login token from db.
      if (admin.aJwtTokens.length < config.LOGIN_HARD_LIMIT_ADMIN || config.LOGIN_HARD_LIMIT_ADMIN === 0) {
        admin.aJwtTokens.push(newToken)
      } else {
        admin.aJwtTokens.splice(0, 1)
        admin.aJwtTokens.push(newToken)
      }

      admin.dLoginAt = new Date()
      await admin.save()


      admin = AdminsModel.filterData(admin)

      return res.status(status.OK).set('Authorization', newToken.sToken).jsonp({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].succ_login,
        data: admin,
        Authorization: newToken.sToken
      })
    } catch (error) {
      return catchError('AdminAuth.login', error, req, res)
    }
  }

  async loginV2(req, res) {
    try {
      req.body = pick(req.body, ['sLogin', 'sPassword', 'sPushToken'])
      removenull(req.body)
      let { sLogin, sPushToken, sPassword } = req.body
      // check rate limit for password sending from same ip at multiple time. we'll make sure not too many request from same ip will occurs.

      sLogin = sLogin.toLowerCase().trim()

      let admin = await AdminsModel.findOne({ $or: [{ sEmail: sLogin }, { sMobNum: sLogin }], eStatus: 'Y' }).populate({ path: 'aRole' })

      if (!admin) {
        return res.status(status.NotFound).jsonp({
          status: jsonStatus.NotFound,
          message: messages[req.userLanguage].auth_failed
        })
      }

      if (!bcrypt.compareSync(sPassword, admin.sPassword)) {
        return res.status(status.BadRequest).jsonp({
          status: jsonStatus.BadRequest,
          message: messages[req.userLanguage].auth_failed
        })
      }


      const newToken = {
        sToken: jwt.sign({ _id: (admin._id).toHexString() }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY }),
        sIpAddress: getIp(req),
        sPushToken
      }

      // Admin can login in LOGIN_HARD_LIMIT_ADMIN time.
      // for e.g. LOGIN_HARD_LIMIT_ADMIN=5 -> Admin can login only for 5 times, After that we'll remove first login token from db.
      if (admin.aJwtTokens.length < config.LOGIN_HARD_LIMIT_ADMIN || config.LOGIN_HARD_LIMIT_ADMIN === 0) {
        admin.aJwtTokens.push(newToken)
      } else {
        admin.aJwtTokens.splice(0, 1)
        admin.aJwtTokens.push(newToken)
      }

      admin.dLoginAt = new Date()
      await admin.save()


      admin = AdminsModel.filterData(admin)

      return res.status(status.OK).set('Authorization', newToken.sToken).jsonp({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].succ_login,
        data: admin,
        Authorization: newToken.sToken
      })
    } catch (error) {
      return catchError('AdminAuth.loginV2', error, req, res)
    }
  }

  async logout(req, res) {
    try {
      // We'll remove auth token from db at logout time
      await AdminsModel.updateOne({ _id: ObjectId(req.admin._id) }, { $pull: { aJwtTokens: { sToken: req.header('Authorization') } } })
      return res.status(status.OK).jsonp({
        status: jsonStatus.OK,
        message: messages[req.userLanguage].succ_logout
      })
    } catch (error) {
      return catchError('AdminAuth.logout', error, req, res)
    }
  }

  async createSubAdminV3(req, res) {
    try {
      req.body = pick(req.body, ['iRoleId', 'sName', 'sUsername', 'sEmail', 'sMobNum', 'sPassword', 'eStatus'])

      const { sUsername, sEmail, sMobNum, iRoleId } = req.body

      // only super admin has rights to create sub admin
      if (req.admin.eType !== 'SUPER') return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].access_denied })
      if (!checkAlphanumeric(sUsername)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].must_alpha_num })

      if (validateMobile(sMobNum)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobileNumber) })

      // We'll check that role that is to be assigned to sub admin is active or not.
      const role = await RolesModel.findOne({ _id: ObjectId(iRoleId), eStatus: 'Y' }).lean()
      if (!role) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].role) })

      const adminExist = await AdminsModel.findOne({ $or: [{ sEmail }, { sMobNum }, { sUsername }] }).lean()
      if (adminExist && adminExist.sUsername === sUsername) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].username) })
      if (adminExist && adminExist.sMobNum === sMobNum) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobileNumber) })
      if (adminExist && adminExist.sEmail === sEmail) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })

      const newAdmin = new AdminsModel({ ...req.body, eType: 'SUB' })
      await newAdmin.save()

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].subAdmin) })
    } catch (error) {
      return catchError('AdminAuth.createSubAdminV3', error, req, res)
    }
  }
}

module.exports = new AdminAuth()
