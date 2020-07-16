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
    timeList = [
        { title: '任务书', type: 'f_task', time: '2020-10-08' },
        { title: '开题中期', time: '2020-12-12' },
        { title: '论文审核', time: '2020-12-28' },
        { title: '论文答辩', time: '2021-04-08' },
        { title: '成绩审定', type: 'f_score_check', time: '2021-05-02' }
    ]

    @observable
    //模板文件
    docTemplate = [{
        name: '开题中期',
        file: [
            { title: '开题报告', link: '' },
            { title: '外文文献翻译', link: '' },
            { title: '文献综述', link: '' },
            { title: '中期检查表', link: '' },
        ]},{
        name: '论文定稿',
        file: [
            { title: '论文格式', link: '' },
            { title: '作品说明书', link: '' },
            { title: '诚信承诺书', link: '' },
        ]},{
        name: '论文答辩',
        file: [
            { title: '评审答辩成绩表', link: '' },
            { title: '延缓答辩申请表', link: '' }
        ]} 
    ]

    @observable
    //开题答辩成绩
    opScore = [
        { score: 83, type: 'op_ins_score' },
        { score: 80, type: 'op_grp_score' }
    ]

    @observable
    //当前所处阶段细分
    currStage = {
        name: '选题阶段',
        index: 1,
        stage: ['发布课题', '选择课题', '双选成功']
    }

    @observable
    //指导日志
    insLog = []

    @observable
    //通知列表 index 未读通知所处位置
    noticeList = {index: null, data: []}

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
            // return r.data
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
        if (r && r.code === 200) {
            let lst = []
            if (r.data) {
                r.data.map((item) => {
                    let date = item.time.split("-")
                    let time = date[0] + '年' + date[1] + '月' + date[2] + '日'
                    lst.push({
                        time,
                        way: item.way,
                        opinion: item.opinion
                    })
                })
            }
            runInAction(() => {
                this.insLog = lst
            })
            return lst
        } else {
            message.error("网络错误")
        }
        return r
    }

    @action
    // r.data: [[{已读公告1},{}...],[{未读公告1},{}...]]
    async getNoticeList(params){
        const r = await this.post(urls.API_STU_GET_NOTICE, params);
        if (r && r.code === 200 && r.data) {
            let unreadIndex = r.data[1].length - 1;
            runInAction(() => {
                this.noticeList.index = unreadIndex; 
                this.noticeList.data = [...r.data[1], ...r.data[0]]; 
            })
            return (r.data[1].length + r.data[0].length)
        } else {
            // message.error("网络错误")
        }
    }

    @action 
    async readNotice(params){
        const r = await this.post(urls.API_STU_READ_NOTICE, params);
        if (r && r.code === 200){
            return true;
        }
    }
}

export default new Student()