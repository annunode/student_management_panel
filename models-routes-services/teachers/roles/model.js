const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { status, adminPermission, adminPermissionType } = require('../../../data')

const Roles = new Schema({
  sName: { type: String, required: true },
  aPermissions: [{
    sKey: { type: String, enum: adminPermission },
    eType: { type: String, enum: adminPermissionType } // R = READ, W = WRITE, N = NONE - Rights
  }],
  eStatus: { type: String, enum: status, default: 'Y' },
  sExternalId: { type: String }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

Roles.index({ 'aPermissions.sKey': 1 })
Roles.index({ eStatus: 1 })

const RolesModel = mongoose.model('roles', Roles)
module.exports = RolesModel