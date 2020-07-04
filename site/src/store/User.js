import BaseActions from '../component/BaseActions'
import { observable, action } from 'mobx'
import * as urls from '../constant/urls'



class User extends BaseActions {

  @observable
  usr = {
    name:'专业负责人',
    uid:'20130006',
    role:2    // 0: teacher 1:student 2: manage
  }

  @action
  async getProjList() {
    return await this.get(urls.API_SYS_GET_PROJLIST,null)
  }
}

export default new User()