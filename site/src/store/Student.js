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
    async getTopicList() {
        const r = await this.post(urls.API_STU_GET_TTLLIST, null);
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