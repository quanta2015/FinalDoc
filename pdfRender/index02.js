const express = require('express');
const utils = require('./util')
const fs = require('fs')
const puppeteer = require('puppeteer');
const callProc = utils.callProc;
const callProc_N = utils.callProc_N;
const sleep = utils.sleep;
const app = express();

//设置静态文件
app.use(express.static('public'));
//用作浏览器访问页面
app.get('/', (req, res) => {
    res.sendFile(__dirname, + 'view/guidanceLog.html');
})

//获取数据，每次获取结果不同
let data;
let i = 0;
app.get('/getStat', (req, res) => {
  let task = fs.readFileSync(data[i].file.replace("./upload","/root/upload"), "utf-8");
  console.log("获取的数据为：",data)
  data[i].task = task
  res.status(200).json({ code: 200, data: data[i++] })
})

//开启服务
let server = app.listen(9999, () => {
    console.log("我起床了")
    console.log("listening。。");
    let sql = "call PROC_GET_GUIDANCE_AND_BASICINFO(?)";
    let params = { sid: '2017212212146' };
    callProc_N(sql, params, 2, null, async r => {
      //本地测试使用
      // for (let i = 0; i < r.length; i++) {
      //   r[i].file = r[i].file.replace("./", "C:/Users/Administrator/Desktop/短学期项目/");
      // }
        data = r;
        // await rendPDF();
        // await sleep(7600000);
        console.log(r);
      
    })
  })