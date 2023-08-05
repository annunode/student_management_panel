const mongoose = require('mongoose')
const RolesModel = require('../teachers/roles/model')
const config = require('../../config/config')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const saltRounds = 1
const salt = bcrypt.genSaltSync(saltRounds)
const data = require('../../data')


const adminSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true
	},
	phoneNumber: {
		type: String,
		required: true
	},
	address: {
		type: String
	},
	password: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true,
		unique: true
	},
	status: {
		type: String,
		default: 'Y'
	},
	aJwtTokens: [{
		sToken: { type: String },
		dTimeStamp: { type: Date, default: Date.now }
	}],
	type: {
		type: String,
		enum: data.adminTypes,
		required: true
	},
	roleId: { type: mongoose.Types.ObjectId , ref:RolesModel, required: true}
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

adminSchema.pre('save', function (next) {
  var admin = this
  if (admin.isModified('password')) {
    admin.password = bcrypt.hashSync(admin.password, salt)
  }
  if (admin.isModified('email')) {
    admin.email = admin.email.toLowerCase()
  }
  next()
})


adminSchema.statics.findByToken = function (token) {
	const admin = this
	let decoded
	try {
	decoded = jwt.verify(token, config.JWT_SECRET)
	} catch (e) {
	return Promise.reject(e)
	}
	const query = {
  _id: decoded._id,
	'aJwtTokens.sToken': token,
	eStatus: 'Y'
	}
	return admin.findOne(query)
  }

const Admin = mongoose.model('admins', adminSchema)

module.exports = Admin