/*
 * @Descripttion: 系主任分配评阅人相关接口
 */ 

const express = require('express');
const router = express.Router();
const db = require('../util/db');
const callProc = require('../util').callProc;

/**
 * @name: 
 * @test: test font
 * @msg: 查看各个老师课题数量信息 --本系  --暂时没用
 * @param {ide:String} 
 * @return: 
 */
// router.post('/viewTeaCount', async(req, res) => {
//   let sql = `CALL MG_A_PROC_TEA_COUNT(?)`;
//     let params = req.body;
//     callProc(sql, params, res, (r) => {
//         res.status(200).json({code: 200, data: r, msg: '查看本系老师课题数量'})
//     });
// });

/**
 * @test: test font
 * @msg: 判断是否能够进入最终答辩阶段
 * @param {ide:String} 
 * @return: 
 */
router.post('/judgeFinDef', async(req, res) => {
  let sql = `CALL MG_FM_PROC_JUDGE_STATUS(?)`;
	let params = req.body;
	callProc(sql, params, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '是否能够进入最终答辩'})
	});
});


/**
 * @test: test font
 * @msg: 一键进入最终答辩
 *        前端等所有课题都有开题分数之后发起请求，后端更新本系的课题sel=0,清空audit group表
 * @param {ide:String} 
 * @return: 
 */
router.post('/nextFinDef', async(req, res) => {
  let sql = `CALL MG_FM_PROC_NEXT_STATE(?)`;
	let params = req.body;
	callProc(sql, params, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '一键进入最终答辩'})
	});
});

/**
 * @test: test font
 * @msg: 是否已经进入最终答辩 状态判断
 * @param {ide:String} 
 * @return: 
 */
router.post('/statusFinDef', async(req, res) => {
  let sql = `CALL MG_FM_PROC_OPDEF_STATUS(?)`;
	let params = req.body;
	callProc(sql, params, res, (r) => {
		res.status(200).json({code: 200, data: r, msg: '最终答辩状态判断'})
	});
});



  module.exports = router