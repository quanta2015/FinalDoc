
const express = require('express');
const router = express.Router();
const callProc = require('../util').callProc
const callP_N = require('../util').callProc_N

router.post('/showBaseTables', async (req, res) => {
    let sql = `CALL PROC_SHOW_BASE_TABLE`;
    let params = req.body;
    console.log(params)
    callProc(sql, params, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '显示数据库基础表' })
    });
});
router.post('/AUTOMATIC', async (req, res) => {
    let sql = `CALL PROC_AUTOMATIC_SELECT(?)`;
    let params = req.body;
    console.log(params)
    callProc(sql, params, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '自动查询成功' })
    });
});

router.post('/call_attribute', async (req, res) => {
    let sql = `CALL CAL_TABLE_ATTRIBUTE(?)`;
    let params = req.body;
    console.log(params)
    callP_N(sql, params, 2,res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '查询属性表成功' })
    });
});

module.exports = router