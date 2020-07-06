
const express = require('express');
const router = express.Router();
const callProc = require('../util').callProc
const callP_N = require('../util').callProc_N

router.post('/login', async (req, res) => {
    let sql = `CALL PROC_LOGIN(?)`;
    let params = req.body;
    console.log(params)
    callProc(sql, params, res, (r) => {
        console.log(r)
        if(r.length!=0)
        {
            res.status(200).json({ code: 200, data: r, msg: '登入成功' })
        }
        else{
            res.status(200).json({ code: 301, data: null, msg: '登入失败' })
        }
       
    });
});


module.exports = router