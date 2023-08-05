const enums = {
	supportedLanguage: ['English'],
	permissions: ['STUDENT', 'ATTENDANCE', 'TEACHER', 'ROLE','PERMISSION', 'NOTICE', 'CLASS', 'COMMENTS', 'SUBADMIN'],
	status: ['Y', 'N','D'], // Y =Active, N=Inactive, D= Deleted
	attendanceStatus: ['P', 'A', 'W'], // P=Present, A=Absent, W=Waiting,
	gender: ['Male', 'Female', 'Other'],
	permissionStatus: ['R','W','N'], // R=Read, W=Write, N=None
	noticeTypes: ['CLASS', 'GENERAL', 'PERSONAL'],
	adminTypes: ['SUPER', 'SUB']
}

module.exports = enums
