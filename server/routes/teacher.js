/*
 * @Descripttion: 第一阶段 教师端相关接口
 * @version: 1.0
 * @Author: East Wind
 * @Date: 2020-07-09 10:05:28
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-07-09 14:21:37
 */ 

const url = require('url');
const express = require('express');
const router = express.Router();
const callProc = require('../util').callProc;
const formidable = require('formidable');
const bodyParser = require('body-parser');
const fs = require('fs');
const moment = require('moment');

/**
 * @name: getAllType
 * @test: 
 * @msg: 获取所有选题类型
 * @param {} 
 * @return: [{id: int, name: string}]
 */
router.get('/getAllType', async(req, res) => {
    let sql = `CALL RROC_GET_ALL_TOPIC_TYPES`;
    callProc(sql, {}, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '取所有选题类型'});
    })
})

/**
 * @name: getStuInfoByLikeID
 * @test: 
 * @msg: 由不完整学号得到学生列表（学号和姓名）：模糊查询
 * @param {num: int} 
 * @return: [{uid: string, name: string, topic: string}]
 */
router.post('/getStuInfoByLikeID', async(req, res) => {
    let sql = `CALL PROC_STUID_INFO_FUZZY(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '取学生列表'});
    })
})

/**
 * @name: postTopicInfo
 * @test: test font
 * @msg: 发布教师课题（或修改）
 * @param {topic_id: int, tea_id: string, stuId: string, name: string, type: string, area: [int], note: string} 
 * @return: 
 */
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
/**
 * @name: getTidgetTopic
 * @test: test font
 * @msg: 由教师id获取topic内容（课题id，课题状态）
 * @param {tea_id: string} 
 * @return: [{id: int, topic: string, sid: string, status: int, sel: int, result: int, sugg: string, pass: int}]
 */
router.post('/getTidgetTopic', async(req, res) => {
    let sql = `CALL PROC_GET_TOPIC_STATUS(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        // 课题状态
        for (let index = 0; index < r.length; index++) {
            switch (r[index].status) {
                case 9:// 最终论文审核 系主任通过
                    r[index].pass = 4;
                    break;
                case 8:// 最终论文审核 教师通过
                    r[index].pass =4;
                    break;
                case 7:// 论文答辩 通过
                    r[index].pass = 4;
                    break;
                case 6:// 论文定稿 系主任通过
                    r[index].pass = 4;
                    break;
                case 5:// 论文定稿 教师通过
                    r[index].pass = 4;
                    break;
                case 4:// 开题答辩 通过
                    r[index].pass = 4;
                    break;
                case 3:// 学生通过课题
                    r[index].pass = 4;
                    break;
                case 2:// 学生选择课题
                    r[index].pass = 5;
                    break;
                case 1:// 教师课题 通过
                    if (r[index].sid == null) {
                        r[index].pass = 3;
                    } else {
                        r[index].pass = 4;
                    }
                    break;
                case 0:// 教师已新建课题
                    if (r[index].sel == 0) {// 未分配
                        r[index].pass = 0;
                    } else {
                        if (r[index].sugg == null) {// 未审核
                            r[index].pass = 1;
                        } else {// 审核被拒绝
                            r[index].pass = 2;
                        }
                    }
                    break;
                default:
                    break;
            }
            
        }
        res.status(200).json({code: 200, data: r, msg: '课题查询成功，返回课题列表'});
    })
})

/**
 * @name: getTopicFullInfo
 * @test: test font
 * @msg: 由课题pid获取课题内容（课题名称，课题类别，课题简介，学生id，学生名字）
 * @param {pid: string} 
 * @return: [{tid: str, topic: str, type: str, note: str, sid: str, name: str, area: [int]}]
 */
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

/**
 * @name: delOneTopicWithID
 * @test: test font
 * @msg: 根据课题id删除课题
 * @param {id: str} 
 * @return: 
 */
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

/**
 * @name: getStuPersonalInfo
 * @test: test font
 * @msg: 根据学生id获取学生个人信息
 * @param {sid: str} 
 * @return: [{id: int, uid: str, name: str, pwd: str, dep: str, maj: str, cls: str, tel: str, area: str, role: int, sign: str}]
 */
router.post('/getStuPersonalInfo', async(req, res) => {
    let sql = `CALL PROC_GET_STUDENT_PERSONAL_INFO(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '返回该学生个人信息'});
    })
})

// 
/**
 * @name: getTopicCheckStudent
 * @test: test font
 * @msg: 根据教师id获取学生正在申请的课题
 * @param {tea_id} 
 * @return: [{id: int, topic: str, sid: str, name: str}]
 */
router.post('/getTopicCheckStudent', async(req, res) => {
    let sql = `CALL PROC_GET_TID_TOPIC_CHECKED(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '返回该教师的课题信息'});
    })
})

/**
 * @name: getTopicStudentAlter
 * @test: test font
 * @msg: 记录学生是否被教师拒绝
 * @param {topic_id: str, sid: str, val: int} 
 * @return: 
 */
