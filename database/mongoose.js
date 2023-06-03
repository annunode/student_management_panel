const mongoose = require('mongoose')
const express = require('express')

const config = require('../config/config')
const app = express()

const DBConnect = connection(config.DB_URL, 10, 'Student management').then(() => {
	app.listen(config.PORT, () => {
		console.log('Magic happens on port :' + config.PORT)
	})
})

// const BannersDBConnect = connection(config.BANNERS_DB_URL, parseInt(config.BANNERS_DB_POOLSIZE), 'Banners')
// const ComplaintsDBConnect = connection(config.COMPLAINS_DB_URL, parseInt(config.COMPLAINS_DB_POOLSIZE), 'Complaints')
// const FantasyTipsDBConnect = connection(config.FANTASYTIPS_DB_URL, parseInt(config.FANTASYTIPS_DB_POOLSIZE), 'FantasyTips')
// const PromocodesDBConnect = connection(config.PROMOCODES_DB_URL, parseInt(config.PROMOCODES_DB_POOLSIZE), 'Promocodes')
// const GeoDBConnect = connection(config.GEO_DB_URL, parseInt(config.GEO_DB_POOLSIZE), 'Geo')
// const NotificationsDBConnect = connection(config.NOTIFICATION_DB_URL, parseInt(config.NOTIFICATION_DB_POOLSIZE), 'Notifications')

async function connection(DB_URL, maxPoolSize = 10, DB) {
	try {
		const dbConfig = { useNewUrlParser: true, useUnifiedTopology: true, readPreference: 'secondaryPreferred' }
		const conn = await mongoose.connect(DB_URL, dbConfig)
		return conn
	} catch (error) {
		console.log('err', error)
	}
}

module.exports = DBConnect

