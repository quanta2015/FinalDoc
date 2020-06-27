const express = require('express');
const router = express.Router();
const callProc = require('../util').callProc
router.post('/getTopicList', async (req, res) => {
    let sql = `CALL PROC_CAL_UNCHECKED_TASK(?)`;
    let params = req.body;
    console.log(params)
    callProc(sql, params, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '取获取该教师可审核，且未审核的课题' })
    });
});
router.post('/getTopicTypes', async (req, res) => {
    let sql = `CALL PROC_CAL_TASK_TOPIC_TYPE(?)`;
    let params = req.body;
    console.log(params)
    callProc(sql, params, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '所有选题类型' })
    });
});

module.exports = router