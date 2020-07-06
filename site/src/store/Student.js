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
        { title: '任务书', time: '2020年10月08日', status: 1, info: '' },
        { title: '开题中期', time: '2020年12月12日', status: 3, grade: 0, info: [{ name: '开题报告', grade: 90 }, { name: '外文翻译', grade: 95 }, { name: '文献综述', grade: 85 }] },
        { title: '论文审核', time: '2020年12月28日', status: 1, grade: 0, info: [{ name: '论文定稿', grade: 0 }, { name: '设计作品', grade: 0 }, { name: '作品说明书', grade: 0 }] },
        { title: '论文答辩', time: '2021年04月08日', status: 0, grade: 0, info: [{ name: '导师评分', grade: 0 }, { name: '评阅评分', grade: 0 }, { name: '答辩评分', grade: 0 }] },
        { title: '成绩审定', time: '2021年05月02日', status: 0, info: ''}
    ]

    @observable
    //所处阶段
    currStage = 2

    @observable
    //模板文件
    docTemplate = [
        { title: '开题报告', link: ''},
        { title: '中期检查表', link: '' },
        { title: '外文文献翻译', link: '' }, 
        { title: '文献综述', link: '' },
        { title: '论文格式', link: '' },
        { title: '作品说明书', link: '' },
        { title: '诚信承诺书', link: '' },
        { title: '评审答辩成绩表', link: '' },
        { title: '延缓答辩申请表', link: '' }
    ]

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
            runInAction(() => {
                this.topicList = r.data
            })
            return r.data
        } else {
            message.error("网络错误")
        }
        return r;
    }

    // 学生选课审核中 status 2
    @action
    async isDurAudit(params) {
        const r = await this.post(urls.API_STU_FIND_ISDURAUDIT, params);
        if (r && r.code === 200) {
            return r.data
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
}

export default new Student()