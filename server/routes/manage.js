/*
 * @Descripttion: 
 * @version: 
 * @Author: wyx
 * @Date: 2020-06-27 21:54:36
 * @LastEditors: wyx
 * @LastEditTime: 2020-07-03 12:38:18
 */ 

const express = require('express');
const router = express.Router();
const db = require('../util/db');
const callProc = require('../util').callProc;


/**
 * @name: 
 * @test: test font
 * @msg: 获取全部教师列表
 * @param {type} 
 * @return: data
 */
router.post('/teacherList', async(req, res) => {
  let sql = `CALL PROC_TEA_LIST_M`;
  let params = req.body;
	callProc(sql, {}, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '取教师列表'})
    });
});

/**
 * @name: 
 * @test: test font
 * @msg: 获取未分配审核的课题列表
 * @param {type} 
 * @return: 
 */
router.post('/topicList', async(req, res) => {
  let sql = `CALL PROC_TOPIC_LIST_M`;
	let params = req.body;
	callProc(sql, {}, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '取课题列表'})
  });
});

/**
 * @name: 
 * @test: test font
 * @msg: 获取审核列表
 * @param {type} 
 * @return: 
 */
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


/**
 * @name: 
 * @test: test font
 * @msg: 审核老师自动分配课题
 * @param {type} 
 * @return: 
 */
router.post('/randAllocate',async(req,res) => {
  let count = req.body[0];
  let message;
  let resultArr=[];
  for(let i=1;i<req.body.length;i++){
    let params = {sum:count,teacher_id:req.body[i]};
    message = await db.Query(`CALL PROC_CHECK_RAND_M(?)`,[JSON.stringify(params)])
    // let result = JSON.stringify(message[0][0])
    let result = (message[0][0])
    resultArr.push(result);
  }
  return res.status(200).json({code: 200, data: resultArr, msg: '自动课题审核分配'})
});

/**
 * @name: 
 * @test: test font
 * @msg: 给审核老师手动分配课题接口
 * @param {type} 
 * @return: 
 */
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

/**
 * @name: 
 * @test: test font
 * @msg: 审核相关数值
 * @param {type} 
 * @return: 未审核、未通过、已通过
 */
router.post('/auditCount', async(req, res) => {
  let sql = `CALL PROC_AUDIT_COUNT_M`;
	let params = req.body;
	callProc(sql, {}, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '取审核相关的三值'})
	});
});

/**
 * @name: 
 * @test: test font
 * @msg: 取到领域表信息
 * @param {type} 
 * @return: 
 */
router.post('/areaList', async(req, res) => {
  let sql = `CALL PROC_GET_AREA_LIST_M`;
	let params = req.body;
	callProc(sql, {}, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '取领域列表'})
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