const mongoose = require('mongoose')
const DBConnect = require('../../database/mongoose')

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
	}
})

const Admin = DBConnect.model('Admin', adminSchema)

module.exports = Admin