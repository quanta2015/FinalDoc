import BaseActions from '../component/BaseActions'
import { observable, action, runInAction } from 'mobx'
import * as urls from '../constant/urls'

class Student extends BaseActions {
    @observable
    // topInfo = {}
    topInfo = {
        teaName: '张三',
        topicName: '基于快速区域卷积神经网络胰腺癌增强CT自动识别系统的建立及临床测试'
    }

    @action
    async getTopInfo(id) {
        const r = await this.get(urls.API_SYS_GET_STUINFO, id);
        if (r && r.status === 200) {
            runInAction(() => {
                this.topInfo = r.data.data
            })
        }
        return r;
    }

}

export default new Student()