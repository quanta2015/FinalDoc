import BaseActions from '../component/BaseActions'
import { observable, action, runInAction, toJS } from 'mobx'
import * as urls from '../constant/urls'
import { message } from 'antd'

class Student extends BaseActions {
    @observable
    //用户选择过的所有课题记录
    topInfo = {}

    @observable
    //用户可选的课题列表
    topicList = {}

    @observable
    //双选成功的课题信息
    selectTpInfo = {}

    @observable
    //时间轴内容
    timeList = []

    @observable
    //模板文件
    docTemplate = []

    @observable
    //开题答辩成绩
    opScore = []

    @observable
    //当前阶段（时间轴）
    currState = {}

    @observable
    //指导日志
    insLog = []

    @observable
    // 答辩信息
    replyList = []

    @observable
    // 延缓答辩申请进度
    derApplication = {}

    @observable
    //终期导师评分与终期评阅评分
    fdScore = []

    @action
    initStuStore() {
        runInAction(() => {
            this.topInfo = {};
            this.topicList = {};
            this.selectTpInfo = {};
            this.timeList = [];
            this.docTemplate = [];
            this.opScore = [];
            this.currState = {};
            this.insLog = [];
            this.replyList = [];
            this.derApplication = {};
            this.fdScore = [];
        })
    }

    @action
    async getTopInfo(params) {
        const r = await this.post(urls.API_STU_GET_TOPINFO, params);
        if (r && r.code === 200) {
            runInAction(() => {
                this.topInfo = r.data
            })
        } else {
            message.error("网络错误")
        }
        return r;
    }

    @action
    async getTopicList(params) {
        const r = await this.post(urls.API_STU_GET_TTLLIST, params);
        if (r && r.code === 200 && r.data) {
            let list = []

            if (r.data) {
                r.data.map((item) => {
                    let areas = []
                    let color = []
                    let area_list = item.area_list.split(",")
                    area_list.map((elem) => {
                        let e = elem.split("|")
                        if (!areas.includes(e[1])) {
                            areas.push(e[1])
                        }
                        if (!color.includes(e[2])) {
                            color.push(e[2])
                        }

                    })

                    list.push({
                        key: item.key, id: item.id, tid: item.tid, instructor: item.instructor, topic: item.topic, content: item.content,
                        phone: item.phone, status: item.status, status_: item.status_, category: item.category, sid: item.sid,
                        areas: areas,
                        color: color
                    })
                })

            }

            runInAction(() => {
                this.topicList = list

            })
            return list

        } else {
            // message.error("网络错误")
        }
        return r;
    }

    // 学生选课审核中 status 2
    @action
    async isDurAudit(params) {
        const r = await this.post(urls.API_STU_FIND_ISDURAUDIT, params);
        if (r && r.code === 200) {
            let list = []
            if (r.data) {
                r.data.map((item) => {
                    let areas = []
                    let color = []
                    let area_list = item.area_list.split(",")
                    area_list.map((elem) => {
                        let e = elem.split("|")
                        if (!areas.includes(e[1])) {
                            areas.push(e[1])
                        }
                        if (!color.includes(e[2])) {
                            color.push(e[2])
                        }
                    })

                    list.push({
                        key: item.key, id: item.id, instructor: item.instructor, topic: item.topic, content: item.content,
                        phone: item.phone, status: item.status, status_: item.status_, category: item.category, sid: item.sid,
                        areas: areas,
                        color: color
                    })
                })
            }
            runInAction(() => {
                // this.topicList = r.data
                this.topicList = list
            })
            return list
            // return r.data

        } else {
            message.error('网络错误')
        }
        return r;
    }


    @action
    async upStuTopicList(params) {
        const r = await this.post(urls.API_STU_UPDATE_TTLLIST, params);
        if (r && r.code === 200) {
            runInAction(() => {
                message.success('选择成功')
            })
            return r.data
        } else {
            message.error('网络错误')
        }
        return r;
    }

    @action
    async delStuTopicList(params) {
        const r = await this.post(urls.API_STU_DELETE_TTLLIST, params);
        if (r && r.code === 200) {
            runInAction(() => {
                message.info('已取消')
            })
        } else {
            message.error('网络错误');
        }
        return r;
    }

    @action
    setTopicList(TopicList) {
        this.TopicList = TopicList
    }

    @action
    async getSelectTopic(params) {
        const r = await this.post(urls.API_STU_GET_STPINFO, params);
        if (r && r.code === 200 && r.data) {
            runInAction(() => {
                this.selectTpInfo = r.data[0]
            })
        } else {
            // message.error("网络错误")
        }
        return r.data;
    }

