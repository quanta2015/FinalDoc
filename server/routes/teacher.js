const url = require('url');
const express = require('express');
const router = express.Router();
const callProc = require('../util').callProc;
const formidable = require('formidable');
const bodyParser = require('body-parser');
const fs = require('fs');
const moment = require('moment');

// 获取所有选题类型
router.get('/getAllType', async(req, res) => {
    let sql = `CALL RROC_GET_ALL_TOPIC_TYPES`;
    callProc(sql, {}, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '取所有选题类型'});
    })
})

// 由不完整学号得到学生列表（学号和姓名）：模糊查询
router.post('/getStuInfoByLikeID', async(req, res) => {
    let sql = `CALL PROC_STUID_INFO_FUZZY(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '取学生列表'});
    })
})

// 发布教师课题（或修改）
router.post('/postTopicInfo', async(req, res) => {
    let params = req.body;
    var area = "";
    if (params.area.length != 0) {
        for (let i = 0; i < params.area.length - 1; i++) {
            const element = params.area[i];
            area += element + "|";
        }
        area += params.area[params.area.length - 1];
        params.area = area;
    }
    let sql;
    if (params.topic_id == '') {
        sql = `CALL PROC_TOPIC_INIT_INSERT(?)`;
    } else {
        sql = `CALL PROC_TOPIC_ALTER(?)`;
    }
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '课题发布成功'});
    })
})

// 由教师id获取topic内容（课题id，课题状态）
router.post('/getTidgetTopic', async(req, res) => {
    let sql = `CALL PROC_GET_TOPIC_STATUS(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        var pass0 = 0;
        var pass1 = 1;
        var pass2 = 2;
        var pass3 = 3;
        for (let index = 0; index < r.length; index++) {
            if (r[index].status != 3) {
                r[index].sid = null;
            }
            if (r[index].sel == 0) {
                r[index].pass = pass0;
            } else if(r[index].result == 0) {
                if (r[index].sugg == null) {
                    r[index].pass = pass1;
                } else {
                    r[index].pass = pass2;
                }
            } else {
                r[index].pass = pass3;
            }
        }
        res.status(200).json({code: 200, data: r, msg: '课题查询成功，返回课题列表'});
    })
})

// 由课题pid获取课题内容（课题名称，课题类别，课题简介，学生id，学生名字）
router.post('/getTopicFullInfo', async(req, res) => {
    let sql = `CALL PROC_PID_GET_TOPIC_INFO(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        var areas = r[0]["area"].split("|");
        var area = [];
        if (r[0]["area"].length != 0) {
            // area字段不为空
            for (let i = 0; i < areas.length; i++) {
                area.push(parseInt(areas[i]));
            }
        }
        r[0]["area"] = area;
        res.status(200).json({code: 200, data: r, msg: '通过课题id课题查询成功，返回课题内容'});
    })
})

// 根据课题id删除课题
router.post('/delOneTopicWithID', async(req, res) => {
    let sql = `CALL PROC_DEL_ONE_TOPIC(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: null, msg: '删除成功'});
    })
})

  // 送回该教师所有研究方向数据
//   router.post('/getTopicAllAreas', async(req, res) => {
//     let sql = `CALL PROC_GET_TOPIC_ALL_AREAS`;
//     let params = req.body;
//     callProc(sql, params, res, (r) => {
//         res.status(200).json({code: 200, data: r, msg: '返回所有研究方向'});
//     })
//   })

// 根据学生id获取学生个人信息
router.post('/getStuPersonalInfo', async(req, res) => {
    let sql = `CALL PROC_GET_STUDENT_PERSONAL_INFO(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '返回该学生个人信息'});
    })
})

// 根据教师id获取课题审核
router.post('/getTopicCheckStudent', async(req, res) => {
    let sql = `CALL PROC_GET_TID_TOPIC_CHECKED(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '返回该教师的课题信息'});
    })
})

// 记录学生是否被教师拒绝
router.post('/getTopicStudentAlter', async(req, res) => {
    let sql = `CALL PROC_GET_TOPIC_STUDENT_PASS(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '学生审核已修改'});
    })
})

// 根据教师id返回研究方向
router.post('/getTeacherAreas', async(req, res) => {
    let sql = `CALL PROC_GET_TEACHER_AREAS(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        var areas = r[0].area_list.split(',');
        r = [];
        for (let i = 0; i < areas.length; i++) {
            const element = areas[i].split('|');
            var item = {}; 
            item.id = parseInt(element[0]);
            item.area = element[1];
            item.color = element[2];
            r.push(item);
        }
        res.status(200).json({code: 200, data: r, msg: '教师研究方向数组已返回'});
    })
})

// 根据课题id返回被审核意见
router.post('/getTidToTsugg', async(req, res) => {
    let sql = `CALL PROC_GET_TID_TSUGG(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '课题被审核意见已返回'});
    })
})

// 返回所有通过审核的课题
router.get('/getAllPassedTopic', async(req, res) => {
    let sql = `CALL PROC_GET_ALL_PASSED_TOPIC`;
    callProc(sql, {}, res, (r) => {
        for (let i = 0; i < r.length; i++) {
            var areas = r[i]["areas"].split(",");
            var color = r[i]["color"].split(",");
            var area = [];
            for (let j = 0; j < areas.length; j++) {
                area.push({name: areas[j], color: color[j]});
            }
            r[i].area = area;
            delete r[i].areas;
            delete r[i].color
        }
        res.status(200).json({code: 200, data: r, msg: '所有通过审核的课题信息已返回'});
    })
})

// 通过topicID查询课题所有文件
router.post('/getAllTopicFiles', async(req, res) => {
    let sql = `CALL PROC_GET_TOPICID_ALL_TOPIC_FILES(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '所有课题的文件已返回'});
    })
})

// 通过topicID解绑学生
router.post('/getStudentUntied', async(req, res) => {
    let sql = `CALL PROC_GET_TOPICID_STUDENT_UNTIED(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '已解绑该课题下学生'});
    })
})

// 上传教师签名文件
router.use(bodyParser.json({limit: '10mb'}));
router.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
router.post('/uploadSign', async(req, res) => {
    let imgData = req.body.file;

    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, '');
    var dataBuffer = Buffer.from(base64Data, 'base64');
    var path = './upload/' + `${req.body.type}_${req.body.uid}_${moment(new Date()).format('YYYYMMDDhhmmss')}.jpg`;
    fs.writeFile(path, dataBuffer, function (err) {
        if (err) {
            return;
        }
        console.log('图片保存成功');
    })
    let sql = `CALL PROC_UPDATE_USER_SIGN(?)`;
    let params = req.body;
    params.filePath = path;
    delete params.file;
    callProc(sql, params, res, (r) => {
        console.log(params)
        res.status(200).json({code: 200, data: r, msg: '签名文件已上传'});
        console.log(r);
    })
})

module.exports = router;