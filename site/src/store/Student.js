import BaseActions from '../component/BaseActions'
import { observable, action, runInAction ,toJS} from 'mobx'
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
        const r = await this.post(urls.API_SYS_GET_TOPINFO, params);
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
        const r = await this.post(urls.API_SYS_GET_TTLLIST, null);
        if (r && r.code === 200) {
            runInAction(() => {
                this.topicList = r.data
            })
            return r.data
        }else{
            message.error("网络错误")
        }
        return r;
    }

    @action
    async getSelectTopic(params) {
        const r = await this.post(urls.API_SYS_GET_STPINFO, params);
        if (r && r.code === 200) {
            runInAction(() => {
                this.selectTpInfo = r.data[0]
            })
            return r.data
        } else {
            message.error("网络错误")
        }
        return r;
    }

}

export default new Student()