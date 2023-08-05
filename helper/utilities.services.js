/* eslint-disable no-useless-escape */
/* eslint-disable no-prototype-builtins */
/**
 * Utilities Services is for common, simple & reusable methods,
 * @method {removenull} is for removing null key:value pair from the passed object
 */

const { messages, status, jsonStatus } = require('./api.responses')

/**
 * It'll remove all nullish, not defined and blank properties of input object.
 * @param {object}
 */
const removenull = (obj) => {
	for (var propName in obj) {
		if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
			delete obj[propName]
		}
	}
}
const catchError = (name, error, req, res) => {
	handleCatchError(error)
	return res.status(status.InternalServerError).jsonp({
		status: jsonStatus.InternalServerError,
		message: messages[req.userLanguage].error
	})
}

const handleCatchError = (error) => {
	const { data = undefined, status = undefined } = error.response ?? {}

	if (!status) console.log('**********ERROR***********', error)
	else console.log('**********ERROR***********', { status, data, error: data.errors })
}

const pick = (object, keys) => {
	return keys.reduce((obj, key) => {
		if (object && object.hasOwnProperty(key)) {
			obj[key] = object[key]
		}
		return obj
	}, {})
}

const checkAlphanumeric = (input) => {
	var letters = /^[0-9a-zA-Z]+$/
	return !!(input.match(letters))
}

const defaultSearch = (val) => {
	let search
	if (val) {
		search = val.replace(/\\/g, '\\\\')
			.replace(/\$/g, '\\$')
			.replace(/\*/g, '\\*')
			.replace(/\+/g, '\\+')
			.replace(/\[/g, '\\[')
			.replace(/\]/g, '\\]')
			.replace(/\)/g, '\\)')
			.replace(/\(/g, '\\(')
			.replace(/'/g, '\\\'')
			.replace(/"/g, '\\"')
		return search
	} else {
		return ''
	}
}


const getPaginationValues = (obj) => {
	let { start = 0, limit = 10, sort = 'createdAt', order, search } = obj

	start = parseInt(start)
	limit = parseInt(limit)

	const orderBy = order && order === 'asc' ? 1 : -1

	const sorting = { [sort]: orderBy }

	if (search) search = defaultSearch(search)

	return { start, limit, sorting, search }
}
const getIp = function (req) {
	try {
		let ip = req.header('x-forwarded-for') ? req.header('x-forwarded-for').split(',') : []
		ip = ip[0] || req.socket.remoteAddress
		return ip
	} catch (error) {
		handleCatchError(error)
		return req.socket.remoteAddress
	}
}

/**
 * This function will validate mobile number that is 10 digit or not.
 * @param {*} 1234567890 Mobile Number
 * return true if matched result of mobile number otherwise return false.
 */
function validateMobile (mobile) {
	return !mobile.match(/^\+?[1-9][0-9]{8,12}$/) // !mobile.match(/^\d{10}$/)
}

module.exports = {
	removenull,
	catchError,
	handleCatchError,
	pick,
	getPaginationValues,
	checkAlphanumeric, 
	getIp, 
	validateMobile 
}
