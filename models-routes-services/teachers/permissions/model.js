const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Permissions = new Schema({
  sName: { type: String, required: true },
  sKey: { type: String, required: true },
  eStatus: { type: String,  default: 'Y' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

Permissions.index({ sKey: 1 })
const PermissionsModel = mongoose.model('permissions', Permissions)
module.exports = PermissionsModel