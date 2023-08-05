const jwt = require('jsonwebtoken')
const AdminsModel = require('../admin/model')
const RolesModel = require('../teachers/roles/model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { removenull, catchError, pick, checkAlphanumeric, getIp, validateMobile } = require('../../helper/utilities.services')
const config = require('../../config/config')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const bcrypt = require('bcryptjs')


class AdminAuth {
  async login(req, res) {
    try {
      req.body = pick(req.body, ['login', 'password', 'pushToken', 'deviceToken'])
      removenull(req.body)
      let { login, pushToken, password } = req.body

      login = login.toLowerCase().trim()

      let admin = await AdminsModel.findOne({ $or: [{ email: login }, { phoneNumber: login }, {username: login}], status: 'Y' }).populate({ path: 'roleId' })

      if (!admin) {
        return res.status(status.NotFound).jsonp({
          status: jsonStatus.NotFound,
          message: messages[req.userLanguage].auth_failed
        })
      }

      if (!bcrypt.compareSync(password, admin.password)) {
        return res.status(status.BadRequest).jsonp({
          status: jsonStatus.BadRequest,
          message: messages[req.userLanguage].auth_failed
        })
      }

      const newToken = {
        sToken: jwt.sign({ _id: (admin._id).toHexString() }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY }),
        sIpAddress: getIp(req),
        pushToken
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

  async createSubAdmin(req, res) {
    try {
      req.body = pick(req.body, ['roleId', 'name', 'username', 'email', 'phoneNumber', 'password', 'status', 'type'])

      const { username, email, phoneNumber, roleId } = req.body

      // only super admin has rights to create sub admin
      if (req.admin.type !== 'SUPER') return res.status(status.Unauthorized).jsonp({ status: jsonStatus.Unauthorized, message: messages[req.userLanguage].access_denied })
      if (!checkAlphanumeric(username)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].must_alpha_num })

      if (validateMobile(phoneNumber)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobileNumber) })

      // We'll check that role that is to be assigned to sub admin is active or not.
      const role = await RolesModel.findOne({ _id: ObjectId(roleId), eStatus: 'Y' }).lean()
      if (!role) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].role) })

      const adminExist = await AdminsModel.findOne({ $or: [{ email }, { phoneNumber }, { username }] }).lean()
      if (adminExist && adminExist.username === username) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].username) })
      if (adminExist && adminExist.phoneNumber === phoneNumber) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobileNumber) })
      if (adminExist && adminExist.email === email) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })

      const newAdmin = new AdminsModel({ ...req.body, eType: 'SUB' })
      await newAdmin.save()

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].subAdmin) })
    } catch (error) {
      return catchError('AdminAuth.createSubAdminV3', error, req, res)
    }
  }
  async get(req, res) {
    try {
      const data = await AdminsModel.findOne({ _id: ObjectId(req.params.id), eType: 'SUB' }, { name: 1, username: 1, status: 1, email: 1, phoneNumber: 1, aPermissions: 1, roleId: 1 }).lean()

      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].subAdmin) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].subAdmin), data })
    } catch (error) {
      return catchError('SubAdmin.get', error, req, res)
    }
  }

  async list(req, res) {
    try {
      const { start = 0, limit = 10, order, search } = req.query
      const orderBy = order && order === 'asc' ? 1 : -1
      const sorting = { dCreatedAt: orderBy }

      let query = {}
      if (search) {
        query = {
          $or: [
            { name: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
            { email: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
            { phoneNumber: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
          ]
        }
      }
      query = { ...query, eType: 'SUB' }

      const list = await AdminsModel
        .find(query, {
          name: 1,
          username: 1,
          email: 1,
          phoneNumber: 1,
          aPermissions: 1,
          roleId: 1,
          eStatus: 1,
          dCreatedAt: 1
        })
        .sort(sorting)
        .skip(Number(start))
        .limit(Number(limit))
        .lean()

      const total = await AdminsModel.countDocuments({ ...query })

      const data = [{ total, results: list }]
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].subAdmin), data })
    } catch (error) {
      return catchError('SubAdmin.list', error, req, res)
    }
  }
  async update(req, res) {
    try {
      const { username, email, phoneNumber, roleId, status } = req.body

      req.body = pick(req.body, ['roleId', 'name', 'username', 'email', 'phoneNumber', 'status'])
      removenull(req.body)
      if (status) req.body.status = status

      if (!checkAlphanumeric(username)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].must_alpha_num })

      if (validateMobile(phoneNumber)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].mobileNumber) })

      const role = await RolesModel.findOne({ _id: ObjectId(roleId), eStatus: 'Y' }).lean()
      if (!role) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].role) })


      const adminExist = await AdminsModel.findOne({ $or: [{ email }, { phoneNumber }, { username }], _id: { $ne: req.params.id } })
      if (adminExist && adminExist.username === username) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].username) })
      if (adminExist && adminExist.phoneNumber === phoneNumber) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobileNumber) })
      if (adminExist && adminExist.email === email) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })

      const data = await AdminsModel.findOneAndUpdate({ _id: ObjectId(req.params.id), eType: 'SUB' }, { ...req.body }, { new: false, runValidators: true }).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].subAdmin) })


      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].subAdmin), data })
    } catch (error) {
      return catchError('AdminAuth.updateV2', error, req, res)
    }
  }

}

module.exports = new AdminAuth()
