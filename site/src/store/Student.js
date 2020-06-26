import BaseActions from '../component/BaseActions'
import { observable, action, runInAction } from 'mobx'
import * as urls from '../constant/urls'
import { message } from 'antd'

class Student extends BaseActions {
    @observable
    topInfo = {}

    @action
    async getTopInfo(params) {
        const r = await this.post(urls.API_SYS_GET_STUINFO, params);
        if (r && r.code === 200) {
            runInAction(() => {
                this.topInfo = r.data[0]
            })
        } else {
            message.error("网络错误")
        }
        return r;
    }

}

export default new Student()