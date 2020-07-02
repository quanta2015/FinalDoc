/*
 * @Descripttion: 
 * @version: 
 * @Author: wyx
 * @Date: 2020-07-02 17:08:24
 * @LastEditors: wyx
 * @LastEditTime: 2020-07-02 17:55:54
 */ 


const express = require('express');
const router = express.Router();
const db = require('../util/db');
const callProc = require('../util').callProc;

 /**
 * @name: 
 * @test: test font
 * @msg: 获取未分组的教师列表
 * @param {type} 
 * @return: data
 */
router.post('/teacherList', async(req, res) => {
    let sql = `CALL PROC_TEA_LIST_G`;
    let params = req.body;
      callProc(sql, {}, res, (r) => {
          res.status(200).json({code: 200, data: r, msg: '取待分组教师列表'})
      });
  });
  
  /**
   * @name: 
   * @test: test font
   * @msg: 获取未分组的课题列表
   * @param {type} 
   * @return: 
   */
  router.post('/topicList', async(req, res) => {
    let sql = `CALL PROC_TOPIC_LIST_G`;
      let params = req.body;
      callProc(sql, {}, res, (r) => {
          res.status(200).json({code: 200, data: r, msg: '取课题列表'})
    });
  });

 /**
 * @name: 
 * @test: test font
 * @msg: 开题答辩 手动分组
 * @param {type} 
 * @return: 
 */
router.post('/handleGroup', async(req, res) => {
    let teacher_char = "";
    let teacher_len = 0;
    let topic_char = "";
    let topic_len = 0;
  
    for(let i of req.body.teacher_id){
      teacher_char += (i+",");
      teacher_len++;
    }
    teacher_char = teacher_char.substring(0, teacher_char.length - 1);
    for(let i of req.body.topic_id){
      topic_char += (i+",");
      topic_len++;
    }
    topic_char = topic_char.substring(0, topic_char.length - 1);
    
    let sql = `CALL PROC_HANDLE_GROUP_M(?)`;
      let params = {leader_id:req.body.leader_id,
                    teacher_id:teacher_char,
                    teacher_len:teacher_len,
                    topic_id:topic_char,
                    topic_len:topic_len};
      callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200,msg: '开题答辩手动分组成功'})
      });
  });
  

  module.exports = router