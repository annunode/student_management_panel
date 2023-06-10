const AttendanceLogsModel = require('../attendanceLogs/model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError} = require('../../helper/utilities.services')
const moment = require('moment')
class cronController {

	async updateAttendance(req,res) {
		try{
           
            const date1 = moment()
            const today = date1.format('YYYY-MM-DD')
            const tomorrow = date1.add(1,'days').format('YYYY-MM-DD')


			const attendanceRecords = await AttendanceLogsModel.find( {onDate:{ $gte:today, $lt: tomorrow }, 'aStudentAttendance.status':'W'},{ _id: 1, aStudentAttendance: 1 }).lean()
			if(!attendanceRecords.length) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest,  message: messages[req.userLanguage].not_exist.replace('##',  messages[req.userLanguage].Attendance) })
          
          
			const aFinalAttendance = []
			for(const attendance of attendanceRecords){  
            
                for(const student of attendance.aStudentAttendance){
                    if(student.status==='W') student.status= 'A' 
                }
                aFinalAttendance.push({
                    updateOne: {
                        filter: { _id: attendance._id },
                        update: {aStudentAttendance: attendance.aStudentAttendance }
                      }
                })

            }
		
		await AttendanceLogsModel.bulkWrite(aFinalAttendance, { ordered: false})
		
			return res.status(status.OK).jsonp({
				status: jsonStatus.OK,
				message: messages[req.userLanguage].update_success.replace('##',  messages[req.userLanguage].Attendance)
			})
			
		}catch(error){
			return catchError('cronController.updateAttendance', error, req,res)
		}
	}


}

module.exports = new cronController()
