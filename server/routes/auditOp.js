const express = require('express');
const router = express.Router();
const callProc = require('../util').callProc


router.post('/getTeam',async(req,res)=>{
  let sql = `CALL PROC_GET_AUDIT_TEAM(?)`;
  let params = req.body;
  callProc(sql,params,res,r=>{
    let result={leader:'',member:[]};
    r.forEach(x => {
      if(x.role==1){
        result.leader={name:x.name}
      }else{
        result.member.push({name:x.name})
      }
    });
    res.status(200).json({code:200,result,message:'已获取分组信息'})
  })
})

router.post('/getTopicList',async(req,res)=>{
  let sql = 'CALL PROC_T_GET_AUDIT_TOPIC(?)';
  let params = req.body;
  callProc(sql,params,res,r=>{
    res.status(200).json({code:200,result:r,message:'已获取课题列表'})
  })
})

router.post('/getAuditPermission',async(req,res)=>{
  let sql = 'call PROC_T_IS_TOPICTEACHER(?)';
  let data = req.body;
  callProc(sql,data,res,r=>{
    let result={flag:false};
    if(r.length>0){result.flag = true}
    res.status(200).json({code:200,result,message:'已获取是否为审核人'})
  })
})

router.post('/submitTutorForm',async (req,res)=>{
  let sql = 'call PROC_OP_INSERT_T_SCORE(?)';
  let data = req.body;
  data.tm1 = data.score[0];
  data.tm2 = data.score[1];
  data.tm3 = data.score[2];
  data.tm4 = data.score[3];
  data.tm5 = data.score[4];
  data.tm6 = data.score[5];
  callProc(sql,data,res,()=>{
    res.status(200).json({code:200,message:'成功提交教师审核成绩'})
  })
})

router.post('/submitTeamForm',async (req,res)=>{
  let sql = 'call PROC_OP_INSERT_G_SCORE(?)';
  let data = req.body;
  data.tm1 = data.score[0];
  data.tm2 = data.score[1];
  data.tm3 = data.score[2];
  data.tm4 = data.score[3];
  data.tm5 = data.score[4];
  data.tm6 = data.score[5];
  callProc(sql,data,res,()=>{
    res.status(200).json({code:200,message:'成功提交小组审核成绩'})
  })
})

module.exports = router