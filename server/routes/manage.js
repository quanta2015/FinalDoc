const express = require('express');
const router = express.Router();
const db = require('../util/db');
const callProc = require('../util').callProc;

// const mysql = require('mysql');
// const config = require("../util/conf.js")
// const pool = mysql.createPool(config); 

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

router.post('/checkList', async(req, res) => {
  let sql = `CALL PROC_TOPIC_CHECK_LIST_M`;
	let params = req.body;
	callProc(sql, {}, res, (r) => {
    r.forEach(element => {
      if (!element.result && element.sugg==null){
        element.result=2;
      }
    });
		res.status(200).json({code: 200, data: r, msg: '取审核列表信息'})
	});
});

// router.post('/randAllocate',async(req,res) => {
//   let count = req.body[0];
//   for(let k=1;k<req.body.length;k++){
//     let teacherId = req.body[k];
//     let result;
//     const list = await db.Query(`CALL PROC_TOPIC_LIST_M`);
//     let topicIdArr=list[0];
//     for(let i=0;i<count;i++){
//       let index = Math.floor(Math.random()*topicIdArr.length);
//       let temp = topicIdArr[index];
//       if(temp.tid == teacherId){
//         i--;
//       }
//       else{
//         result = {teacher_id:teacherId,topic_id:temp.id};
//         topicIdArr.splice(index,1);
//         const add = await db.Query(`CALL PROC_CHECK_INSERT_M(?)`,[JSON.stringify(result)]);
//       }
//     }
//   }
//   return res.status(200).json({code: 200, msg: '自动课题审核分配'})
// });


router.post('/randAllocate',async(req,res) => {
  let count = req.body[0];
  let message;
  let resultArr=[];
  for(let i=1;i<req.body.length;i++){
    let params = {sum:count,teacher_id:req.body[i]};
    message = await db.Query(`CALL test(?)`,[JSON.stringify(params)])
    let result = JSON.stringify(message[0][0])
    resultArr.push(result);
  }
  // console.log(resultArr);
  return res.status(200).json({code: 200, data: resultArr, msg: '自动课题审核分配'})
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


router.post('/auditCount', async(req, res) => {
  let sql = `CALL PROC_AUDIT_COUNT_M`;
	let params = req.body;
	callProc(sql, {}, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '取审核相关的三值'})
	});
});


//迁至auditTp
// router.post('/checkUpdateYes', async(req, res) => {
//   let sql = `CALL PROC_CHECK_UPDATE_YES_M(?)`;
//   let params = req.body;
//   callProc(sql, params, res, (r) => {
//     res.status(200).json({code: 200, data: r, msg: '审核方通过该课题'})
//   });
// });


// router.post('/checkUpdateNo', async(req, res) => {
//   let sql = `CALL PROC_CHECK_UPDATE_NO_M(?)`;
//   let params = req.body;
//   callProc(sql, params, res, (r) => {
//     res.status(200).json({code: 200, data: r, msg: '审核方打回该课题'})
//   });
// });

module.exports = router