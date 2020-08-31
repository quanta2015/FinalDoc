/*
 * @Author: lzr
 * @Date: 2020-08-13 14:44:36
 * @LastEditTime: 2020-08-30 22:17:49
 * @LastEditors: Please set LastEditors
 * @Description: 第三阶段教师端
 * @FilePath: \FinalDoc\server\routes\auditFd.js
 */
const express = require('express');
const router = express.Router();
const callProc = require('../util').callProc;
const query = require('../util/db').Query;

router.post('/getTopicList',async(req,res)=>{
  let sql = `CALL PROC_T_FD_TOPIC(?)`;
    let params = req.body;
    params.uid = params.userId;
    callProc(sql, params, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '取获结题审核' })
    });
})

router.post('/getAuditPermission',async(req,res)=>{
  let sql = "select id from topic where tid=? and id=?";
  let data = await query(sql,[req.body.userID,req.body.topicID]);

  res.status(200).json({code: 200,flag:data.length>0,msg:'获取是否为指导老师'});
})

router.post("/submitTutorForm",async(req,res)=>{
  let sql = `call PROC_FD_INSERT_T_SCORE(?)`;
  let p = req.body;
  p.ts1 = p.score[0];
  p.ts2 = p.score[1];
  p.ts3 = p.score[2];
  p.ts4 = p.score[3];
  p.ts5 = p.score[4];
  p.tsa = p.score[5];
  callProc(sql,p,res,r=>{
    res.status(200).json({code:200,message:'成功提交指导教师审核成绩'})
  })
})

router.post("/submitTeamForm",async(req,res)=>{
  let sql = `call PROC_FD_INSERT_P_SCORE(?)`;
  let p = req.body;
  p.ts1 = p.score[0];
  p.ts2 = p.score[1];
  p.ts3 = p.score[2];
  p.ts4 = p.score[3];
  p.ts5 = p.score[4];
  p.tsa = p.score[5];
  callProc(sql,p,res,r=>{
    res.status(200).json({code:200,message:'成功提交评阅人审核成绩'})
  })
})

module.exports = router;