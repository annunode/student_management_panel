const mongoose = require('mongoose')

const config = require('../config/config')

const DBConnect = connection(config.DB_URL, 10,'Student management')

// const BannersDBConnect = connection(config.BANNERS_DB_URL, parseInt(config.BANNERS_DB_POOLSIZE), 'Banners')
// const ComplaintsDBConnect = connection(config.COMPLAINS_DB_URL, parseInt(config.COMPLAINS_DB_POOLSIZE), 'Complaints')
// const FantasyTipsDBConnect = connection(config.FANTASYTIPS_DB_URL, parseInt(config.FANTASYTIPS_DB_POOLSIZE), 'FantasyTips')
// const PromocodesDBConnect = connection(config.PROMOCODES_DB_URL, parseInt(config.PROMOCODES_DB_POOLSIZE), 'Promocodes')
// const GeoDBConnect = connection(config.GEO_DB_URL, parseInt(config.GEO_DB_POOLSIZE), 'Geo')
// const NotificationsDBConnect = connection(config.NOTIFICATION_DB_URL, parseInt(config.NOTIFICATION_DB_POOLSIZE), 'Notifications')

function connection(DB_URL, maxPoolSize = 10, DB) {
	try {
		const dbConfig = { useNewUrlParser: true, useUnifiedTopology: true, readPreference: 'secondaryPreferred' }
		const conn = mongoose.createConnection(DB_URL, dbConfig)
		conn.on('connected', () => console.log(`Connected to ${DB} database.`))
		return conn
	} catch (error) {
		console.log(error)
	}
}

module.exports = DBConnect

