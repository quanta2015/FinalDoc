import BaseActions from '../component/BaseActions'
import { observable, action, runInAction } from 'mobx'
import * as urls from '../constant/urls'



class manager extends BaseActions {

  @observable
  usr = {
    name:'专业负责人',
    role:2    // 0: teacher 1:student 2: manage
  }

  // 分配审核课题
  @observable
  distributeTopic = {
    teacher_info: [],
    topic_info: [],
    checklist_info:[],
    areas_list: [],
  }

  @action
  async getTeaList() {
    const res = await this.post(urls.API_MAN_GET_TEALIST,null);
    runInAction(()=>{
      this.distributeTopic.teacher_info = res.data;
    })
  }

  @action
  async getTopicList() {
    const res = await this.post(urls.API_MAN_GET_TOPICLIST,null);
    runInAction(()=>{
      this.distributeTopic.topic_info = res.data;
    })
  }

  @action
  async allocateTopic(param) {
    return await this.post(urls.API_MAN_POST_ALLOCATETOPIC,param)
  }

  @action
  async autoAllocateTopic(param) {
    return await this.post(urls.API_MAN_POST_AUTOALLOCATETOPIC,param)
  }

  @action
  async getCheckList() {
    return await this.post(urls.API_MAN_POST_CHECKLIST, null);
   
  }

  @action
  async getAuditCount() {
    return await this.post(urls.API_MAN_POST_AUDITCOUNT, null);
  }

  @action
  async getAreasList() {
    const res = await this.post(urls.API_MAN_POST_AREALIST,null);
    runInAction(()=>{
      this.distributeTopic.areas_list = res.data;
    })
  }

}

export default new manager()