router.post('/getTopicStudentAlter', async(req, res) => {
    let sql = `CALL PROC_GET_TOPIC_STUDENT_PASS(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '学生审核已修改'});
    })
})

/**
 * @name: getTeacherAreas
 * @test: test font
 * @msg: 根据教师id返回研究方向
 * @param {tid: str} 
 * @return: [{id: int, area: str, color: str}]
 */
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

/**
 * @name: getTidToTsugg
 * @test: test font
 * @msg: 根据课题id返回被审核意见
 * @param {pid: str} 
 * @return: [{sugg: str}]
 */
router.post('/getTidToTsugg', async(req, res) => {
    let sql = `CALL PROC_GET_TID_TSUGG(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '课题被审核意见已返回'});
    })
})

/**
 * @name: getAllPassedTopic
 * @test: test font
 * @msg: 返回所有通过审核的课题
 * @param {} 
 * @return: [{name: str, id: int, tie: str, area: [{name: str, color: str}]}]
 */
router.get('/getAllPassedTopic', async(req, res) => {
    let sql = `CALL PROC_GET_ALL_PASSED_TOPIC`;
    callProc(sql, {}, res, (r) => {
        var result = [];
        for (let i = 0; i < r.length; i++) {
            var element = {};
            var area = [];
            element.name = r[i].name;
            element.id = r[i].id;
            element.tid = r[i].tid;
            var areas = r[i].area_list.split(',');
            for (let j = 0; j < areas.length; j++) {
                var items = areas[j].split('|');
                var item = {};
                item.name = items[1];
                item.color = items[2];
                area.push(item);
            }
            element.area = area;
            result.push(element);
        }
        console.log(result);
        res.status(200).json({code: 200, data: result, msg: '所有通过审核的课题信息已返回'});
    })
})

/**
 * @name: getAllTopicFiles
 * @test: test font
 * @msg: 通过topicID查询课题所有文件
 * @param {pid: str} 
 * @return: [{f_task: str, f_open: str, f_docs: str, f_tran: str, f_paper: str, ...}]
 */
router.post('/getAllTopicFiles', async(req, res) => {
    let sql = `CALL PROC_GET_TOPICID_ALL_TOPIC_FILES(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '所有课题的文件已返回'});
    })
})

/**
 * @name: getStudentUntied
 * @test: test font
 * @msg: 通过topicID解绑学生
 * @param {pid: str} 
 * @return: 
 */
router.post('/getStudentUntied', async(req, res) => {
    let sql = `CALL PROC_GET_TOPICID_STUDENT_UNTIED(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        res.status(200).json({code: 200, data: r, msg: '已解绑该课题下学生'});
    })
})

/**
 * @name: uploadSign
 * @test: test font
 * @msg: 上传教师签名文件
 * @param {uid: str, file: str, } 
 * @return: 
 */
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

router.post('/saveTask',async(req,res)=>{
    let pid = req.body.pid;
    let data = req.body.data;
    data.ft[0] = moment(data.ft[0]).format('YY-MM-DD')
    data.ft[1] = moment(data.ft[1]).format('YY-MM-DD')
    for (let i in data.schedule ){
        data.schedule[i].time[0] = moment(data.schedule[i].time[0]).format('YY-MM-DD');
        data.schedule[i].time[1] = moment(data.schedule[i].time[1]).format('YY-MM-DD');
    }
    data = JSON.stringify(data)

    let path = `./upload/task_${pid}_${moment(new Date()).format('YYYYMMDDhhmmss')}.json`
    console.log(path);
    fs.writeFile(path,data,err=>{
        if(err){
            return;
        }
    })
    let sql = `CALL PROC_UPDATE_F_TASK(?)`;
    let p = {};
    p.filePath = path;
    p.pid = pid;
    callProc(sql,p,res,()=>{
        res.status(200).json({code:200,msg:'已成功上传任务书'})
    })
    
})

router.post('/getTask',async(req,res)=>{
    let data = req.body;
    let sql = `CALL PROC_SELECT_F_TASK(?)`
    callProc(sql,data,res,r=>{
        let path = r[0].f_task;
        console.log(path);
        if(!path){
            res.status(200).json({code:200,data:{},message:'该课题没有任务书！'})
            return;
        }
        if(path.endsWith('.pdf')&&data.role!=2){
            res.download(path);
            
        }else{
            path.replace('.pdf','.json');
            let s = JSON.parse( fs.readFileSync(path,'utf-8'));
            res.status(200).json({code:200,data:s,message:'已成功获取任务书'})
        }
    })
})

router.post('/canPublish',async(req,res)=>{
    let data = req.body
    console.log(data);
    let sql = 'CALL PROC_CHECK_CAN_PUBLISH(?)';
    callProc(sql,data,res,r=>{
        console.log(r);
        res.status(200).json({code:200,r,message:'已获取是否能发布新课题'})
    })
})

module.exports = router;
