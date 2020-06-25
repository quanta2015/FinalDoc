const db = require('./db')
const callProc = (sql, params, res, cb)=>{
	db.procedureSQL(sql, JSON.stringify(params), (err, ret) => {
		if (err) {
			res.status(500).json({code: -1, msg: '提交请求失败，请联系管理员！', data: null})
		} else {
			cb(ret)
		}
	})
}

module.exports = {
	callProc,
}