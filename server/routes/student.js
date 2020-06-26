

const express = require('express');
const router = express.Router();
const callProc = require('../util').callProc

router.post('/getTopicList', async(req, res) => {
    let sql = `CALL PROC_CAL_GET_STU_SELECT_TOPIC`;
      let params = req.body;
      callProc(sql, {}, res, (r) => {
          res.status(200).json({code: 200, data: r, msg: '取课题列表'})
      });
  });
  
  router.post('/getStuInfo', async(req, res) => {
    let sql = `CALL PROC_CAL_ONE_TOPIC(?)`;
      let params = req.body;
      console.log(params)
      callProc(sql, params, res, (r) => {
          res.status(200).json({code: 200, data: r, msg: '取学生课题'})
      });
  });
module.exports = router