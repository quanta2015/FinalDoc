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

  // 分配答辩小组
  @observable
  openDefenseGroup = {
    // 教师列表
    teacher_info: [],
    // 未分配课题列表
    topic_info: [],
    // 开题分组信息
    group_list: [],
  }

  @action
  async getTopicList_ogp() {
    const res = await this.post(urls.API_MAN_POST_OGP_TOPICLIST, null);
    let topic = []
    // 同一老师课题放一起，按未通过、通过、未审核排序
    res.data.map((item) =>
      topic.push({
        key: item.key,
        sName: item.sName,
        topic: item.topic,
        content: item.content,
        tName: item.tName,
        classname: item.sMaj + item.class,
      })
    )
    runInAction(() => {
      this.openDefenseGroup.topic_info = topic;
    })

  }

  @action
  async getTeacherList_ogp() {
    const res = await this.post(urls.API_MAN_POST_OGP_TEACHERLIST, null);
    let teacher = []
    // 同一老师课题放一起，按未通过、通过、未审核排序
    res.data.map((item) =>
      teacher.push({
        tid: item.uid + " " + item.maj + "-" + item.Tname + "-" + item.areas,
        name: item.Tname,
        value: item.maj + "-" + item.Tname + "-" + item.areas
      })
    )
    teacher.sort(function (a, b) {
      if (a.value === b.value) {
        return 0;
      }
      else if (a.value < b.value) {
        return 1;
      }
      else {
        return -1;
      }
    })
    runInAction(() => {
      this.openDefenseGroup.teacher_info = teacher;
    })
  }
  // 自动分配审核选题
  @action
  async autoAllocateTopic_ogp(param) {
    return await this.post(urls.API_MAN_POST_OGP_AUTOALLOCATETOPIC, param)
  }

  // 手动分配审核选题
  @action
  async manualAllocateTopic_ogp(param) {
    return await this.post(urls.API_MAN_POST_OGP_MANUALALLOCATETOPIC, param)
  }

  @action
  async getGroupList_ogp() {
    const res = await this.post(urls.API_MAN_POST_OGP_GROUPLIST, null);
    let group = [];
    res.data.map((item, i) => {
      group.push({
        id: i + 1,
        gid: item.gid,
        leader: item.leader,
        members: item.names,
      })
    })
    runInAction(() => {
      this.openDefenseGroup.group_list = group;
    })
  }

  // 组内课题详情
  // {group_id:int}
  @action
  async topicDetailList_ogp(param) {
    let res = await this.post(urls.API_MAN_POST_OGP_TDETAILLIST, param)
    let temp = []
    res.data.map((item, i) => {
      temp.push({
        topic: item.topic,
        class: item.maj + item.cls,
        sName: item.sName,
        tName: item.tName,
      })
    })
    return temp;
  }

  // 删除某个分组
  @action
  async deleteGroup_ogp(param) {
    return await this.post(urls.API_MAN_POST_OGP_DELETEGROUP, param)
  }




}

export default new manager()