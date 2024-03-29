const { status, jsonStatus } = require('../helper/api.responses')

module.exports = (app) => {
	app.use('/api', [
		require('../models-routes-services/teachers/routes'),
		require('../models-routes-services/students/routes'),
		require('../models-routes-services/teachers/permissions/routes'),
		require('../models-routes-services/teachers/roles/routes'),
		require('../models-routes-services/class/routes'),
		require('../models-routes-services/attendanceLogs/routes'),		
		require('../models-routes-services/cron/routes'),
		require('../models-routes-services/homework/routes'),
		require('../models-routes-services/homework/comments/routes'),
		require('../models-routes-services/notice/routes'),
		require('../models-routes-services/admin/routes')
	])
	app.get('/health-check', (req, res) => {
		const sDate = new Date().toJSON()
		return res.status(status.OK).jsonp({ status: jsonStatus.OK, sDate })
	})
	app.get('*', (req, res) => {
		return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound })
	})
}
