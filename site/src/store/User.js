import BaseActions from '../component/BaseActions'
import { observable, action } from 'mobx'
import * as urls from '../constant/urls'



class User extends BaseActions {
  @observable
  // usr = {
  //   name: '张三',
  //   uid: '201821020704',
  //   dep: '杭州国际服务工程学院',
  //   maj: '计算机科学与技术',
  //   cls: '计算机183',
  //   role: 1    // 0: teacher 1:student 2: manage
  // }

  usr = {
    name:'专业负责人',
    role:2    // 0: teacher 1:student 2: manage
  }

  @action
  async getProjList() {
    return await this.get(urls.API_SYS_GET_PROJLIST, null)
  }

  @action
  async downloadFile(params) {
    return await this.post(urls.API_SYS_DOWN_FILE, params)
  }

}

export default new User()