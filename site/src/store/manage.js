import BaseActions from '../component/BaseActions'
import { observable, action, runInAction } from 'mobx'
import * as urls from '../constant/urls'



class manager extends BaseActions {

  @observable
  usr = {
    name: '专业负责人',
    role: 2    // 0: teacher 1:student 2: manage
  }

  // 分配审核课题
  @observable
  distributeTopic = {
    // 教师列表
    teacher_info: [],
    // 未分配课题列表
    topic_info: [],
    // 已分配课题列表
    checklist_info: [],
    // 领域列表
    areas_list: [],
    // 已分配情况数量,unAudit未分配,unPassed未通过,Passed已通过
    auditCount: {},
  }

  @action
  async getTeaList() {
    const res = await this.post(urls.API_MAN_GET_TEALIST, null);
    runInAction(() => {
      this.distributeTopic.teacher_info = res.data;
    })
  }

  @action
  async getTopicList() {
    const res = await this.post(urls.API_MAN_GET_TOPICLIST, null);
    runInAction(() => {
      this.distributeTopic.topic_info = res.data;
    })
  }

  // 手动分配审核选题
  @action
  async allocateTopic(param) {
    return await this.post(urls.API_MAN_POST_ALLOCATETOPIC, param)
  }

  // 自动分配审核选题
  @action
  async autoAllocateTopic(param) {
    return await this.post(urls.API_MAN_POST_AUTOALLOCATETOPIC, param)
  }

  @action
  async getCheckList() {
    let res = await this.post(urls.API_MAN_POST_CHECKLIST, null);
    let r = res.data
    // 同一老师课题放一起，按未通过、通过、未审核排序
    r.sort(function (a, b) {
      if (a.checkTeacher === b.checkTeacher) {
        if (a.result < b.result) {
          return -1;
        } else if (a.result > b.result) {
          return 1;
        }
        return 0;
      }
      else if (a.checkTeacher < b.checkTeacher) {
        return -1;
      }
      else {
        return 1;
      }
    })
    runInAction(() => {
      this.distributeTopic.checklist_info = r;
    })
  }

  @action
  async getAuditCount() {
    let res = await this.post(urls.API_MAN_POST_AUDITCOUNT, null);
    runInAction(() => {
      this.distributeTopic.auditCount = res.data[0];
    })
  }

  @action
  async getAreasList() {
    const res = await this.post(urls.API_MAN_POST_AREALIST, null);
    runInAction(() => {
      this.distributeTopic.areas_list = res.data;
    })
  }

}

export default new manager()