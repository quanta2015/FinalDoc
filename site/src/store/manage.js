import BaseActions from '../component/BaseActions'
import { observable, action, runInAction } from 'mobx'
import * as urls from '../constant/urls'

class manager extends BaseActions {

  // @observable
  // usr = {
  //   name: '专业负责人',
  //   role: 2    // 0: teacher 1:student 2: manage
  // }

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
    //查看是否已经发布课题
    judge_info:[],
  }


  @action
  // 参数，系主任id
  // {"ide":"20130006"}
  async getTeaList(param) {
    const res = await this.post(urls.API_MAN_GET_TEALIST, param);
    let teaName = [];
    res.data.map((item) =>{
      let areas = ""
      item.area_list.split(",").map((item)=> {
        areas += item.split("|")[1] + " "
      })
      teaName.push({ 
        tid: item.uid + " " + item.maj + "-" + item.Tname + "-" + item.areas, 
        value: item.maj + "-" + item.Tname + "-" + areas,
        name: item.Tname,
      })
    })
    
    teaName.sort(function (a, b) {
      if (a.value < b.value) {
        return 1;
      } else if (a.value > b.value) {
        return -1;
      }
      return 0;
    })

    runInAction(() => {
      this.distributeTopic.teacher_info = teaName;
    })
  }

  @action
  // 参数，系主任id
  // {"ide":"20130006"}
  async getTopicList(param) {
    const res = await this.post(urls.API_MAN_GET_TOPICLIST, param);
    let topicList = [];
    res.data.map((item)=> {
      let temp = item.area_list.split(",")
      let color = []
      let areas = []
      temp.map((item)=>{
        item.split("|")
        areas.push(item.split("|")[1])
        color.push(item.split("|")[2])
      })
      topicList.push({
        key: item.key, tid: item.tid, tName: item.name, topic: item.topic, content: item.content,
        areas: areas,
        color: color,
      })
    })
    // res.data.map((item) =>
    //   topicList.push({
    //     key: item.key, tid: item.tid, tName: item.tName, topic: item.topic, content: item.content,
    //     areas: item.areas.split(","),
    //     color: item.color.split(",")
    //   })
    // )
    runInAction(() => {
      this.distributeTopic.topic_info = topicList;
    })
  }

  // 手动分配审核选题
  // { "teacher_id": "20130006", "topic_id": ["1","2","3"] }
  @action
  async allocateTopic(param) {
    return await this.post(urls.API_MAN_POST_ALLOCATETOPIC, param)
  }

  // 自动分配审核选题
  // {"ide":"20130006","number":5,"teacher_id":["20130006","20181025"]}
  @action
  async autoAllocateTopic(param) {
    return await this.post(urls.API_MAN_POST_AUTOALLOCATETOPIC, param)
  }

  @action
  // 参数，系主任id
  // {"ide":"20130006"}
  async getCheckList(param) {
    let res = await this.post(urls.API_MAN_POST_CHECKLIST, param);
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
  // 参数，系主任id
  // {"ide":"20130006"}
  async getAuditCount(param) {
    let res = await this.post(urls.API_MAN_POST_AUDITCOUNT, param);
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

  @action
  async getRelease(param) {
    return await this.post(urls.API_MAN_POST_RELEASE, param);  
  }

  @action
  async getJudge(param) {
    const res = await this.post(urls.API_MAN_POST_JUDGETOPIC, param);
    runInAction(() => {
      this.distributeTopic.judge_info = res.data[0];
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
  // 参数，系主任id
  // {"ide":"20130006"}
  async getTopicList_ogp(param) {
    const res = await this.post(urls.API_MAN_POST_OGP_TOPICLIST, param);
    let topic = []
    // 同一老师课题放一起，按未通过、通过、未审核排序
    res.data.map((item) =>
      topic.push({
        key: item.key,
        sName: item.sName,
        topic: item.topic,
        content: item.content,
        tName: item.name,
        classname: item.sMaj + item.class,
      })
    )
    runInAction(() => {
      this.openDefenseGroup.topic_info = topic;
    })

  }

  @action
  // 参数，系主任id
  // {"ide":"20130006"}
  async getTeacherList_ogp(param) {
    const res = await this.post(urls.API_MAN_POST_OGP_TEACHERLIST, param);
    let teacher = []
    res.data.map((item) =>{
      let areas = ""
      item.area_list.split(",").map((item)=> {
        areas += item.split("|")[1] + " "
      })
      teacher.push({ 
        tid: item.uid + " " + item.maj + "-" + item.Tname + "-" + item.areas, 
        value: item.maj + "-" + item.Tname + "-" + areas,
        name: item.Tname,
      })
    })
    // 同一老师课题放一起，按未通过、通过、未审核排序
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

  // 自动分配答辩课题
  // {"ide":"20130006","leader_id":"20140008","teacher_id":["20140022","20150046","20170067"],"number":5}
  @action
  async autoAllocateTopic_ogp(param) {
    return await this.post(urls.API_MAN_POST_OGP_AUTOALLOCATETOPIC, param)
  }

  // 手动分配答辩课题
  // {"leader_id":"20170056","teacher_id":["20020070","20021092","20020782","20021105"],"topic_id":[3,4,5,6,7]}
  @action
  async manualAllocateTopic_ogp(param) {
    return await this.post(urls.API_MAN_POST_OGP_MANUALALLOCATETOPIC, param)
  }

  @action
  // 开题答辩小组的信息
  // 参数，系主任id
  // {"ide":"20130006"}
  async getGroupList_ogp(param) {
    const res = await this.post(urls.API_MAN_POST_OGP_GROUPLIST, param);
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
  // {"group_id":int}
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
  // {"gid":int}
  @action
  async deleteGroup_ogp(param) {
    return await this.post(urls.API_MAN_POST_OGP_DELETEGROUP, param)
  }

  @observable
  stu_list =[]

 
 


  // 查看该系全体学生的论文进度
  // {"gid":int}
  @action
  async viewProgress(param){
    let res = await this.post(urls.API_MAN_POST_VIEWPROGRESS, param)
    let temp = []
    res.data.map((item,i)=>{
      let status = item.status
      let phase = ""
      let tag = ""
      if(status>=-1 && status<=3){
        phase = "选题阶段"
        if(status===3){
          // 学生已选题
          tag = "已选题"
        }else if(status===0){
          // 老师出题时选定学生，但该课题未审核
          tag = "待审核"
        }else{
          // 学生未选题
          tag = "未选题"
        }
      }else if(status===4 || status===-4){
        phase = "开题答辩"
        if(status===4){
          // 通过开题答辩
          tag = "已通过"
        }else if(status===-4){
          // 未通过开题答辩
          tag = "未通过"
        }
      }else if(status===-5 || status===5 || status===-6 || status===6){
        phase = "论文定稿"
        if(status===5 || status===6){
          // 5教师通过,6系主任通过
          tag = "已通过"
        }else if(status===-5 || status===-6){
          // 5教师未通过,6系主任未通过
          tag = "未通过"
        }
      }else if(status===7 || status===-7){
        phase = "论文答辩"
        if(status===7){
          // 通过论文答辩
          tag = "已通过"
        }else if(status===-7){
          // 未通过论文答辩
          tag = "未通过"
        }
      }else if(status===-8 || status===8 || status===-9 || status===9){
        phase = "最终审核"
        if(status===8 || status===9){
          // 8教师通过,9系主任通过
          tag = "已通过"
        }else if(status===-8 || status===-9){
          // -8教师未通过,-9系主任未通过
          tag = "未通过"
        }
      }
      temp.push({
        sName: item.sName,
        class: item.cls,
        topic: item.topic,
        tName: item.tName,
        pid: item.pid,
        phase: phase,
        status: tag,
      })
    })
    runInAction(() => {
      this.stu_list = temp;
    })
  }


  @observable
  reviewPaper = {
    // 教师列表
    task_info: [],
     
  }

  @action
  // 参数，系主任id
  // {"ide":"20130006"}
  async getTaskList(param) {
    const res = await this.post(urls.API_MAN_POST_RP_TASKLIST, param);
    let temp = []
    res.data.map((item, i) => {
      temp.push({
        name: item.name,
        topic: item.topic,
        key: item.key,

      
      })
    })
     
    // 同一老师课题放一起，按未通过、通过、未审核排序

    runInAction(() => {
      this.reviewPaper.task_info = temp;
    })

  }

  // 查看某位学生上传的文件
  // {"topic_id":int}
  @action
  async viewFiles(param){
    let res = await this.post(urls.API_MAN_POST_VIEWFILES, param)
    return res.data
  }
}
export default new manager()