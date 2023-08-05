const StudentsModel = require('../students/model')
const ClassModel = require('../class/model')
const TeachersModel = require('../teachers/model')
const AttendanceLogsModel = require('./model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError, pick, getPaginationValues} = require('../../helper/utilities.services')

class attendanceController {
	async addAttendance(req,res) {
		try{
            const { aStudentAttendance, classId } = req.body
            req.body = pick(req.body, ['aStudentAttendance', 'classId', 'teacherId'])

            const teacher = await TeachersModel.findOne({_id: req.teacher._id, status: 'Y' }, { _id: 1 }).lean()
            if(!teacher) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest,  message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].teacher) })

			const oClass = await ClassModel.findOne({_id: classId, status: 'Y' }, { _id: 1 }).lean()
            if(!oClass) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest,  message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].class) })
			
			const aStudentId = aStudentAttendance.map(item=>item.studentId)

			const students = await StudentsModel.find({_id:{ $in: aStudentId }, status: 'Y', classId }, { _id: 1 }).lean()
            if(!students.length) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest,  message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].students) })
			
			const aFinalAttendance = []
			for(const student of students){  
				const attendance = aStudentAttendance[aStudentAttendance.findIndex(item=>item.studentId.toString()===student._id.toString())]
				if(attendance) aFinalAttendance.push(attendance)
			}
		
			const data = await AttendanceLogsModel.create({aStudentAttendance: aFinalAttendance, teacherId: teacher._id, classId })
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].add_success.replace('##',  messages[req.userLanguage].Attendance),
				data
			})
			
		}catch(error){
			return catchError('attendanceController.addAttendance', error, req,res)
		}
	}

	async updateAttendance(req,res) {
		try{
            const { aStudentAttendance } = req.body
            req.body = pick(req.body, ['aStudentAttendance', 'teacherId', 'status'])

			const attendance = await AttendanceLogsModel.findOne({ _id: req.params.id }).lean()
			if(!attendance) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest,  message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].attendance) })
          
			const teacher = await TeachersModel.findOne({_id: req.teacher._id, status: 'Y' }, { _id: 1 }).lean()
            if(!teacher) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest,  message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].teacher) })

			const aStudentId = aStudentAttendance.map(item=>item.studentId)

			const students = await StudentsModel.find({_id:{ $in: aStudentId }, status: 'Y' }, { _id: 1 }).lean()
            if(!students.length) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest,  message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].students) })
			
			const aFinalAttendance = []
			for(const student of students){  
				const attendance = aStudentAttendance[aStudentAttendance.findIndex(item=>item.studentId.toString()===student._id.toString())]
				if(attendance) aFinalAttendance.push(attendance)
			}
		
		
			await AttendanceLogsModel.updateOne({ _id: req.params.id }, { aStudentAttendance: aFinalAttendance })
		
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].update_success.replace('##',  messages[req.userLanguage].Attendance)
			})
			
		}catch(error){
			return catchError('attendanceController.updateAttendance', error, req,res)
		}
	}
	async getSingleDayAttendance(req,res){
	try{
		const attendance = await AttendanceLogsModel.findOne({ _id: req.params.id }).lean()
		if(!attendance) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest,  message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].attendance) })
		return res.status(status.OK).jsonp({
			status: jsonStatus.OK,
			message: messages[req.userLanguage].success.replace('##',  messages[req.userLanguage].Attendance),
			data: attendance
		})
	}catch(error){
		return catchError('attendanceController.getSingleDayAttendance', error, req,res)
	}}

	async list(req,res){
		try{
		let { start, limit, sorting, search } = getPaginationValues(req.query)
		start = parseInt(start)
		limit = parseInt(limit)
  
		const query = {}
		if (search) query.name = { $regex: new RegExp('^.*' + search + '.*', 'i') }
  
		const total = await AttendanceLogsModel.countDocuments(query)
		const results = await AttendanceLogsModel.find(query).sort(sorting).skip(start).limit(limit).lean()
  
		return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].attedancRecords), data: { total, results } })
	}catch(err){
		return catchError('AttendanceController.list', err,req,res)
	}}
	
}

module.exports = new attendanceController()
