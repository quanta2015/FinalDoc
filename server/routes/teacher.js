

const url = require('url');
const express = require('express');
const router = express.Router();
const callProc = require('../util').callProc

// 由不完整学号得到学生列表（学号和姓名）：模糊查询
router.get('/getStuInfoByLikeID', async(req, res) => {
    let sql = `CALL PROC_STUID_INFO_FUZZY(?)`;
    var data = url.parse(req.url, true).query;
    let params = {num: data.num};
    // let params = req.body;
	callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '取学生列表'});
	})
  })

  // 发布教师课题：向topic表中插入数据
  router.post('/postTopicInfo', async(req, res) => {
      let sql = `CALL PROC_TOPIC_INIT_INSERT(?)`;
      var data = url.parse(req.url, true).query;
      let params = {tea_id: data.tea_id, stuId: data.stuId, name: data.name, type: data.type, note: data.note};
      callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '插入数据成功'});
      })
  })

  // 由教师id获取topic内容（课题id，课题状态）
  router.get('/getTidgetTopic', async(req, res) => {
    let sql = `CALL PROC_GET_TOPIC_STATUS(?)`;
    var data = url.parse(req.url, true).query;
    let params = {tea_id: data.tea_id};
    callProc(sql, params, res, (r) => {
        var status0 = 0;
        var status1 = 1;
        var status2 = 2;
        var status3 = 3;
        if (result["sel"] == 0) {
            r[0].status = status0;
        } else if(result["result"] == 0) {
            if (result["sugg"] == null) {
                r[0].status = status1;
            } else {
                r[0].status = status2;
            }
        } else {
            r[0].status = status3;
        }
        res.status(200).json({code: 200, data: r, msg: '课题查询成功，返回课题列表'});
    })
  })

  // 由课题pid获取课题内容（课题名称，课题类别，课题简介，学生id，学生名字）
  router.get('/getTopicFullInfo', async(req, res) => {
    let sql = `CALL PROC_PID_GET_TOPIC_INFO(?)`;
    var data = url.parse(req.url, true).query;
    let params = {pid: data.pid};
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '通过课题id课题查询成功，返回课题内容'});
    })
  })

  module.exports = router;