const express = require('express')

const cors = require('cors')

const app = express()
app.use(cors({ origin: '*' }))
global.appRootPath = __dirname

require('./database/mongoose')
require('./middlewares/index')(app)

require('./middlewares/routes')(app)


module.exports = app
