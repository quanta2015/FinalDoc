import BaseActions from '../component/BaseActions'
import { observable, action, runInAction } from 'mobx'
import * as urls from '../constant/urls'

class Student extends BaseActions {
    @observable
    usr = {
        name: '学生',
        uid: '2018212213466',
        collage: '杭州国际服务工程学院',
        class: '计算机183',
        isSelected: false,
        teaName: '张三',
        topicName: '基于快速区域卷积神经网络胰腺癌增强CT自动识别系统的建立及临床测试',
        role: 1    // 0: teacher 1:student 2: manage
    }

    @action
    async getStuInfo() {
        const r = await this.get(urls.API_SYS_GET_STUINFO, null);
        if (r && r.status === 200) {
            runInAction(() => {
                this.usr = r.data.data
            })
        }
        return r;
    }

}

export default new Student()