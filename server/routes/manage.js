

const express = require('express');
const router = express.Router();
const callProc = require('../util').callProc

// var db = require('../module/db');
// var user = require('../module/manager');

router.post('/teacherList', async(req, res) => {
    console.log("yyy")
  let sql = `CALL PROC_TEA_LIST(?)`
    // let params = req.body
    let params = null
	callProc(sql, params, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '取教师列表'})
    })
    
})

router.post('/topicList', async(req, res) => {
  let sql = `CALL PROC_TOPIC_LIST(?)`
	let params = req.body
	callProc(sql, params, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '取课题列表'})
	})
})


module.exports = router