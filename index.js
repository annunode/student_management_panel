const express = require('express')

const config = require('./config/config')
const cors = require('cors')

const app = express()
app.use(cors({origin:'*'}))
global.appRootPath = __dirname

require('./database/mongoose')
require('./middlewares/index')(app)

require('./middlewares/routes')(app)

app.listen(config.PORT, () => {
	console.log('Magic happens on port :' + config.PORT)
})

module.exports = app
