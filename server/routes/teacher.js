

// const url = require('url');
const express = require('express');
const router = express.Router();
const callProc = require('../util').callProc

// 由不完整学号得到学生列表（学号和姓名）：模糊查询
router.post('/getStuInfoByLikeID', async(req, res) => {
    let sql = `CALL PROC_STUID_INFO_FUZZY(?)`;
    let params = req.body;
	callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '取学生列表'});
	})
  })

  // 发布教师课题：向topic表中插入数据
  router.post('/postTopicInfo', async(req, res) => {
      let sql = `CALL PROC_TOPIC_INIT_INSERT(?)`;
      let params = req.body;
      callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '插入数据成功'});
      })
  })

  // 由教师id获取topic内容（课题id，课题状态）
  router.post('/getTidgetTopic', async(req, res) => {
    let sql = `CALL PROC_GET_TOPIC_STATUS(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        var status0 = 0;
        var status1 = 1;
        var status2 = 2;
        var status3 = 3;
        for (let index = 0; index < r.length; index++) {
            if (r[index].sel == 0) {
                r[index].status = status0;
            } else if(r[index].result == 0) {
                if (r[index].sugg == null) {
                    r[index].status = status1;
                } else {
                    r[index].status = status2;
                }
            } else {
                r[index].status = status3;
            }
        }
        res.status(200).json({code: 200, data: r, msg: '课题查询成功，返回课题列表'});
    })
  })

  // 由课题pid获取课题内容（课题名称，课题类别，课题简介，学生id，学生名字）
  router.post('/getTopicFullInfo', async(req, res) => {
    let sql = `CALL PROC_PID_GET_TOPIC_INFO(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '通过课题id课题查询成功，返回课题内容'});
    })
  })

  router.post('/delOneTopicWithID', async(req, res) => {
    let sql = `CALL PROC_DEL_ONE_TOPIC(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: null, msg: '删除成功'});
    })
  })


  module.exports = router;