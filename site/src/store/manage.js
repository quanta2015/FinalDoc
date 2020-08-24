import BaseActions from '../component/BaseActions'
import { observable, action, runInAction } from 'mobx'
import axios from 'axios'
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
    judge_info: [],
  }


  @action
  // 参数，系主任id
  // {"ide":"20130006","status":1/2}
  async getTeaList(param) {
    const res = await this.post(urls.API_MAN_GET_TEALIST, param);
    let teaName = [];
    res.data.map((item) => {
      let areas = ""
      item.area_list.split(",").map((item) => {
        areas += item.split("|")[1] + " "
      })
      // 给领域排序
      // areas.sort(function (a, b) {
      //   if (a < b) {
      //     return -1;
      //   } else if (a > b) {
      //     return 1;
      //   }
      //   return 0;
      // })
      /* ******* */
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
    res.data.map((item) => {
      let temp = item.area_list.split(",")
      let color = []
      let areas = []
      temp.map((item) => {
        item.split("|")
        areas.push(item.split("|")[1])
        color.push(item.split("|")[2])
      })
       areas.sort(function (a, b) {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        }
        return 0;
      })
      color.sort(function (a, b) {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        }
        return 0;
      })
      topicList.push({
        key: item.key, tid: item.tid, tName: item.name, topic: item.topic, content: item.content, type: item.type,
        areas: areas,
        color: color,
      })
    })
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
  // 参数，系主任id
  // {"ide":"20130006"}
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
      // 延期课题列表
      topicde_info: [],
    //自动分配十个课题
    sug_topic_id: [],
    // 开题分组信息
    group_list: [],
    //置空
      select_leader:undefined,
      select_member:[],
  }
  // 自动显示十个答辩课题
  // {"ide":"20130006","leader_id":"20140008","teacher_id":["20140022","20150046","20170067"],"number":5}
  @action
  async getSugTopicList_ogp(param) {
    const res = await this.post(urls.API_MAN_POST_OGP_AUTOALLOCATETOPIC, param);
    let group = [];
    res.data.map((item, i) => {
      group.push(
        item.key,
      )
    })

    runInAction(() => {
      this.openDefenseGroup.sug_topic_id = group;
    })
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
        topic: item.name + "-" + item.topic,
        content: item.content,
        tName: item.name,
        classname: item.class,
      })
    )
    runInAction(() => {
      this.openDefenseGroup.topic_info = topic;
    })

  }

  @action
  // 参数，系主任id
  // {"ide":"20130006"}
  async getTopicListDe_ogp(param) {
    const res = await this.post(urls.API_MAN_POST_OGP_TOPICLIST, param);
    let topic = []
    // 同一老师课题放一起，按未通过、通过、未审核排序
    res.data.map((item) =>
      topic.push({
        key: item.key,
        sName: item.sName,
        topic: item.name + "-" + item.topic,
        content: item.content,
        tName: item.name,
        classname: item.class,
      })
    )
    runInAction(() => {
      this.openDefenseGroup.topicde_info = topic;
    })

  }

  @action
  // 参数，系主任id
  // {"ide":"20130006"}
  async getTeacherList_ogp(param) {
    const res = await this.post(urls.API_MAN_POST_OGP_TEACHERLIST, param);
    let teacher = []
    res.data.map((item) => {
      let areas = ""
      item.area_list.split(",").map((item) => {
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
    res.data.sort(function (a, b) {
      if (a.time > b.time) {
        return 1;
      } else if (a.time < b.time) {
        return -1;
      }
      return 0;
    })
    let group = [];
    res.data.map((item, i) => {
      group.push({
        id: i + 1,
        gid: item.gid,
        leader: item.leader,
        members: item.names,
        address: item.address,
        time: item.time.slice(2, 10) +" "+ item.time.slice(11, 16),
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

  //进入开题答辩阶段
  // @action
  // async openDefense(param) {
  //   return await this.post(urls.API_MAN_POST_OPEND_DEFENSE, param);
  // }

  @observable
  summary = {
    stu_list: [],
    tea_topic_num: []
  }

  // 查看该系全体学生的论文进度
  // {"gid":int}
  @action
  async viewProgress(param) {
    let res = await this.post(urls.API_MAN_POST_VIEWPROGRESS, param)
    let temp = []
    res.data.map((item, i) => {
      let status = item.status
      let phase = ""
      let tag = ""
      if (status >= -1 && status <= 3) {
        phase = "选题阶段"
        if (status === 3) {
          // 学生已选题
          tag = "已选题"
        } else if (status === 0) {
          // 老师出题时选定学生，但该课题未审核
          tag = "待审核"
        } else {
          // 学生未选题
          tag = "未选题"
        }
      } else if (status === 4 || status === -4) {
        phase = "开题答辩"
        if (status === 4) {
          // 通过开题答辩
          tag = "已通过"
        } else if (status === -4) {
          // 未通过开题答辩
          tag = "未通过"
        }
      } else if (status === -5 || status === 5 || status === -6 || status === 6) {
        phase = "论文定稿"
        if (status === 5 || status === 6) {
          // 5教师通过,6系主任通过
          tag = "已通过"
        } else if (status === -5 || status === -6) {
          // 5教师未通过,6系主任未通过
          tag = "未通过"
        }
      } else if (status === 7 || status === -7) {
        phase = "论文答辩"
        if (status === 7) {
          // 通过论文答辩
          tag = "已通过"
        } else if (status === -7) {
          // 未通过论文答辩
          tag = "未通过"
        }
      } else if (status === -8 || status === 8 || status === -9 || status === 9) {
        phase = "最终审核"
        if (status === 8 || status === 9) {
          // 8教师通过,9系主任通过
          tag = "已通过"
        } else if (status === -8 || status === -9) {
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
      this.summary.stu_list = temp;
    })
  }

  // 查看该系教师出题情况
  // {"gid":int}
  @action
  async teaTopicNum(param) {
    let res = await this.post(urls.API_MAN_POST_VIEWTEACOUNT, param)
    res.data.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      }
      return 0;
    })
    runInAction(() => {
      this.summary.tea_topic_num = res.data;
    })
  }


  @observable
  reviewPaper = {
    // 教师列表
    task_info2: [],
    //假数据
    task_info: [],
    // 通过的任务书
    to_audit_list: [],
    // 未提交的任务书
    uncommit_list: [],
    suc: 0,
    //判断能否进入下一个阶段
    judge_op: undefined,
    //是否已经开题答辩
    status_op: undefined,
  }

  @action
  // 参数，系主任id
  // {"ide":"20130006"}
  async getTaskList(param) {
    const res = await this.post(urls.API_MAN_POST_RP_TASKLIST, param);
    let temp = []

    res.data.map((item, i) => {
      let tag = ""
      let num = 5

      if (item.status < 4) {
        tag = "未提交";
      } else if (item.status === 4) {
        tag = "待审核";
        num = 4;
      } else if (item.status === 5) {
        tag = "通过";
        num = 6;
      } else if (item.status >= 6) {
        tag = "已发布";
        num = 7;
      }

      temp.push({
        name: item.name,
        topic: item.topic,
        key: item.key,
        status: item.status,
        type: item.type,
        tag: tag,
        num: num
      })
    })

    // 通过，已发布
    let arr = []
    // 未提交
    let arr1 = []
    let count = 0
    let suc = 0
    temp.map((item, i) => {
      if (item.status === 4) {
        arr.push(
          item.key
        )
      } else if (item.status >= 5) {
        count++;
      } else if (item.status < 4) {
        arr1.push(
          item.key
        )
      }
    })
    temp.sort(function (a, b) {
      if (a.num === b.num) {
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        }
        return 0;
      }
      else if (a.num < b.num) {
        return -1;
      }
      else {
        return 1;
      }
    })
    if (count === res.data.length && res.data.length !== 0) {
      suc = 1
    }
    runInAction(() => {
      this.reviewPaper.task_info = temp;
      this.reviewPaper.to_audit_list = arr;
      this.reviewPaper.uncommit_list = arr1;
      this.reviewPaper.suc = suc;
    })

  }

  /* 任务书格式
  {
    "target":"s", 总体目标及性能（参数）要求
    "learn_content":"d", 研究内容
    "technical_route":"f", 技术路线
    "reference":"f", 参考文献
    "ft":["2020-07-02","2020-07-23"], 总起止时间
    "schedule":[ 具体进度安排
      {"time":["2020-07-01","2020-07-23"], 起止时间
      "content":"q" 内容}
    ]
  }
  */
  // 查看某课题任务书内容
  // {"pid":int,"role":int}
  @action
  async getTaskContent(param) {
    let res = await this.post(urls.API_TEACHER_GET_TASK, param)
    return res.data;
  }

  //审核任务书
  @action
  async reviewTask(param) {
    return await this.post(urls.API_MAN_POST_RP_REVIEWTASK, param)

  }

  //判断是否进入开题答辩
  //{"ide":20021578}
  @action
  async getJudgeOpDef(param) {
    let res = await this.post(urls.API_MAN_POST_RP_JUDEGOPENDEFENCE, param)
    this.reviewPaper.judge_op = res.data[0].flag;
  }

  //进入开题答辩阶段
  @action
  async openDefense(param) {
    return await this.post(urls.API_MAN_POST_RP_NEXTOPENDEFENCE, param)

  }

  //判断是否可以一键进入开题答辩
  //{"ide":20021578}
  @action
  async getStatusOpDef(param) {
    let res = await this.post(urls.API_MAN_POST_RP_STATUSOPENDEFENCE, param)
    this.reviewPaper.status_op = res.data[0].flag;
  }


  // 查看某位学生上传的文件
  // {"topic_id":int}
  @action
  async viewFiles(param) {
    let res = await this.post(urls.API_MAN_POST_VIEWFILES, param)
    return res.data
  }

  @action
  //仅支持pdf
  // {"file": string}
  async previewFile(param) {
    return await axios({
      url: urls.API_SYS_DOWN_FILE,
      method: 'POST',
      responseType: 'blob',
      data: param
    }).then(r => {
      let type = r.headers['content-type'];
      let data = new Blob([r.data], {
        type: type
      })
      let blobUrl = window.URL.createObjectURL(data);
      let ext = param.file.split('.').slice(-1);
      let newWindow = window.open();
      let item = '<iframe width="100%" height="100%" src="' + blobUrl + '" frameborder="0" allowfullscreen></iframe>'
      newWindow.document.write(item);
      newWindow.document.title = `预览${param.id}_${param.name}.${ext}`;
      return true;
    }).catch(e => {
      return false;
    })
  }


  @observable
  distributeReviewers = {
    //判断能否进入下一个阶段
    judge_fd: undefined,
    //是否已经开题答辩
    status_fd: undefined,
  }


  //判断是否进入开题答辩
  //{"ide":20021578}
  @action
  async getJudgeFdDef(param) {
    let res = await this.post(urls.API_MAN_POST_FM_JUDEGFINALDEFENCE, param)
    this.distributeReviewers.judge_fd = res.data[0].flag;
  }

  //进入开题答辩阶段
  @action
  async finalDefense(param) {
    return await this.post(urls.API_MAN_POST_FM_NEXTFINALDEFENCE, param)

  }

  //判断是否可以一键进入开题答辩
  //{"ide":20021578}
  @action
  async getStatusFdDef(param) {
    let res = await this.post(urls.API_MAN_POST_FM_STATUSFINALDEFENCE, param)
    this.distributeReviewers.status_fd = res.data[0].flag;
  }

  // 分配答辩小组
  @observable
  finalDefenseGroup = {
    // 教师列表
    teacher_info: [],
    // 未分配课题列表
    topic_info: [],
    // 延期课题列表
    topicde_info: [],
    //自动分配十个课题
    sug_topic_id: [],
    // 开题分组信息
    group_list: [],
    //置空
    select_leader: undefined,
    select_member: [],
  }
  // 自动显示十个答辩课题
  // {"ide":"20130006","leader_id":"20140008","teacher_id":["20140022","20150046","20170067"],"number":5}
  @action
  async getSugTopicList_fgp(param) {
    const res = await this.post(urls.API_MAN_POST_FGP_AUTOALLOCATETOPIC, param);
    let group = [];
    res.data.map((item, i) => {
      group.push(
        item.key,
      )
    })

    runInAction(() => {
      this.finalDefenseGroup.sug_topic_id = group;
    })
  }

  @action
  // 参数，系主任id
  // {"ide":"20130006"}
  async getTopicList_fgp(param) {
    const res = await this.post(urls.API_MAN_POST_FGP_TOPICLIST, param);
    let topic = []
    // 同一老师课题放一起，按未通过、通过、未审核排序
    res.data.map((item) =>
      topic.push({
        key: item.key,
        sName: item.sName,
        topic: item.name + "-" + item.topic,
        content: item.content,
        tName: item.name,
        classname: item.class,
      })
    )
    runInAction(() => {
      this.finalDefenseGroup.topic_info = topic;
    })

  }

  @action
  // 参数，系主任id
  // {"ide":"20130006"}
  async getTopicListDe_fgp(param) {
    const res = await this.post(urls.API_MAN_POST_FGP_TOPICLIST, param);
    let topic = []
    // 同一老师课题放一起，按未通过、通过、未审核排序
    res.data.map((item) =>
      topic.push({
        key: item.key,
        sName: item.sName,
        topic: item.name + "-" + item.topic,
        content: item.content,
        tName: item.name,
        classname: item.class,
      })
    )
    runInAction(() => {
      this.finalDefenseGroup.topicde_info = topic;
    })

  }

  @action
  // 参数，系主任id
  // {"ide":"20130006"}
  async getTeacherList_fgp(param) {
    const res = await this.post(urls.API_MAN_POST_FGP_TEACHERLIST, param);
    let teacher = []
    res.data.map((item) => {
      let areas = ""
      item.area_list.split(",").map((item) => {
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
      this.finalDefenseGroup.teacher_info = teacher;
    })
  }

 
  // 手动分配答辩课题
  // {"leader_id":"20170056","teacher_id":["20020070","20021092","20020782","20021105"],"topic_id":[3,4,5,6,7]}
  @action
  async manualAllocateTopic_fgp(param) {
    return await this.post(urls.API_MAN_POST_FGP_MANUALALLOCATETOPIC, param)
  }

  @action
  // 开题答辩小组的信息
  // 参数，系主任id
  // {"ide":"20130006"}
  async getGroupList_fgp(param) {
    const res = await this.post(urls.API_MAN_POST_FGP_GROUPLIST, param);
    res.data.sort(function (a, b) {
      if (a.time > b.time) {
        return 1;
      } else if (a.time < b.time) {
        return -1;
      }
      return 0;
    })
    let group = [];
    res.data.map((item, i) => {
      group.push({
        id: i + 1,
        gid: item.gid,
        leader: item.leader,
        members: item.names,
        address: item.address,
        time: item.time.slice(2, 10) + " " + item.time.slice(11, 16),
      })
    })


    runInAction(() => {
      this.finalDefenseGroup.group_list = group;
    })
  }

  // 组内课题详情
  // {"group_id":int}
  @action
  async topicDetailList_fgp(param) {
    let res = await this.post(urls.API_MAN_POST_FGP_TDETAILLIST, param)
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
  async deleteGroup_fgp(param) {
    return await this.post(urls.API_MAN_POST_FGP_DELETEGROUP, param)
  }

 




}
export default new manager()