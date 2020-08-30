/*
 * @Descripttion: 开题阶段 分配审核相关接口
 * @version: 
 * @Author: wyx
 * @Date: 2020-06-27 21:54:36
 * @LastEditors: wyx
 * @LastEditTime: 2020-07-08 20:55:25
 */ 

const express = require('express');
const router = express.Router();
const db = require('../util/db');
const callProc = require('../util').callProc;


/**
 * @name: 
 * @test: test font
 * @msg: 获取全部教师列表 --本系  --分配审核人、评阅人两次使用
 * @param {ide:String} 
 * @return: data
 */
router.post('/teacherList', async(req, res) => {
  let params = req.body;

  if(req.body.status === 1){   //审核
    let sql = `CALL MG_M_PROC_TEA_LIST(?)`;
    callProc(sql, params, res, (r) => {
      res.status(200).json({code: 200, data: r, msg: '取教师列表'})
    });
  }
  if(req.body.status === 2){    //评阅
    let sql = `CALL MG_FM_PROC_TEA_LIST(?)`;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '取副教授及以上教师列表'})
    });
  }
  
});

/**
 * @name: 
 * @test: test font
 * @msg: 获取未分配审核的课题列表 --本系 --分配审核人、评阅人两次使用
 * @param {ide:String} 
 * @return: 
 */
router.post('/topicList', async(req, res) => {
  let sql = `CALL MG_M_PROC_TOPIC_LIS(?)`;
	let params = req.body;
	callProc(sql, params, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '取课题列表'})
  });
});

/**
 * @name: 
 * @test: test font
 * @msg: 获取审核列表  --权限
 * @param {ide:String} 
 * @return: 
 */
router.post('/checkList', async(req, res) => {
  if(req.body.status === 1){
    let sql = `CALL MG_M_PROC_CHECK_LIST(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
      r.forEach(element => {
        if (element.sel!=-1 && !element.result && element.sugg===null){
          element.result=2; //待审核
        }else{
          if(element.sel===-1 && element.stuId===null){
            element.result=3; //没有选定学生时--待选
          }if(element.sel===-1 && element.stuId!=null){
            element.result=4; //学生选定成功--已选
          }
        }
      });
      res.status(200).json({code: 200, data: r, msg: '取审核列表信息'})
    });
  }
  if(req.body.status === 2){
    let sql = `CALL MG_FM_PROC_CHECK_LIST(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
      res.status(200).json({code: 200, data: r, msg: '取评阅列表信息'})
    });

  }
});


/**
 * @name: 
 * @test: test font
 * @msg: 自动分配课题 --本系  --分配审核人、评阅人两次使用
 * @param {ide:String,number:int,teacher_id:[String,String,...]} 
 * @return: 
 */
router.post('/randAllocate',async(req,res) => {
  let _ide = req.body.ide;
  let count = req.body.number;
  let message;
  let resultArr=[];
  for(let i=0;i<req.body.teacher_id.length;i++){
    let params = {ide:_ide,sum:count,teacher_id:req.body.teacher_id[i]};
    if(req.body.status === 1){
      message = await db.Query(`CALL MG_M_PROC_RAND_CHECK(?)`,[JSON.stringify(params)])
    }
    if(req.body.status === 2){
      message = await db.Query(`CALL MG_FM_PROC_RAND_CHECK(?)`,[JSON.stringify(params)])
    }
    // let result = JSON.stringify(message[0][0])
    let result = (message[0][0])
    resultArr.push(result);
  }
  return res.status(200).json({code: 200, data: resultArr, msg: '自动课题审核分配'})
});


/**
 * @name: 
 * @test: test font
 * @msg: 手动分配课题   --分配审核人、评阅人两次使用
 * @param {topic_id: [int,int,...],teacher_id:String}
 * @return: 
 */
router.post('/checkAllocate', async(req, res) => {
  let topic_char = "";
  let topic_len = 0;
  for(let i of req.body.topic_id){      //数据格式处理
    topic_char += (i+",");
    topic_len++;
  }
  topic_char = topic_char.substring(0, topic_char.length - 1);

  if (req.body.status === 1) {
    let sql = `CALL MG_M_PROC_HANDLE_CHECK(?)`;
    let params = {teacher_id:req.body.teacher_id,
                  topic_id:topic_char,
                  topic_len:topic_len};
    callProc(sql, params, res, (r) => {
      res.status(200).json({code: 200, data: r, msg: '手动课题审核分配'})
    });
  }
  if(req.body.status === 2){
    let sql = `CALL MG_FM_PROC_HANDLE_CHECK(?)`;
    let params = {teacher_id:req.body.teacher_id,
                  topic_id:topic_char,
                  topic_len:topic_len};
    callProc(sql, params, res, (r) => {
      res.status(200).json({code: 200, data: r, msg: '手动课题审核分配'})
    });
  }
});

/**
 * @name: 
 * @test: test font
 * @msg: 审核相关数值  --权限
 * @param {null}
 * @return: 未审核、未通过、已通过
 */
router.post('/auditCount', async(req, res) => {
  let sql = `CALL MG_M_PROC_AUDIT_COUNT(?)`;
	let params = req.body;
	callProc(sql, params, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '取审核相关的三值'})
	});
});

/**
 * @name: 
 * @test: test font
 * @msg: 取到领域表信息
 * @param {null} 
 * @return: 
 */
router.post('/areaList', async(req, res) => {
  let sql = `CALL MG_M_PROC_AREA_LIST`;
	let params = req.body;
	callProc(sql, {}, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '取领域列表'})
	});
});


/**
 * @name: 
 * @test: test font
 * @msg: 一键发布本系课题
 *        --topic表未替换,
 *        前端等所有审核通过之后发起请求，后端发布所有已通过(audit表result=1)的同系课题
 * @param {ide:String} 
 * @return: 
 */
router.post('/releaseTopic', async(req, res) => {
  let sql = `CALL MG_M_PROC_RELEASE_TOPIC(?)`;
	let params = req.body;
	callProc(sql, params, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '一键发布课题成功'})
	});
});

/**
 * @name: 
 * @test: test font
 * @msg: 判断是否发布过课题
 * @param {ide:String} 
 * @return: 
 */
router.post('/judgeTopic', async(req, res) => {
  let sql = `CALL MG_M_PROC_JUDGE_RELEASE(?)`;
	let params = req.body;
	callProc(sql, params, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '发布课题判断'})
	});
});


module.exports = router