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
  // {"ide":"20130006"}
  async getTeaList(param) {
    const res = await this.post(urls.API_MAN_GET_TEALIST, param);
    let teaName = [];
    res.data.map((item) => {
      let areas = ""
      item.area_list.split(",").map((item) => {
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
    res.data.map((item) => {
      let temp = item.area_list.split(",")
      let color = []
      let areas = []
      temp.map((item) => {
        item.split("|")
        areas.push(item.split("|")[1])
        color.push(item.split("|")[2])
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
    //自动分配十个课题
    sug_topic_id: [],
    // 开题分组信息
    group_list: [],
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

  // 自动分配答辩课题
  // {"ide":"20130006","leader_id":"20140008","teacher_id":["20140022","20150046","20170067"],"number":5}
  // @action
  // async autoAllocateTopic_ogp(param) {
  //   return await this.post(urls.API_MAN_POST_OGP_AUTOALLOCATETOPIC, param)
  // }

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
  stu_list = []





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
      this.stu_list = temp;
    })
  }


  @observable
  reviewPaper = {
    // 教师列表
    task_info2: [],
    //假数据
    task_info: [],
    to_audit_list: [],



  }

  @action
  // 参数，系主任id
  // {"ide":"20130006"}
  async getTaskList(param) {
    const res = await this.post(urls.API_MAN_POST_RP_TASKLIST, param);
    let temp = []

    res.data.map((item, i) => {
      let tag = ""
      let num = 6

      if (item.status <4) {
        tag = "未提交";
      } else if (item.status === 4) {
        tag = "待审核";
        num = 4;
      } else if (item.status === 5) {
        tag = "通过";
        num = 5;
      }
      temp.push({
        name: item.name,
        topic: item.topic,
        key: item.key,
        status: item.status,
        tag: tag,
        num: num
      })
    })
    /* **********假数据 记得删掉************** */ 
    let data = {
      key: 1000,
      name: "假数据",
      num: 4,
      status: 4,
      tag: "待审核",
      topic: "体检病历数据的智能分析预测平台设计和研究",
    }
    temp.push(data)
    /* **********假数据**************** */ 
    let arr = []
    temp.map((item, i) => {
      if (item.status === 4) {
        arr.push(
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
    runInAction(() => {
      this.reviewPaper.task_info = temp;
      this.reviewPaper.to_audit_list = arr;
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
  // {"pid":int}
  @action
  getTaskContent(param) {
    let task_content = {
      "target": "研究Nodejs如何进行数据爬取，掌握SuperAgent的工作模型和多种参数的运行技巧，掌握Cheerio框架的使用方法和工作原理，了解医疗数据的具体类型、分类以及体检数据的特征；理解数据分析中数据预处理的过程以及重要性，掌握使用python处理多种数据问题，比如缺失、标准化、转置等；理解深度学习的基本概念和逻辑过程，掌握使用Keras库对体检数据进行处理分类，实习疾病数据预测的结果。",
      "learn_content": "1. 学习nodejs框架以及SuperAgent/Cheerio相关技术\n2. 学习爬取后医疗数据的结构和特征，分析如何进行数据转换；\n3. 学习数据预处理逻辑，解决深度学习编程之前的数据标记工作；\n4. 通过Keras编程实习数据分析过程，并且测试结果；",
      "technical_route": "（1）前期预备：首先通过大量相关技术资料的阅读以及撰写文献综述、外文翻译（必须是和论文相关的外文资料）等方式，了解掌握Nodejs语言，制订具体的工作计划，完成开题报告。\n（2）基础性知识准备： 学习SuperAgent、Cheerio框架模型和编程方法,以及Keras模块的编程方法。\n（3）编程数据爬取以及数据分类转换。\n（4）进行数据预处理以及编写深度学习模型进行数据分析预测。\n（5）修改论文并且准备答辩PPT。",
      "reference": "[1]	Learning Node.js,Marc Wandschneider,2013,Addison Wesley.\n[2]	深入React技术栈,陈屹,人民邮电出版社,2016.\n[3]	React 进阶之路,徐超,清华大学出版社,2018.\n[4]	React状态管理与同构实战,侯策,颜海镜,电子工业出版,2018.\n[5]	Web development with Express&Node,Ethan Brown,2014,O'Reilly,Mastering Node.js,Sandro Pauali,2013\n[6]	Javascript and Node fundamentals,Azat Mardan,2014.\n[7]	React前端技术与工程实践,李晋华,电子工业出版社,2017.\n[8]	深入理解 React 和 Redux,程墨,机械工业出版社,2017.\n[9]	前端工程化体系设计与实践,周俊鹏,电子工业出版社,2018.\n[10]	Hands on Node.js,Pedro Teixeira,2013-12-28.\n[11]	深入浅出Node.js,田永强,2013-12,人民邮电出版.\n[12]	Node.js Recipes,Cory Gackenheimer,October 2013,Apress\n[13]	NODE.js入门手册,Manuel Kiessling,The Node Beginner Book,2012,Apress\n[14]	Node与Express开发,Ethan Brown,人民邮电出版社,2015.\n[15]	Node for Front-End Developers,Garann Means,February 7, 2012,O'Reilly\n[16]	Building Hypermedia APIs with HTML5 and Node,Mike Amundsen,2011,O'Reilly.\n[17]	Professional Node.js: Building Javascript Based Scalable Software,PEDRO TEIXEIRA,2012.\n[18]	Node.js in Action,Mike Cantelon, TJ Holowaychuk, Manning Publications, 2013.",
      "ft": ["2020-09-01", "2021-04-30"],
      "schedule": [
        {
          "time": ["2020-09-01", "2020-12-10"],
          "content": "完成与毕业设计技术相关的中外文献阅读，在此基础上，完成文献综述，外文翻译，写出开题报告。"
        },
        {
          "time": ["2020-09-01", "2020-12-10"],
          "content": "完成与毕业设计技术相关的中外文献阅读，在此基础上，完成文献综述，外文翻译，写出开题报告。"
        },
        {
          "time": ["2020-09-01", "2020-12-10"],
          "content": "完成与毕业设计技术相关的中外文献阅读，在此基础上，完成文献综述，外文翻译，写出开题报告。"
        },
        {
          "time": ["2020-09-01", "2020-12-10"],
          "content": "完成与毕业设计技术相关的中外文献阅读，在此基础上，完成文献综述，外文翻译，写出开题报告。"
        }
      ]
    }
    return task_content;
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
}
export default new manager()