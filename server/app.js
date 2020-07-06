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
const teacher = require('./routes/teacher')
const visualize = require('./routes/visualize')
const user = require('./routes/user')


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
app.use('/teacher', teacher);
app.use('/visualize', visualize);
app.use('/user',user);


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


app.listen(port, () => console.log(`> Running on localhost:${port}`))

module.exports = app;
