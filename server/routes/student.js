

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
 * @description: 查看指导日志
 * @param { sid: str } 
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
router.post('/getCurrentState', async(req, res) => {
    let sql = `CALL PROC_GET_CURRENT_STATE(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
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
 * @param { uid: str } 
 * @return: { state: int, time: str, title: str }
 */
router.post('/getAllStates', async(req, res) => {
    let sql = `CALL PROC_GET_ALL_STATES(?)`;
    let params = req.body;
    callProc(sql, params, res, (r) => {
        console.log(r);
        r[0].state_name = '任务书';
        r[4].state_name = '成绩审定';
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

// 获取nav上的status阶段
// params: { uid: str }
router.post("/getStudentTopicStatus", async(req, res) => {
    let sql = `CALL PROC_GET_STUDENT_TOPIC_STATUS(?)`;
    let params = req.body;
    console.log(params);
    var result = [];
    var results = {};
    callProc(sql, params, res, (r) => {
        console.log(r);
        if (r.length == 0) {
            console.log('课题都没创建还想看，阁下何不乘风起，扶摇直上九万里:)');
            results.stageId = 0;
            results.currId = 0;
        } else if (params['uid'] == r[0]['sid']) {
            console.log("是本人的课题id，干就完了！");
            console.log(r[0]['status']);
            if (r[0]['status'] < 4) {
                results.stageId = 0;
                switch (r[0]['status']) {
                    case -1:
                        results.currId = 0;
                        break;
                    case 2:
                        results.currId = 1;
                        break;
                    case 3:
                        results.currId = 2;
                        break;
                    default:
                        break;
                }
            } else if (r[0]['status'] < 9) {
                results.stageId = 1;
                switch (r[0]['status']) {
                    case 4:
                        results.currId = 0;
                        break;
                    case 5:
                        results.currId = 0;
                        break;
                    case 6:
                        results.currId = 1;
                        break;
                    case 7:
                        results.currId = 2;
                        break;
                    case 8:
                        results.currId = 3;
                        break;
                    default:
                        break;
                }
            } else {
                // 下一阶段，status逻辑未完成
                results.stageId = 2;
                results.currId = 2;
            }
        } else {
            console.log("你个糟老头子坏得很，居然不是我的课题！");
            results.stageId = 0;
            if (r[0]['sel'] == -1) {
                results.currId = 1;
            } else {
                results.currId = 0;
            }
        }
        result.push(results);
        console.log(result);
        res.status(200).json({ code: 200, data: result, msg: '成功获取阶段状态' });
    })
})

// 获取最近答辩信息
// params: { uid: str }
router.post('/getQuestionInfo', async(req, res) => {
    let sql =  `CALL PROC_GET_OPEN_QUESTION_INFO(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql, params, res, (r) => {
        var i = 1;
        var result = [];
        try {
            r.forEach(element => {
                element.order = i;
                i++;
                if (element.sid == params.uid) {
                    console.log("------------------------------");
                    delete element.sid;
                    delete element.topic;
                    result.push(element);
                    throw new Error("EndForeach");
                }
                console.log(element);
            });
        } catch (error) {
            if (error.message != "EndForeach") {
                throw error;
            }
        }
        console.log(result);
        if (result.length > 0) {
            switch (result[0]['week']) {
                case '0':
                    result[0].week = '星期天';
                    break;
                case '1':
                    result[0].week = '星期一';
                    break;
                case '2':
                    result[0].week = '星期二';
                    break;
                case '3':
                    result[0].week = '星期三';
                    break;
                case '4':
                    result[0].week = '星期四';
                    break;
                case '5':
                    result[0].week = '星期五';
                    break;
                case '6':
                    result[0].week = '星期六';
                    break;
                default:
                    break;
            }
        }
        console.log(result);
        res.status(200).json({ code: 200, data: result, msg: '成功获取开题答辩信息' });
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

// 增加指导日志
// params: { pid: int, time: date, way: str, opinion: str }
router.post('/insertGuidance', async(req, res) => {
    let sql = `CALL PROC_INSERT_GUIDANCE(?)`;
    let params = req.body;
    console.log(params);
    callProc_N(sql, params, 2, res, (r) => {
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '成功插入指导日志' });
    })
})

// 修改指导日志
// params: { id: int, time: date, way: str, opinion: str }
router.post('/updateGuidance', async(req, res) => {
    let sql = `CALL PROC_UPDATE_GUIDANCE(?)`;
    let params = req.body;
    console.log(params);
    callProc_N(sql, params, 2, res, (r) => {
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '成功修改指导日志' });
    })
})

// 删除指导日志
// params: { id: int }
router.post('/delGuidance', async(req, res) => {
    let sql = `CALL PROC_DELETE_GUIDANCE(?)`;
    let params = req.body;
    console.log(params);
    callProc_N(sql, params, 2, res, (r) => {
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '成功删除指导日志' });
    })
})

// 插入延缓答辩申请
// params: { uid: str, reason: str, type: int }
// type: 1  开题延缓；2  论文延缓
router.post('/insertDeferApplication', async(req, res) => {
    let sql = `CALL PROC_INSERT_DEFER_APPLICATION(?)`;
    let params = req.body;
    console.log(params);
    callProc_N(sql, params, 2, res, (r) => {
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '成功插入延缓答辩申请' });
    })
})

// 查询延缓答辩申请当前的阶段
// params: { sid: str, type: int }
router.post('/getDeferAppliStatus', async(req, res) => {
    let sql = `CALL PROC_GET_DEFER_APPLI_STATUS(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql, params, res, (r) => {
        if (r.length != 0) {
            if (r[0]['teaOpi'] == null) {
                r[0].index = 0;
            } else if (r[0]['teaOpi'] != null && r[0]['manOpi'] == null) {
                r[0].index = 1;
            } else {
                r[0].index = 2;
            }
        }
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '成功查询延缓答辩申请当前状态' });
    })
})

// 判断当前能否进行延缓申请
// params: { uid: str }
// 等一个数据库调整
router.post('/getIfCanDefAppli', async(req, res) => {
    let sql = `CALL PROC_GET_CAN_DEF_APPLI(?)`;
    let params = req.body;
    console.log(params);
    console.log("--------------------");
    callProc(sql, params, res, (r) => {
        console.log(r);
        console.log(r[0]['status']);
        var result = [];
        if (r.length == 0) {
            result = [{ 'flag': false, type: 0 }];
        } else {
            if (r[0]['status'] >= 6 && r[0]['status'] < 8) {
                // 开题答辩延期
                result = [{ 'flag': true, 'type': 1 }];
            } else if (r[0]['status'] > 20) {
                // 论文答辩延期
                // 等topic表status备注，暂时瞎写
                result = [{ 'flag': true, 'type': 2 }];
            } else {
                // 什么延期都不是
                result = [{ 'flag': false }];
            }
        }
        res.status(200).json({ code: 200, data: result, msg: '成功查询当前能否进行延缓申请' });
    })
})

// 获取终期导师评分与终期评阅评分
// params: { uid: str}
router.post('/getFinalScores', async(req, res) => {
    let sql = `CALL PROC_GET_FINAL_SCORES(?)`;
    let params = req.body;
    console.log(params);
    callProc(sql, params, res, (r) => {
        console.log(r);
        res.status(200).json({ code: 200, data: r, msg: '成功获取终期导师评分与终期评阅评分' });
    })
})

module.exports = router;