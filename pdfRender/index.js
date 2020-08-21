const express = require('express');
const utils = require('./util')
const fs = require('fs')
const puppeteer = require('puppeteer');
const callProc = utils.callProc;
const callN = utils.callProc_N;

const sleep = utils.sleep;
const app = express();

// 任务书
let taskData = [];
let taskTemp_i = 0;
// 指导书
let guideDate;
let guideBaseInfo;
let guideSumNum = 0;
let guideTemp_i = 0;


function getCurrentDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + "" + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
  return currentdate;
}
//设置静态文件
app.use(express.static('public'))
//用作浏览器访问页面
app.get('/', (req, res) => {
  if (taskTemp_i < taskData.length)
    res.sendFile(__dirname + '/view/m.html');
  else if (guideTemp_i < guideSumNum)
    res.sendFile(__dirname + '/view/guidanceLog.html');
})

//获取数据，每次获取结果不同

app.get('/getStat', (req, res) => {
  let task = fs.readFileSync(taskData[taskTemp_i].file.replace("./upload", "/root/upload"), "utf-8");
  console.log("获取的数据为：", taskData)
  taskData[taskTemp_i].task = task
  res.status(200).json({ code: 200, data: taskData[taskTemp_i++] })
})

app.get('/getGuidanceLog', (req, res) => {
  let sql = "call PROC_CAL_GUIDE_WITH_FOUR_SUBSCRIBE()";
  callN(sql, null, 2, res, (r) => {
    console.log("获取第", guideTemp_i + 1, "份任务书信息")

    guideBaseInfo = r[0][guideTemp_i]
    guideDate = r[0][guideTemp_i]
    guideSumNum = r[0].length
    guideDate = r[1].slice(guideTemp_i * 4, (guideTemp_i + 1) * 4)
    guideTemp_i++
    res.status(200).json({ code: 200, baseInfo: guideBaseInfo, data: guideDate })
  })

})

//开启服务
let server = app.listen(9999, () => {
  console.log("我起床了")
  console.log("listening。。");
  console.log(getCurrentDate());
  let sql = "call PROC_RENDER_PDF()";
  callProc(sql, null, null, async r => {
    //本地测试使用
    // for (let i = 0; i < r.length; i++) {
    //   r[i].file = r[i].file.replace("./", "C:/Users/Administrator/Desktop/短学期项目/");
    // }
    taskData = r;
    await rendPDF();
    await sleep(7600000)

  })
})
//保存task
taskSaveToDB = (data) => {
  const sql = "call PROC_SAVE_PDF(?)"
  return new Promise((resolve) => {
    callProc(sql, data, {}, r => {
      resolve(r)
    })
  })
}
// 保存指导日志
guideSaveToDB = (data) => {
  const sql = "call PROC_UPDATE_GUIDE_FILE(?)"
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
  for (let j = 0; j < taskData.length; j++) {
    console.log("\nnow printing ... ");
    let path = taskData[j].file.replace(".json", ".pdf");
    let pid = taskData[j].pid;
    await page.goto('http://localhost:9999');
    await sleep(2000);
    console.log(path)
    await page.pdf(
      {
        path: path.replace("./upload", "/root/upload"),
      });
    console.log(`printed ${j + 1} pages SUCCESS!!, now saving to DB`);
    await taskSaveToDB({ pid: pid, filePath: path });
    console.log("save SUCCESS!! now sending message");
    await sendMessage({ from: taskData[j].t_id, to: taskData[j].s_id, context: "任务书已发布" })
    console.log("send message SUCCESS!!");
  }
  console.log(`print over! all ${taskTemp_i} pages`);
  console.log(`任务书已经渲染完毕 开始渲染指导日志`);
  for (let guide_j = 0; guide_j < guideSumNum; guide_j++) {
    var date = new Date();
    console.log("\nnow printing ... ");
    
    await page.goto('http://localhost:9999');
    await sleep(2000);
    let path = `/root/upload/guide_${guideBaseInfo.sid}_${date.getTime()}.pdf`
    await page.pdf(
      {
        // path: path.replace("./upload", "/root/upload"),
      
        path: path
      });
    console.log(`printed ${guide_j + 1} pages SUCCESS!!, now saving to DB`);
    await guideSaveToDB({ pid: guideBaseInfo.pid, filePath: path.replace("/root/upload", "./upload") });
    console.log("save SUCCESS!! now sending message");
    await sendMessage({ from: '123123123', to: guideBaseInfo.sid, context: "指导日志可供下载" })
    // console.log("send message SUCCESS!!");
  }
  console.log("end loop & end print")
  await browser.close();
}