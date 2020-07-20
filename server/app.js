const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const formidable = require('formidable')
const moment = require('moment')
const compression = require('compression')
const https = require('https')
const db = require('./util/db')
const utils = require('./util')
const fs = require('fs')
const callProc = require('./util').callProc
let path = require("path");

const manage = require('./routes/manage');
const openGp = require('./routes/openGp');
const auditMg = require('./routes/auditMg');
const student = require('./routes/student');
const topic = require('./routes/topic');
const auditTp = require('./routes/auditTp');
const auditOp = require('./routes/auditOp');
const teacher = require('./routes/teacher');
const visualize = require('./routes/visualize');
const user = require('./routes/user');
const admin = require('./routes/admin');
const router = require('./routes/student');
const callProc_N = require('./util').callProc_N;


app.use(compression())
app.use(cors())
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))
app.use(express.static(__dirname + '/'))


app.use('/manage', manage);
app.use('/openGp', openGp);
app.use('/auditMg', auditMg);
app.use('/student', student);
app.use('/topic', topic);
app.use('/auditTp', auditTp);
app.use('/auditOp',auditOp);
app.use('/teacher', teacher);
app.use('/visualize', visualize);
app.use('/user',user);
app.use('/admin', admin);


const port = 8090;


app.get('/UserList', async function (req, res) {
	let sql = `CALL PROC_USER_LIST`

	callProc(sql, {}, res, (r) => {
		res.status(200).json({ code: 200, data: r })
	})
})
// app.post('/UploadTaskFile', async function (req, res) {
// 	const form = new formidable.IncomingForm()
// 	form.parse(req)

// 	form.on('fileBegin', function (name, file) {
// 		let type = file.name.split('.').slice(-1)
// 		console.log(file)
// 		file.path = 'upload/' + `Task_${moment(new Date()).format('YYYYMMDDhhmmss')}.${type}`
// 	})

// 	form.on('file', (name, file) => {
// 		res.status(200).json({
// 			code: 200,
// 			msg: '上传任务书成功',
// 			data: { path: file.path }
// 		})
// 	})
// })
// app.post('/UploadOpenFile', async function (req, res) {
// 	const form = new formidable.IncomingForm()
// 	form.parse(req)

// 	form.on('fileBegin', function (name, file) {
// 		let type = file.name.split('.').slice(-1)
// 		console.log(file)
// 		file.path = 'upload/' + `Open_${moment(new Date()).format('YYYYMMDDhhmmss')}.${type}`
// 	})

// 	form.on('file', (name, file) => {
// 		res.status(200).json({
// 			code: 200,
// 			msg: '上传开题报告成功',
// 			data: { path: file.path }
// 		})
// 	})
// })
// app.post('/UploadPaperFile', async function (req, res) {
// 	const form = new formidable.IncomingForm()
// 	form.parse(req)

// 	form.on('fileBegin', function (name, file) {
// 		let type = file.name.split('.').slice(-1)
// 		console.log(file)
// 		file.path = 'upload/' + `Paper_${moment(new Date()).format('YYYYMMDDhhmmss')}.${type}`
// 	})

// 	form.on('file', (name, file) => {
// 		res.status(200).json({
// 			code: 200,
// 			msg: '上传论文终稿成功',
// 			data: { path: file.path }
// 		})
// 	})
// })
// app.post('/UploadDocsFile', async function (req, res) {
// 	const form = new formidable.IncomingForm()
// 	form.parse(req)

// 	form.on('fileBegin', function (name, file) {
// 		let type = file.name.split('.').slice(-1)
// 		console.log(file)
// 		file.path = 'upload/' + `Dos_${moment(new Date()).format('YYYYMMDDhhmmss')}.${type}`
// 	})

// 	form.on('file', (name, file) => {
// 		res.status(200).json({
// 			code: 200,
// 			msg: '上传文献综述成功',
// 			data: { path: file.path }
// 		})
// 	})
// })
// app.post('/UploadTransFile', async function (req, res) {
// 	const form = new formidable.IncomingForm()
// 	form.parse(req)

// 	form.on('fileBegin', function (name, file) {
// 		let type = file.name.split('.').slice(-1)
// 		console.log(file)
// 		file.path = 'upload/' + `Trans_${moment(new Date()).format('YYYYMMDDhhmmss')}.${type}`
// 	})

// 	form.on('file', (name, file) => {
// 		res.status(200).json({
// 			code: 200,
// 			msg: '上传外文翻译成功',
// 			data: { path: file.path }
// 		})
// 	})
// })
// app.post('/UploadCheckFile', async function (req, res) {
// 	const form = new formidable.IncomingForm()
// 	form.parse(req)

// 	form.on('fileBegin', function (name, file) {
// 		let type = file.name.split('.').slice(-1)
// 		console.log(file)
// 		file.path = 'upload/' + `Check_${moment(new Date()).format('YYYYMMDDhhmmss')}.${type}`
// 	})

