import BaseActions from '../component/BaseActions'
import { observable, action } from 'mobx'
import * as urls from '../constant/urls'



class User extends BaseActions {

  @observable
  usr = {
<<<<<<< HEAD
    name:'专业负责人',
    uid:'20130006',
    role:2    // 0: teacher 1:student 2: manage
=======
    name:'沈珊瑚',
    uid: '20130006',
    maj: '物联网软工系',
    role:2,    // 0: teacher 1:student 2: manage
>>>>>>> 4c5bfdfd10d5d80a5592ca2ff98f11f4a3880867
  }

  @action
  async getProjList() {
    return await this.get(urls.API_SYS_GET_PROJLIST,null)
  }
}

export default new User()