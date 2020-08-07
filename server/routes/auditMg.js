/*
 * @Descripttion: 系主任查看进度/审核相关接口
 * @version: 
 * @Author: wyx
 * @Date: 2020-07-06 11:00:47
 * @LastEditors: wyx
 * @LastEditTime: 2020-08-07 12:04:24
 */ 

const express = require('express');
const router = express.Router();
const db = require('../util/db');
const callProc = require('../util').callProc;

/**
 * @name: 
 * @test: test font
 * @msg: 查看课题进度 --本系
 * @param {ide:String} 
 * @return: 
 */
router.post('/viewProgress', async(req, res) => {
    let sql = `CALL MG_A_PROC_VIEW_PROGRESS(?)`;
      let params = req.body;
      callProc(sql, params, res, (r) => {
          res.status(200).json({code: 200, data: r, msg: '查看本系课题进度'})
      });
  });

/**
 * @name: 
 * @test: test font
 * @msg: 查看各个老师课题数量信息 --本系
 * @param {ide:String} 
 * @return: 
 */
router.post('/viewTeaCount', async(req, res) => {
  let sql = `CALL MG_A_PROC_TEA_COUNT(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '查看本系老师课题数量'})
    });
});

  
/**
  * @name: 
  * @test: test font
  * @msg: 课题文件相关字段接口
  * @param {topic_id:int} 
  * @return: 
  */
 router.post('/viewFiles', async(req, res) => {
     let sql = `CALL MG_A_PROC_VIEW_FILES(?)`;
       let params = req.body;
       callProc(sql, params, res, (r) => {
           res.status(200).json({code: 200, data: r, msg: '查看该课题文件'})
       });
   });

/**
  * @name: 
  * @test: test font
  * @msg: 课题任务书列表 --本系
  * @param {ide:String} 
  * @return: 
  */
 router.post('/taskList', async(req, res) => {
    let sql = `CALL MG_A_PROC_TASK_LIST(?)`;
      let params = req.body;
      callProc(sql, params, res, (r) => {
          res.status(200).json({code: 200, data: r, msg: '查看本系任务书列表'})
      });
  });

/**
  * @name: 
  * @test: test font
  * @msg: 审核任务书
  * @param {topic_id:[int]} 
  * @return: 
  */
 router.post('/reviewTask', async(req, res) => {
    let topic_char = "";
    let topic_len = 0;
    for(let i of req.body.topic_id){      //数据格式处理
      topic_char += (i+",");
      topic_len++;
    }
    topic_char = topic_char.substring(0, topic_char.length - 1);

    let sql = `CALL MG_A_PROC_REVIEW_TASK(?)`;
    let params = {ide:req.body.ide,
                 topic_id:topic_char,
                topic_len:topic_len};
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '审核任务书'})
    });
  });
   
/**
 * @test: test font
 * @msg: 判断是否能够进入开题答辩阶段
 * @param {ide:String} 
 * @return: 
 */
router.post('/judgeOpDef', async(req, res) => {
  let sql = `CALL MG_A_PROC_JUDGE_STATUS(?)`;
	let params = req.body;
	callProc(sql, params, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '是否能够进入开题答辩'})
	});
});


/**
 * @test: test font
 * @msg: 一键进入开题答辩
 *        前端等所有任务书通过之后发起请求，后端发布所有已通过(topic表status=5)的同系课题
 * @param {ide:String} 
 * @return: 
 */
router.post('/nextOpDef', async(req, res) => {
  let sql = `CALL MG_A_PROC_NEXT_STATE(?)`;
	let params = req.body;
	callProc(sql, params, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '一键进入开题答辩'})
	});
});

/**
 * @test: test font
 * @msg: 是否已经进入开题答辩 状态判断
 * @param {ide:String} 
 * @return: 
 */
router.post('/statusOpDef', async(req, res) => {
  let sql = `CALL MG_A_PROC_OPDEF_STATUS(?)`;
	let params = req.body;
	callProc(sql, params, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '开题答辩状态判断'})
	});
});



  module.exports = router