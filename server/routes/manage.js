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


router.post('/randAllocate',async(req,res) => {
  // let count = 5;
  // let teacherId = "2020782";  //等待数据格式
  let topicIdArr=[];
  let result;
  let sql = `CALL PROC_TOPIC_LIST_M`;

  callProc(sql, {}, res, (r) => {
		for(i of r){
      topicIdArr.push(i);
    }    
    for(let i=0;i<count;i++){
      let temp = topicIdArr[topicIdArr.length-1].tid;
      if(temp==teacherId){
        i--;
      }
      else{
        let sql = `CALL PROC_CHECK_INSERT_M(?)`;
        result={teacher_id:teacherId,topic_id:topicIdArr[topicIdArr.length-1].id};
        topicIdArr.pop(); 
        callProc(sql, result, res, (r) => {});
      }
    }
    res.status(200).json({code: 200, msg: '自动课题审核分配信息'})
	});
});


router.post('/checkAllocate', async(req, res) => {
  for(let i of req.body){
    for(let j of i.topic_id){
      let sql = `CALL PROC_CHECK_INSERT_M(?)`;
      let params = {teacher_id:i.teacher_id,topic_id:j};
      callProc(sql, params, res, (r) => {});
    }
  }
  res.status(200).json({code: 200,msg: '手动课题审核分配'})
});


router.post('/checkList', async(req, res) => {
  let sql = `CALL PROC_TOPIC_CHECK_LIST_M`;
	let params = req.body;
	callProc(sql, {}, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '取审核列表信息'})
	});
});

module.exports = router