const express = require('express');
const { json } = require('express');
const router = express.Router();
const callProc = require('../util').callProc;

router.post('/teacherList', async(req, res) => {
  let sql = `CALL PROC_TEA_LIST_M`;
  let params = req.body;
	callProc(sql, {}, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '取教师列表'})
    });
});

router.post('/topicList', async(req, res) => {
  let sql = `CALL PROC_TOPIC_LIST_M`;
	let params = req.body;
	callProc(sql, {}, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '取课题列表'})
	});
});

router.post('/checkAllocate', async(req, res) => {
  let sql = `CALL PROC_CHECK_INSERT_M(?)`;
	let params = req.body;
	callProc(sql, params, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '插入课题审核id信息'})
	});
});

router.post('/checkList', async(req, res) => {
  let sql = `CALL PROC_TOPIC_CHECK_LIST_M`;
	let params = req.body;
	callProc(sql, {}, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '取审核列表信息'})
	});
});

// var json=JSON.stringify({teacher_id:"20021317",topic_id:""})
module.exports = router