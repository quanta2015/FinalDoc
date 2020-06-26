import BaseActions from '../component/BaseActions'
import { observable, action } from 'mobx'
import * as urls from '../constant/urls'



class User extends BaseActions {
  @observable
  usr = {
<<<<<<< HEAD:src/store/User.js
    id: '11111',
=======
    name: '学生',
    uid: '2018212213466',
    dep: '杭州国际服务工程学院',
    maj: '计算机科学与技术',
    cls: '计算机183',
>>>>>>> e3299e93aaef18a5451d97c80b991f38106b28b1:site/src/store/User.js
    role: 1    // 0: teacher 1:student 2: manage
  }

  @action
  async getProjList() {
    return await this.get(urls.API_SYS_GET_PROJLIST,null)
  }

}

export default new User()