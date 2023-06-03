const express = require('express')

const cors = require('cors')
const StudentsModel = require('./models-routes-services/students/model')

const app = express()
app.use(cors({ origin: '*' }))
global.appRootPath = __dirname

require('./database/mongoose')(app)
require('./middlewares/index')(app)

require('./middlewares/routes')(app)


module.exports = app
