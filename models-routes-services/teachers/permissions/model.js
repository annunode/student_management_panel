const mongoose = require('mongoose')
const Schema = mongoose.Schema
const DBConnect = require('../../../database/mongoose')
const { status } = require('../../../data')

const Permissions = new Schema({
  sName: { type: String, required: true },
  sKey: { type: String, required: true },
  eStatus: { type: String, enum: status, default: 'Y' },
  sExternalId: { type: String }
}, { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } })

Permissions.index({ sKey: 1 })
const PermissionsModel = mongoose.model('permissions', Permissions)
module.exports = PermissionsModel