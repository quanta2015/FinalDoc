

const express = require('express');
const router = express.Router();
const callProc = require('../util').callProc;
const callProc_N = require('../util').callProc_N;

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
 * @description: 查看指导意见
 * @param {sid: str} 
 * @return: 
 */
router.post('/getGuidance', async(req, res) => {
    let sql = `CALL PROC_GET_GUIDANCE(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql, params, res, (r) => {
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '查看指导意见成功' });
    })
})

// 接口改为公用，移至app.js下getPersonalAnnouncement
// 存储过程已删除
// /**
//  * @description: 获取学生允许查看的公告
//  * @param { sid: str } 
//  * @return: 
//  */
// router.post('/getStudentNotice', async(req, res) => {
//     let sql = `CALL PROC_GET_STUDENT_NOTICE(?)`;
//     let params = req.body;
//     console.log(params);
//     callProc(sql, params, res, (r) => {
//         console.log(r);
//         var read = [];
//         var unread = [];
//         r.forEach(element => {
//             if (element['check_flag'] == 1) {
//                 read.push(element);
//             } else {
//                 unread.push(element);
//             }
//         });
//         var reads = [read, unread];
//         res.status(200).json({ code: 200, data: reads, msg: '成功获取已读与未读公告' });
//     })
// })

/**
 * @description: 获取当前所在阶段及截止时间
 * @param {} 
 * @return: { state: int, time: str, title: str }
 */
router.get('/getCurrentState', async(req, res) => {
    let sql = `CALL PROC_GET_CURRENT_STATE`;
    let params = {};
    callProc(sql, params, res, (r) => {
        switch (r[0]['state']) {
            case 1:
                r[0].title = '任务书';
                break;
            case 2:
                r[0].title = '开题中期';
                break;
            case 3:
                r[0].title = '论文审核';
                break;
            case 4:
                r[0].title = '论文答辩';
                break;
            case 5:
                r[0].title = '成绩审定';
                break;
            default:
                break;
        }
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '成功获取当前阶段与截止时间'});
    })
})

// 接口改为公用，移至app.js下updateAnnouncementRead
// 存储过程已删除
// /**
//  * @description: 标记公告为已读
//  * @param { uid: str, ann_id: str } 
//  * @return: 
//  */
// router.post('/UpdateStudentNotice', async(req, res) => {
//     let sql = `CALL PROC_UPDATE_STUDENT_NOTICE(?)`;
//     let params = req.body;
//     console.log(params);
//     callProc(sql, params, res, (r) => {
//         res.status(200).json({ code: 200, data: r, msg: '成功将公告标记为已读' });
//     })
// })

/**
 * @description: 所有阶段及其截止时间
 * @param {} 
 * @return: { state: int, time: str, title: str }
 */
router.post('/getAllStates', async(req, res) => {
    let sql = `CALL PROC_GET_ALL_STATES`;
    let params = {};
    callProc(sql, params, res, (r) => {
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '成功返回所有阶段及其截止时间' });
    })
})

// 接口改为公用，移至app.js下getPersonalMessages
// // 获取所有站内信，未读 + 已读
// // params: { uid: str }
// router.post('/getStudentMessages', async(req, res) => {
//     let sql = `CALL PROC_GET_ALL_MESSAGES(?)`;
//     let params = req.body;
//     console.log(params);
//     callProc(sql,params, res, (r) => {
//         var all = [];
//         var time = [];
//         r.forEach(element => {
//             if (time.indexOf(element['time']) == -1) {
//                 var day = [];
//                 time.push(element['time']);
//                 day.push(element);
//                 all.push(day);
//             } else {
//                 all.forEach(ele => {
//                     if (ele[0]['time'] == element['time']) {
//                         ele.push(element);
//                     }
//                 });
//             }
//         });
//         console.log(all);
//         res.status(200).json({ code: 200, data: all, msg: '成功获取所有站内信' });
//     })
// })

// 接口改为公用，移至app.js下updateMessagesRead
// // 将未读的站内信置为已读
// // params: { uid: str }
// router.post('/updateStudentMessageRead', async(req, res) => {
//     let sql = `CALL PROC_UPDATE_STUDENT_MESSAGE_READ(?)`;
//     let params = req.body;
//     console.log(params);
//     callProc(sql, params, res, (r) => {
//         res.status(200).json({ code: 200, data: r, msg: '成功获取将未读站内信置为已读' });
//     })
// })

// 获取学生模板文件
// params: {}
router.post('/getAllStudentTemplate', async(req, res) => {
    let sql = `CALL PROC_GET_ALL_FILE_INFO`;
    let params = {};
    callProc(sql, params, res, (r) => {
        var template = [];
        var midOpening = [];
        var finalPaper = [];
        var thesisDefense = [];
        r.forEach(element => {
            switch (element['f_type']) {
                case 221:
                    midOpening.push(element);
                    break;
                case 222:
                    finalPaper.push(element);
                    break;
                case 223:
                    thesisDefense.push(element);
                    break;
                default:
                    break;
            }
        });
        template.push(midOpening, finalPaper, thesisDefense);
        console.log(template);
        res.status(200).json({ code: 200, data: template, msg: '成功获取学生模板文件' });
    })
})

// 获取status阶段
// params: { uid: str }
router.post("/getStudentTopicStatus", async(req, res) => {
    let sql = `CALL PROC_GET_STUDENT_TOPIC_STATUS(?)`;
    let params = req.body;
    callProc_N(sql, params, 2, res, (r) => {
        console.log(r);
        var result = []
        var results = {};
        var status;
        console.log(r[1]);
        if (r[1].length == 0) {
            status = r[0][0]['status'];
            switch (status) {
                case 0:
                    // 发布课题
                    results.status = 11;
                    break;
                case 1:
                    if (r[0][0]['sel'] == -1) {
                        // 选择课题
                        results.status = 12;
                    } else {
                        results.status = 11;
                    }
                    break;
                default:
                    break;
            }
        } else {
            status = r[0][1]['status'];
            switch (status) {
                case -1:
                    // 学生被拒绝
                    results.status = 12;
                    break;
                case 2:
                    // 学生选择课题
                    results.status = 12;
                    break;
                case 3:
                    // 双选成功
                    results.status = 13;
                    break;
                case 4:
                    results.status = 13;
                    break;
                case 5:
                    results.status = 13;
                    break;
                case 6:
                    // 学生下载任务书
                    results.status = 21;
                    break;
                default:
                    break;
            }
        }
        
        result.push(results)
        res.status(200).json({ code: 200, data: result, msg: '成功获取阶段状态' });
    })
})

// 获取开题答辩信息
// params: { uid: str }
router.post('/getOpenQuestionInfo', async(req, res) => {
    let sql =  `CALL PROC_GET_OPEN_QUESTION_INFO(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql, params, res, (r) => {
        console.log(r);
        if (r.length > 0) {
            switch (r[0]['week']) {
                case '0':
                    r[0].week = '星期天';
                    break;
                case '1':
                    r[0].week = '星期一';
                    break;
                case '2':
                    r[0].week = '星期二';
                    break;
                case '3':
                    r[0].week = '星期三';
                    break;
                case '4':
                    r[0].week = '星期四';
                    break;
                case '5':
                    r[0].week = '星期五';
                    break;
                case '6':
                    r[0].week = '星期六';
                    break;
                default:
                    break;
            }
        }
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '成功获取开题答辩信息' });
    })
})

// 第一阶段成绩显示
// params: { uid: str }
router.post('/getOpenScore', async(req, res) => {
    let sql = `CALL PROC_GET_OPEN_SCORE(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql, params, res, (r) => {
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '成功获取开题答辩成绩' });
    })
})

module.exports = router;