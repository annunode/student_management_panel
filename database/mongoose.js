const mongoose = require('mongoose')

const config = require('../config/config')


async function connection(DB_URL, maxPoolSize = 10, DB) {
	try {
		const dbConfig = { useNewUrlParser: true, useUnifiedTopology: true, readPreference: 'secondaryPreferred' }
		const conn = mongoose.connect(DB_URL, dbConfig)
		return conn
	} catch (error) {
		console.log('err', error)
	}
}
module.exports = (app) =>{ 
	connection(config.DB_URL, 10, 'Student management').then(() => {
	app.listen(config.PORT, () => {
		console.log('Magic happens on port :' + config.PORT)
	})
})
}