    @action
    async deleteFile(params) {
        return await this.post(urls.API_STU_DEL_FILE, params)
    }

    @action
    async getGuidance(params) {
        const r = await this.post(urls.API_STU_GET_GUIDANCE, params)
        if (r && r.code === 200 && r.data) {
            // let lst = []
            // if (r.data) {
            //     r.data.map((item) => {
            //         let date = item.time.split("-")
            //         let time = date[0] + '年' + date[1] + '月' + date[2] + '日'
            //         lst.push({
            //             time,
            //             way: item.way,
            //             opinion: item.opinion
            //         })
            //     })
            // }
            runInAction(() => {
                this.insLog = r.data
            })
            return r.data
        } else {
            message.error("网络错误")
        }
        return r
    }

    @action
    async getAllStates(params) {
        const r = await this.post(urls.API_STU_GET_ALLSTATES, params)
        if (r && r.code === 200) {
            let lst = []
            if (r.data) {
                r.data.map((item, index) => {
                    if (item.state_name === "任务书") {
                        lst.push({
                            state: index,
                            title: item.state_name,
                            time: item.state_end,
                            type: 'f_task'
                        })
                    } else if (item.state_name === "成绩审定") {
                        lst.push({
                            state: index,
                            title: item.state_name,
                            time: item.state_end,
                            type: 'f_score_check'
                        })
                    } else {
                        lst.push({
                            state: index,
                            title: item.state_name,
                            time: item.state_end,
                        })
                    }
                })
            }
            runInAction(() => {
                this.timeList = lst
            })
            return lst
        } else {
            // message.error('网络错误')
        }
        return r
    }

    @action
    async getCurrentState(params) {
        const r = await this.post(urls.API_STU_GET_CURSTATE, params)
        if (r && r.code === 200) {
            runInAction(() => {
                this.currState = r.data
            })
            return r.data
        } else {
            // message.error('网络错误')
        }
        return r
    }

    @action
    async getTempFileList() {
        const r = await this.post(urls.API_STU_GET_TEMP_FILE, null);
        if (r && r.code === 200) {
            runInAction(() => {
                this.docTemplate = r.data;
            })
        } else {
            message.error('网络错误')
        }
        return r
    }

    @action
    async getOpenScore(params) {
        const r = await this.post(urls.API_STU_GET_OPSCORE, params)
        if (r && r.code === 200) {
            runInAction(() => {
                this.opScore = r.data
            })
        } else {
            message.error('网络错误')
        }
    }

    @action
    async getReplyInfo(params) {
        const r = await this.post(urls.API_STU_GET_REPLY_INFO, params);
        if (r && r.code === 200) {
            runInAction(() => {
                this.replyList = r.data;
            })
        } else {
            message.error('网络错误')
        }
        return r
    }

    @action
    async insertGuidance(params) {
        const r = await this.post(urls.API_STU_ADD_GUIDANCE, params)
        if (r && r.code === 200) {
            return true
        } else {
            message.error('网络错误');
        }
        return r;
    }

    @action
    async delGuidance(params) {
        const r = await this.post(urls.API_STU_DEL_GUIDANCE, params)
        if (r && r.code === 200) {
            return true
        } else {
            message.error('网络错误');
        }
        return r;
    }

    @action
    async updateGuidance(params) {
        const r = await this.post(urls.API_STU_EDIT_GUIDANCE, params)
        if (r && r.code === 200) {
            return true
        } else {
            message.error('网络错误');
        }
        return r;
    }

    @action
    async getNavStage(params) {
        return await this.post(urls.API_STU_GET_NAV_STAGE, params);
    }

    @action
    async insertDeferApl(params) {
        return await this.post(urls.API_STU_SUBMIT_DEFER, params)
    }

    @action
    async getShowDefer(params) {
        const r = await this.post(urls.API_STU_GET_DEFER_SHOW, params);
        return r.data
    }

    @action
    async getDeferAppliProgs(params) {
        const r = await this.post(urls.API_STU_GET_DEFER_PRG, params);
        let data = {}
        if (r.data.length) {
            data = r.data[0]
            data.data = [data.reason, data.teaOpi]
        }
        runInAction(() => {
            this.derApplication = data
        })
        return r.data
    }

    @action
    async getFinalScores(params) {
        const r = await this.post(urls.API_STU_GET_FDSCORE, params)
        if (r && r.code === 200) {
            runInAction(() => {
                this.fdScore = r.data
            })
        } else {
            message.error('网络错误')
        }
    }

}

export default new Student()