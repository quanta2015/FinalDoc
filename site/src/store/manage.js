import BaseActions from '../component/BaseActions'
import { observable, action } from 'mobx'
import * as urls from '../constant/urls'



class manager extends BaseActions {

  @observable
  usr = {
    name:'专业负责人',
    role:2    // 0: teacher 1:student 2: manage
  }

  @action
  async getTeaList() {
    return await this.post(urls.API_MAN_GET_TEALIST,null)
  }
  @action
  async getTopicList() {
    return await this.post(urls.API_MAN_GET_TOPICLIST,null)
  }
  @action
  async allocateTopic(param) {
    return await this.post(urls.API_MAN_POST_ALLOCATETOPIC,param)
  }

  @action
  async getCheckList() {
    return await this.post(urls.API_MAN_POST_CHECKLIST, null)
  }

}

export default new manager()