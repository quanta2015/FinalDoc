/*
 * @Descripttion: 
 * @version: 
 * @Author: wyx
 * @Date: 2020-07-06 11:00:47
 * @LastEditors: wyx
 * @LastEditTime: 2020-07-06 11:08:01
 */ 

const express = require('express');
const router = express.Router();
const db = require('../util/db');
const callProc = require('../util').callProc;

/**
 * @name: 
 * @test: test font
 * @msg: 查看课题进度
 * @param {type} 
 * @return: 
 */
router.post('/viewProgress', async(req, res) => {
    let sql = `CALL PROC_VIEW_PROGRESS_A(?)`;
      let params = req.body;
      callProc(sql, params, res, (r) => {
          res.status(200).json({code: 200, data: r, msg: '发布课题判断'})
      });
  });

  module.exports = router