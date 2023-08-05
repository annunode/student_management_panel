/* eslint-disable no-undef */
require('dotenv').config()
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const hpp = require('hpp')
const data = require('../data')

module.exports = (app) => {
	app.use(cors())
	app.use(helmet())
	app.use(
		helmet.contentSecurityPolicy({
			directives: {
				defaultSrc: ['\'self\''],
				scriptSrc: ['\'self\'', '\'unsafe-inline\'', '\'unsafe-eval\''],
				styleSrc: ['\'self\'', '\'unsafe-inline\'']			}
		})
	)
	app.disable('x-powered-by')
	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(hpp())

	/* global appRootPath */
	app.use(express.static(path.join(appRootPath, 'public')))
	app.set('view engine', 'ejs')

	app.use(compression({
		filter: function (req, res) {
			if (req.headers['x-no-compression']) {
				// don't compress responses with this request header
				return false
			}
			// fallback to standard filter function
			return compression.filter(req, res)
		}
	}))

	// set language in request object
	app.use((req, res, next) => {
		if (!req.header('Language')) {
			req.userLanguage = 'English'
		} else if ((data.supportedLanguage).indexOf(req.header('Language')) !== -1) {
			req.userLanguage = req.header('Language')
		} else {
			req.userLanguage = 'English'
		}
		next()
	})
}
