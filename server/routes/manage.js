

const express = require('express');
const router = express.Router();
const callProc = require('../util').callProc

router.post('/teacherList', async(req, res) => {
  let sql = `CALL PROC_TEA_LIST_M`
  let params = req.body
	callProc(sql, {}, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '取教师列表'})
    })
    
})

router.post('/topicList', async(req, res) => {
  let sql = `CALL PROC_TOPIC_LIST_M`
	let params = req.body
	callProc(sql, {}, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '取课题列表'})
	})
})


module.exports = router