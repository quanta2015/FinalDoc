const express = require('express');
const utils = require('./util')
const fs = require('fs')
const puppeteer = require('puppeteer');
const callProc = utils.callProc;
const sleep = utils.sleep;
const app = express();
//设置静态文件
app.use(express.static('public'))
//用作浏览器访问页面
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/view/m.html');
})

//获取数据，每次获取结果不同
let data;
let i = 0;
app.get('/getStat', (req, res) => {
  let task = fs.readFileSync(data[i].file, "utf-8");
  data[i].task = task
  res.status(200).json({ code: 200, data: data[i++] })
})

//开启服务
let server = app.listen(9999, () => {
  console.log("listening。。");
  let sql = "call PROC_RENDER_PDF()";
  callProc(sql, null, null, async r => {
    //本地测试使用
    for (let i = 0; i < r.length; i++) {
      r[i].file = r[i].file.replace("./", "C:/Users/Administrator/Desktop/短学期项目/");
    }
    data = r;
    await rendPDF();
    process.exit();
  })
})
//保存task
saveToDB = (data) => {
  const sql = "call PROC_SAVE_PDF(?)"
  return new Promise((resolve) => {
    callProc(sql, data, {}, r => {
      resolve(r)
    })
  })
}
//发送消息
sendMessage = (data) => {
  const sql = "CALL PROC_INSERT_MESSAGE_TO_ONE(?)";
  return new Promise((resolve) => {
    callProc(sql, data, {}, r => {
      resolve(r)
    })
  })
}

//生成pdf
rendPDF = async () => {
  const browser = await puppeteer.launch({
    // args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // headless: false, 
    // ignoreDefaultArgs: ['--disable-extensions']
    args: ['--no-sandbox'],
    headless: true
  });
  const page = await browser.newPage();
  for (let j = 0; j < data.length; j++) {
    console.log("\nnow printing ... ");
    let path = data[j].file.replace(".json", ".pdf");
    let pid = data[j].pid;
    await page.goto('http://localhost:9999');
    await sleep(2000);
    await page.pdf(
      {
        path: path,
      });
    console.log(`printed ${j + 1} pages SUCCESS!!, now saving to DB`);
    await saveToDB({ pid: pid, filePath: path });
    console.log("save SUCCESS!! now sending message");
    await sendMessage({ from: data[j].t_id, to: data[j].s_id, context: "任务书已发布" })
    console.log("send message SUCCESS!!");
  }
  console.log(`print over! all ${i} pages`);
  await browser.close();
}