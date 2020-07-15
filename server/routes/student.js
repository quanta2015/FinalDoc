

const express = require('express');
const router = express.Router();
const callProc = require('../util').callProc

router.post('/getTopicList', async (req, res) => {
    let sql = `CALL PROC_CAL_GET_STU_SELECT_TOPIC(?)`;
    let params = req.body;
    console.log(params)
    callProc(sql, params, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '取课题列表' })
    });
});

router.post('/getStuInfo', async (req, res) => {
    let sql = `CALL PROC_CAL_ONE_TOPIC(?)`;
    let params = req.body;
    console.log(params)
    callProc(sql, params, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '取学生课题' })
    });
});

router.post('/addStuTopic', async (req, res) => {
    let sql = `CALL PROC_ADD_ONE_STU_TOPIC(?)`;
    let params = req.body;
    console.log(params)
    callProc(sql, params, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '增加学生课题' })
    });
});

router.post('/delStuTopic', async (req, res) => {
    let sql = `CALL PROC_DEL_ONE_STU_TOPIC(?)`;
    let params = req.body;
    console.log(params)
    callProc(sql, params, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '删除学生课题' })
    });
});
router.post('/calStuDoubleSlelctSucc', async (req, res) => {
    let sql = `CALL PROC_CAL_ONE_STU_DOUBLE_SELECT_SUCC(?)`;
    let params = req.body;
    console.log(params)
    callProc(sql, params, res, (r) => {
        if (r.length != 0) {
            res.status(200).json({ code: 200, data: r, msg: '获取成功 传学生id条件 状态码不为空 不为0 1 2 输出 topic里面的所有字段' })
        }
        else {
            res.status(200).json({ code: 200, data: null, msg: '数据为空 传学生id条件  状态码不为空 不为0 1 2 输出 topic里面的所有字段' })
        }

    });
});
router.post('/calStuTopicStateZero', async (req, res) => {
    let sql = `CALL PROC_CAL_ONE_STU_TOPIC_WITH_STATUS_ZERO(?)`;
    let params = req.body;
    console.log(params)
    callProc(sql, params, res, (r) => {
        if (r.length != 0) {
            res.status(200).json({ code: 200, data: r, msg: '获取成功 传学生id条件 状态码为0 输出 topic里面的所有字段' })
        }
        else {
            res.status(200).json({ code: 200, data: null, msg: '数据为空 传学生id条件 状态码为0 输出 topic里面的所有字段' })
        }

    });
});
router.post('/calStuTopicStateTwo', async (req, res) => {
    let sql = `CALL PROC_CAL_ONE_STU_TOPIC_WITH_STATUS_TWO(?)`;
    let params = req.body;
    console.log(params)
    callProc(sql, params, res, (r) => {
        if (r.length != 0) {
            res.status(200).json({ code: 200, data: r, msg: '获取成功 传学生id条件 状态码为2 输出 topic里面的所有字段' })
        }
        else {
            res.status(200).json({ code: 200, data: null, msg: '数据为空 传学生id条件 状态码为2 输出 topic里面的所有字段' })
        }

    });
});
router.post('/getStuTopicStatus', async (req, res) => {
    let sql = `CALL PROC_CAL_ONE_TOPIC_STATUS(?)`;
    let params = req.body;
    console.log(params)
    callProc(sql, params, res, (r) => {
        console.log(r)
        if (r.length != 0) {
            res.status(200).json({ code: 200, data: r, msg: '数据获取成功 取学生课题' })
        } else {
            res.status(200).json({ code: 200, data: null, msg: '数据获取为空 取学生课题 ┗|｀O′|┛ 嗷~~' })
        }

    });
});

router.post('/delFile', async (req, res) => {
    let sql = `CALL PROC_DEL_TOPIC_FILE(?)`;
    let params = req.body;
    console.log(params)
    callProc(sql, params, res, (r) => {
        console.log(r)

        res.status(200).json({ code: 200, data: r, msg: '删除字段成功' })

    });
});

/**
 * @description: 查看教师的指导意见
 * @param {sid: str} 
 * @return: 
 */
router.post('/getGuidance', async(req, res) => {
    let sql = `CALL PROC_GET_GUIDANCE(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql, params, res, (r) => {
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '查看指导意见成功' })
    })
})

module.exports = router