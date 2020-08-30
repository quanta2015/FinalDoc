
const express = require('express');
const router = express.Router();
const db = require('../util/db');
const callProc = require('../util').callProc;

 /**
 * @name: 
 * @test: test font
 * @msg: 获取未分组的教师列表 --权限
 * @param {ide:String} 
 * @return: data
 */
router.post('/teacherList', async(req, res) => {
    let sql = `CALL MG_G_PROC_TEA_LIST(?)`;
    let params = req.body;
      callProc(sql, params, res, (r) => {
          res.status(200).json({code: 200, data: r, msg: '取待分组教师列表'})
      });
  });
  
  /**
   * @name: 
   * @test: test font
   * @msg: 获取未分组的课题列表  --权限
   * @param {ide:String} 
   * @return: 
   */
  router.post('/topicList', async(req, res) => {
    let params = req.body;
    if(req.body.status == 1) {
      let sql = `CALL MG_FG_PROC_TOPIC_LIST(?)`;
      callProc(sql, params, res, (r) => {
          res.status(200).json({code: 200, data: r, msg: '取课题列表'})
      });
    }
    if(req.body.status == 2) {
      let sql = `CALL MG_FG_PROC_TOPIC_LIST_DE(?)`;
      callProc(sql, params, res, (r) => {
          res.status(200).json({code: 200, data: r, msg: '取课题列表--延缓'})
      });
    }
    
  });


  /**
   * @name: 
   * @test: test font
   * @msg: 取分组列表  --权限
   * @param {ide:String} 
   * @return: 
   */  
  router.post('/groupList', async(req, res) => {
    let sql = `CALL MG_FG_PROC_GROUP_LIST(?)`;
      let params = req.body;
      callProc(sql, params, res, (r) => {
          res.status(200).json({code: 200, data: r, msg: '取分组列表'})
    });
  });


  /**
   * @name: 
   * @test: test font
   * @msg: 取组内课题详情
   * @param {topic_id:int} 
   * @return: 
   */  
  router.post('/topicDetailList', async(req, res) => {
    let sql = `CALL MG_FG_PROC_GROUP_DETAIL(?)`;
      let params = req.body;
      callProc(sql, params, res, (r) => {
          res.status(200).json({code: 200, data: r, msg: '取组内课题详情'})
    });
  });

 /**
 * @name: 
 * @test: test font
 * @msg: 开题答辩 手动分组、手动分课题
 * @param {leader_id:String,teacher_id:[String],topic_id:[int]} 
 * @return: 
 */
router.post('/handleGroup', async(req, res) => {
    let teacher_char = "";
    let teacher_len = 0;
    let topic_char = "";
    let topic_len = 0;
  
    for(let i of req.body.teacher_id){    //数据格式处理
      teacher_char += (i+",");
      teacher_len++;
    }
    teacher_char = teacher_char.substring(0, teacher_char.length - 1);
    for(let i of req.body.topic_id){      //数据格式处理
      topic_char += (i+",");
      topic_len++;
    }
    topic_char = topic_char.substring(0, topic_char.length - 1);
    
    let params = {leader_id:req.body.leader_id,
      teacher_id:teacher_char,
      teacher_len:teacher_len,
      topic_id:topic_char,
      topic_len:topic_len};

    if(req.body.status == 1) {
      let sql = `CALL MG_FG_PROC_HANDLE_GROUP_N(?)`;
      callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '最终答辩手动分组-正常'})
      });
    }
    if(req.body.status == 2) {
      let sql = `CALL MG_FG_PROC_HANDLE_GROUP_D(?)`;
      callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '最终答辩手动分组-延缓'})
      });
    }
  });


/**
 * @name: 
 * @test: test font
 * @msg: 开题答辩 手动分组、自动分课题 --权限
 * @param {leader_id:String,teacher_id:[String],number:int} 
 * @return: 
 */
router.post('/randGroup', async(req, res) => {
  let teacher_char = "";
  let teacher_len = 0;
  let topic_len = req.body.number;

  for(let i of req.body.teacher_id){    //数据格式处理
    teacher_char += (i+",");
    teacher_len++;
  }
  teacher_char = teacher_char.substring(0, teacher_char.length - 1);
  
  let sql = `CALL MG_G_PROC_RAND_GROUP(?)`;
  let params = {ide:req.body.ide,
                leader_id:req.body.leader_id,
                teacher_id:teacher_char,
                teacher_len:teacher_len,
                topic_len:topic_len};
    callProc(sql, params, res, (r) => {
      res.status(200).json({code: 200, data:r, msg: '最终答辩自动分组'})
    });
});
  

/**
 * @name: 
 * @test: test font
 * @msg: 开题答辩 手动分组、自动分课题 获取十个不是本教师的课题 --权限
 * @param {teacher_id:[String]} 
 * @return: 
 */
router.post('/tenTopic', async(req, res) => {
  let teacher_char = "";
  let teacher_len = 0;

  for(let i of req.body.teacher_id){    //数据格式处理
    teacher_char += (i+",");
    teacher_len++;
  }
  teacher_char = teacher_char.substring(0, teacher_char.length - 1);
  
  let params = {ide:req.body.ide,
    teacher_id:teacher_char,
    teacher_len:teacher_len};

  if(req.body.status == 1) {
    let sql = `CALL MG_FG_PROC_TEN_TOPIC(?)`;
    callProc(sql, params, res, (r) => {
      res.status(200).json({code: 200, data:r, msg: '最终答辩自动十个课题'})
    });
  }
  if(req.body.status == 2) {
    let sql = `CALL MG_FG_PROC_TEN_TOPIC_DE(?)`;
    callProc(sql, params, res, (r) => {
      res.status(200).json({code: 200, data:r, msg: '最终答辩自动十个课题--延缓'})
    });
  }
});
  /**
   * @name: 
   * @test: test font
   * @msg: 删除某个分组
   * @param {gid:int} 
   * @return: 
   */  
  router.post('/deleteGroup', async(req, res) => {
    let sql = `CALL MG_FG_PROC_DEL_GROUP(?)`;
      let params = req.body;
      callProc(sql, params, res, (r) => {
          res.status(200).json({code: 200, data: r, msg: '删除分组'})
    });
  });



  module.exports = router