// 	form.on('file', (name, file) => {
// 		res.status(200).json({
// 			code: 200,
// 			msg: '上传查重报告成功',
// 			data: { path: file.path }
// 		})
// 	})
// })

app.post('/upload', async function (req, res) {
    const form = new formidable.IncomingForm()
    form.uploadDir = "./upload/";

    let get_data, newpath;
    form.parse(req, (err, fields, files) => {
        if (err || !files.file) {
            res.status(500);
        }
        get_data = fields;
        let ext = files.file.name.split('.').slice(-1)
        let ttt = `${get_data.type}_${get_data.sid}_${moment(new Date()).format('YYYYMMDDhhmmss')}.${ext}`;

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
        let sql = `CALL PROC_UPDATE_TOPIC_DATA(?)`;

        get_data.filePath = newpath;

        callProc(sql, get_data, res, (r) => {
            res.status(200).json({
                code: 200,
                msg: `上传${get_data.type}成功`,
                data: newpath,
                mysqldata: r
            })
        });
    });
})
app.post('/download', function (req, res, next) {

	let filename = req.body.file
	console.log(res);
	res.download('./' + filename)

})

// 判断教师是否上传过签名
app.post('/checkSign', async function (req, res) {
    let sql = 'CALL PROC_GET_TOPICID_SIGN_PATH(?)';
    let get_data = req.body;
    callProc(sql, get_data, res, (r) => {
        console.log(r);
        if (r[0].sign != null) {
            r[0] = 1;
        } else {
            r[0] = 0;
        }
        console.log(r);
        res.status(200).json({
            code: 200,
            data: r,
            msg: '签名状态已返回'
        });
    })
})

// 各端共用接口：获取通知
// params: { uid: str, role: int }
app.post('/getPersonalAnnouncement', async(req, res) => {
    let sql = `CALL PROC_GET_PERSONAL_ANNOUNCEMENT(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql, params, res, (r) => {
        // if (params['role'] == '2') {
        //     var results = [];
        //     var manager = [];
        //     var teacher = [];
        //     r.forEach(element => {
        //         if (element['target'] == '3') {
        //             manager.push(element);
        //         } else {
        //             teacher.push(element);
        //         }
        //         delete element.target;
        //     });
        //     results.push(manager);
        //     results.push(teacher);
        //     console.log(results);
        //     r = results;
        // }
        var read = [];
        var unread = [];
        r.forEach(element => {
            if (element['check_flag'] == 1) {
                read.push(element);
            } else {
                unread.push(element);
            }
        });
        var reads = [read, unread];
        res.status(200).json({ code: 200, data: reads, msg: '成功获取已读与未读公告' });
    })
})

// 各端共用接口：标记公告为已读
// params: { uid: str, ann_id: str }
app.post('/updateAnnouncementRead', async(req, res) => {
    let sql = `CALL PROC_UPDATE_ANNOUNCEMENT_READ(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql, params, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '成功将公告标记为已读' });
    })
})

// 各端共用接口：获取所有站内信（未读 + 已读）
// params: { uid: str }
app.post('/getPersonalMessages', async(req, res) => {
    let sql = `CALL PROC_GET_ALL_MESSAGES(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql,params, res, (r) => {
        var all = [];
        var time = [];
        r.forEach(element => {
            if (time.indexOf(element['time']) == -1) {
                var day = [];
                time.push(element['time']);
                day.push(element);
                all.push(day);
            } else {
                all.forEach(ele => {
                    if (ele[0]['time'] == element['time']) {
                        ele.push(element);
                    }
                });
            }
        });
        console.log(all);
        res.status(200).json({ code: 200, data: all, msg: '成功获取所有站内信' });
    })
})

// 各端共用接口：将未读的站内信置为已读
// params: { uid: str }
app.post('/updateMessagesRead', async(req, res) => {
    let sql = `CALL PROC_UPDATE_MESSAGES_READ(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql, params, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '成功获取将未读站内信置为已读' });
    })
})

// 各端共用接口：站内信发布（一对一）
// params: { from: str, to: str, context: str }
app.post('/insertMessageToOne', async(req, res) => {
    let sql = `CALL PROC_INSERT_MESSAGE_TO_ONE(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql, params, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '成功发布一对一站内信' });
    })
})

// 各端共用端口：站内信发布（一对多）
// params: { from: str, to: str, context: str}
// to: admin 管理员; allTea 全体教师; audTea 本系审核教师; topTea 本系课题对应教师; allStu 全体学生; topStu 本系学生
app.post('/insertMessageToMany', async(req, res) => {
    let sql = `CALL PROC_INSERT_MESSAGE_TO_MANY(?)`;
    let params = req.body;
    console.log(params);
    callProc_N(sql, params, 1, res, (r) => {
        res.status(200).json({ code: 200, data: r, msg: '成功发布一对多站内信' });
    })
})

app.listen(port, () => console.log(`> Running on localhost:${port}`))

module.exports = app;
