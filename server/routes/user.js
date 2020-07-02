
const express = require('express');
const router = express.Router();
const callProc = require('../util').callProc
const callP_N = require('../util').callProc_N

router.post('/login', async (req, res) => {
    let sql = `CALL PROC_SHOW_BASE_TABLE`;
    let params = req.body;
    console.log(params)
    callProc(sql, params, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '登入成功' })
    });
});


module.exports = router