import BaseActions from '../component/BaseActions'
import { observable, action, runInAction, toJS } from 'mobx'
import * as urls from '../constant/urls'
import { message } from 'antd'

class Student extends BaseActions {
    @observable
    topInfo = {}

    @observable
    topicList = {}

    @action
    async getTopInfo(params) {
        const r = await this.post(urls.API_SYS_GET_STUINFO, params);
        if (r && r.code === 200) {
            runInAction(() => {
                this.topInfo = r.data[0]
            })
        } else {
            // message.error("网络错误")
        }
        return r;
    }

    @action
    async getTopicList() {
        const r = await this.post(urls.API_SYS_GET_TTLLIST, null);
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
        const r = await this.post(urls.API_SYS_FIND_ISDURAUDIT, params);
        if (r && r.code === 200) {
            return r.data
        } else {
            // message.error('网络错误111')
        }
        return r;
    }


    @action
    async upStuTopicList(params) {
        const r = await this.post(urls.API_SYS_UPDATE_TTLLIST, params);
        if (r && r.code === 200) {
            runInAction(() => {
                message.success('选择成功')
            })
            return r.data
        } else {
            // message.error('网络错误')
        }
        return r;
    }

    @action
    async delStuTopicList(params) {
        const r = await this.post(urls.API_SYS_DELETE_TTLLIST, params);
        if (r && r.code === 200) {
            runInAction(() => {
                message.success('取消成功')
            })
        } else {
            // message.error('网路错误');
        }
        return r;
    }

    @action
    setTopicList(TopicList) {
        this.TopicList = TopicList
    }

}

export default new Student()