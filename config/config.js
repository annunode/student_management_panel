/* eslint-disable no-undef */
require('dotenv').config()

const config = {
	DEPLOY_HOST_URL: process.env.DEPLOY_HOST_URL,
	PORT: process.env.PORT || 3000,
	FRONTEND_HOST_URL: process.env.FRONTEND_HOST_URL || 'https://www.google.com',
	DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/student_management_system',
	JWT_SECRET: process.env.JWT_SECRET || 'secret',
	JWT_VALIDITY: '7d',
	LOGIN_HARD_LIMIT_ADMIN: 5
}
  
module.exports = config
  