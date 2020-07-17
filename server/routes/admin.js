/*
 * @Descripttion: 第二阶段 管理员端接口
 * @version: 1.0
 * @Author: 
 * @Date: 2020-07-09 10:14:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-07-17 20:19:13
 */ 

const express = require('express');
const router = express.Router();
const callProc = require('../util').callProc;
const callP_N = require('../util').callProc_N;

/**
 * @description: 获取当前所有公告，并按时间倒序排列
 * @param {} 
 * @return: { id: int, ann_title: str, ann_content: str, ann_time: datetime, ann_target: int }
 */
router.post('/getAllAnnounce', async(req, res) => {
    let sql = `CALL PROC_GET_ALL_NOTICES`;
    let params = {};
    callProc(sql, params, res, (r) => {
        r.forEach(element => {
            switch (element['target']) {
                case 0:
                    element.ann_target = 'all';
                    break;
                case 1:
                    element.ann_target = 'stu';
                    break;
                case 2:
                    element.ann_target = 'tea';
                    break;
                case 3:
                    element.ann_target = 'leader';
                    break;
                default:
                    break;
            }
            delete element.target;
        });
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '成功获取当前所有公告' });
    })
})

/**
 * @description: 删除某个公告
 * @param { ann_id: int } 
 * @return: 
 */
router.post('/delOneAnnounce', async(req, res) => {
    let sql = `CALL PROC_DEL_ONE_ANNOUNCE(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql, params, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '成功删除该公告' });
    })
})

/**
 * @description: 获取所有文件地址
 * @param {} 
 * @return: 
 */
router.post('/getAllFileAddress', async(req, res) => {
    let sql = `CALL PROC_GET_ALL_FILE_INFO`;
    let params = {};
    callProc(sql, params, res, (r) => {
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '获取所有文件内容' })
    })
})

/**
 * @description: 发布公告
 * @param { ann_title: str, ann_target: str, ann_context: str } 
 * @return: 
 */
router.post('/insertAnnouncement', async(req, res) => {
    let sql = `CALL PROC_INSERT_ONE_ANNOUNCEMENT(?)`;
    let params = req.body;
    console.log(params);
    callP_N(sql, params, res, (r) => {
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '成功发布该公告' });
    })
})

module.exports = router;