const mongoose = require('mongoose')
const RolesModel = require('../teachers/roles/model')

const adminSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	phoneNumber: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
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
	iRoleId: { type: mongoose.Types.ObjectId , ref:RolesModel, required: true}
},{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin