/*
 * @Descripttion: 第二阶段 管理员端接口
 * @version: 1.0
 * @Author: 
 * @Date: 2020-07-09 10:14:36
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-08-07 21:50:51
 */


const express = require('express');
const router = express.Router();
const callProc = require('../util').callProc;
const callP_N = require('../util').callProc_N;
const formidable = require('formidable');
const bodyParser = require('body-parser');
const fs = require('fs');
const moment = require('moment');

/*
 * @description: 获取当前所有公告，并按时间倒序排列
 * @param {} 
 * @return: { id: int, ann_title: str, ann_content: str, ann_time: datetime, ann_target: int }
 */
router.post('/getAllAnnounce', async (req, res) => {
    let sql = `CALL PROC_GET_ALL_NOTICES`;
    let params = {};
    callProc(sql, params, res, (r) => {
        r.forEach(element => {
            switch (element['target']) {
                case 0:
                    element.target = '全体师生';
                    break;
                case 1:
                    element.target = '全体学生';
                    break;
                case 2:
                    element.target = '全体老师';
                    break;
                case 3:
                    element.target = '各系主任';
                    break;
                default:
                    break;
            }

        });
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '成功获取当前所有公告' });
    })
})

/*
 * @description: 删除某个公告
 * @param { ann_id: int } 
 * @return: 
 */
router.post('/delOneAnnounce', async (req, res) => {
    let sql = `CALL PROC_DEL_ONE_ANNOUNCE(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql, params, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '成功删除该公告' });
    })
})

/*
 * @description: 获取所有模板文件
 * @param {} 
 * @return: 
 */
router.post('/getAllFileAddress', async (req, res) => {
    let sql = `CALL PROC_GET_ALL_FILE_INFO`;
    let params = {};
    callProc(sql, params, res, (r) => {
        r.forEach(element => {
            switch (element['f_type']) {
                case 1:
                    element.f_type = '公告文件';
                    element.f_sub_type = 'null';
                    break;
                case 21:
                    element.f_type = '师生模板';
                    element.f_sub_type = 'null';
                    break;
                case 221:
                    element.f_type = '学生模板';
                    element.f_sub_type = '开题中期';
                    break;
                case 222:
                    element.f_type = '学生模板';
                    element.f_sub_type = '论文定稿';
                    break;
                case 223:
                    element.f_type = '学生模板';
                    element.f_sub_type = '论文答辩';
                    break;
                case 23:
                    element.f_type = '教师模板';
                    element.f_sub_type = 'null';
                    break;
                case 24:
                    element.f_type = '系主任模板';
                    element.f_sub_type = 'null';
                    break;
                case 3:
                    element.f_type = '评分模板文件';
                    element.f_sub_type = 'null';
                    break;
                default:
                    break;
            }
        });
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '获取所有文件内容' })
    })
})

/*
 * @description: 发布公告
 * @param { ann_title: str, ann_target: str, ann_context: str } 
 * @return: 
 */
router.post('/insertAnnouncement', async (req, res) => {
    let sql = `CALL PROC_INSERT_ONE_ANNOUNCEMENT(?)`;
    let params = req.body;
    console.log(params);
    callP_N(sql, params, 2,res, (r) => {
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '成功发布该公告' });
    })
})

router.post('/uploadFile', async function (req, res) {
    const form = new formidable.IncomingForm()
    form.uploadDir = "./upload/";

    let get_data, newpath;
    form.parse(req, (err, fields, files) => {
        if (err || !files.file) {
            res.status(500);
        }
        get_data = fields;
        let ext = files.file.name.split('.').slice(-1)
        let ttt = `admin_${moment(new Date()).format('YYYYMMDDhhmmss')}.${ext}`;

        let oldpath = files.file.path
        console.log("===============旧地址====================", oldpath)
        newpath = "./upload/" + ttt;
        console.log("===============新地址====================", newpath)
        // console.log(oldpath, newpath)
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                console.log(err);
                throw Error("改名失败");
            }
        });

        res.status(200).json({
            code: 200,
            msg: `上传admin文件成功`,
            data: newpath,

        })
    });
})

/*
 * @description: 获取公告总数
 * @param {} 
 * @return: { ann_sum: int }
 */
router.post('/getAllAnnouncementsNum', async (req, res) => {
    let sql = `CALL PROC_GET_ANNOUNCEMENTS_NUM`;
    let params = {};
    callProc(sql, params, res, (r) => {
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '成功获取公告总数' });
    })
})

// 上传模板文件的记录
// params: { f_name: str, f_type: str, f_path: str }
router.post('/insertFileTemplate', async (req, res) => {
    let sql = `CALL PROC_INSERT_FILE_TEMPLATE(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql, params, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '成功插入模板文件记录' });
    })
})

// 根据通知id获取通知具体内容
// params: { ann_id: str }
router.post('/getAnnouncementDetails', async(req, res) => {
    let sql = `CALL PROC_GET_ANNOUNCEMENT_DETAILS(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql, params, res, (r) => {
        r.forEach(element => {
            switch (element['target']) {
                case 0:
                    element.target = '全体师生';
                    break;
                case 1:
                    element.target = '全体学生';
                    break;
                case 2:
                    element.target = '全体老师';
                    break;
                case 3:
                    element.target = '各系主任';
                    break;
                default:
                    break;
            }
        });
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '成功获取该通知具体内容' });
    })
})

router.post('/admindownload', function (req, res, next) {

	let filename = req.body.file
	console.log(res);
	res.download('./' + filename)

})

// 删除文件
// params: { id: str }
router.post('/delFile', async(req, res) => {
    let sql = `CALL PROC_DEL_FILE(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql, params, res, (r) => {
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '成功删除该文件' });
    })
})

/**
 * @description: 获取全部学生名单
 * @param {} 
 */
router.post('/getAllStu', async(req, res) => {
    let sql = `CALL PROC_GET_ALL_STU_NAMELIST()`;
    callProc(sql, {}, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '获取全部学生名单' });
    })
})

/**
 * @description: 获取全部教师名单
 * @param {} 
 */
router.post('/getAllTea', async(req, res) => {
    let sql = `CALL PROC_GET_ALL_TEA_NAMELIST()`;
    callProc(sql, {}, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '获取全部教师名单' });
    })
})

/**
 * @description: 修改名单某条信息
 * @param {key: String, name: String, job_title: String, maj: String, cls: String} 
 */
router.post('/editInfo', async(req, res) => {
    let params = req.body;
    let sql = `CALL PROC_EDIT_ONE_INFO(?)`;
    callProc(sql, params, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '修改名单信息成功！' });
    })
})

// 获取教师姓名，阶段，课题名及课题id
// params: {}
router.post('/getTopicAndTeacher', async(req, res) => {
    let sql = `CALL PROC_GET_ALL_TOPIC_AND_TEACHER`;
    let params = {};
    callProc(sql, params, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '获取课题阶段成功！' });
    })
})

// 获取timeline内state_id、相关阶段名称、开始日期、结束日期
// params: { major: str, role: int }
router.post('/getMajorTimeline', async(req, res) => {
    let sql = `CALL PROC_GET_MAJOR_TIMELINE(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql, params, res, (r) => {
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '获取时间阶段成功！' });
    })
})

// 获取timeline内state_id、相关阶段名称、开始日期、结束日期
// params: { major: str, role: int }
router.post('/updateMajorTimeline', async(req, res) => {
    let sql = `CALL PROC_UPDATE_MAJOR_TIMELINE(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql, params, res, (r) => {
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '获取时间阶段成功！' });
    })
})

module.exports = router