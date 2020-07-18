/*
 * @Descripttion: 系主任查看进度/审核相关接口
 * @version: 
 * @Author: wyx
 * @Date: 2020-07-06 11:00:47
 * @LastEditors: wyx
 * @LastEditTime: 2020-07-18 08:51:07
 */ 

const express = require('express');
const router = express.Router();
const db = require('../util/db');
const callProc = require('../util').callProc;

/*
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

  
/*
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

/*
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

  /*
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
    let params = {topic_id:topic_char,
                topic_len:topic_len};
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '审核任务书'})
    });
  });
   
  module.exports = router