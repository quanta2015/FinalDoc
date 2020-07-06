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
        { title: '开题中期', status: 0, infoList: [{ time: '2020-9-11', content: '开始选题' }, { time: '2020-11-22', content: '选题工作结束' }, { time: '2020-12-7', content: '中期检查表上交截止' }]},
        { title: '论文审核', status: 0, infoList: [{ time: '2020-12-28', content: '论文初稿提交' }]},
        { title: '论文答辩', status: 0, infoList: [{ time: '2021-4-10', content: '一次答辩' }, { time: '2021-5-2', content: '二次答辩' }] }
    ]

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
            // message.error("网络错误")
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