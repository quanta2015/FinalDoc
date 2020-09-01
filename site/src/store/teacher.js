import BaseActions from '../component/BaseActions'
import { observable, action, runInAction } from 'mobx'

import * as urls from '../constant/urls'
import token from '../util/token.js'
import { message } from 'antd'

class Teacher extends BaseActions {

  // 选题类型列表
  topicTypes = [
  ]

  @action
	getAllTopic = async ()=>{
    let typeData = await this.get(urls.API_SYS_GET_ALL_TYPE);
    if (typeData && typeData.code === 200) {
      typeData = typeData.data.map((x)=>{return {text:x.name,value:x.name}});
      this.auditTP_topicTypes = typeData;
    }else{
      message.error("获取课题类型错误！")
    }

  }

  // 选题类型筛选
	topicFilter = (value, record) => {
		if (record.type != null)
			return record.type.indexOf(value) === 0;
		else
			return false;
	}

  //代审核命题列表
  @observable  
  auditTP_topicList = [
  ]

  //获取数据
  @action
	async AuditTp_getTopicList(params) {
    let result = await this.post(urls.API_SYS_TEACHER_AUDIT_TP_GET_TOPIC_LIST, params);
    if (result && result.code === 200) {
      runInAction(() => {
        this.auditTP_topicList = result.data
      })
    } else {
      message.error("网络错误")
    }
    return result;
  }

  //审核通过选题
  async AuditTp_passTopic(params) {
    let result = await this.post (urls.API_SYS_TEACHER_AUDIT_TP_CHECK_UPDATE_YES, params)
    if (result && result.code === 200) {
      message.success("选题审核已通过")
    } else {
      message.error("网络错误")
    }
    return result;
  }

  //审核反对选题
  async AuditTp_opposeTopic(params) {
    let result = await this.post (urls.API_SYS_TEACHER_AUDIT_TP_CHECK_UPDATE_NO, params)
    if (result && result.code === 200) {
      message.success("选题审核未通过")
    } else {
      message.error("网络错误")
    }
    return result;
  }

  //选中的待审核命题
  @observable  
  selectedTopic = { id: 1, topic: 'A', content: "ABCD", type: "newbee"};

  @action
  async getTopicById(params) {
    let result = await this.post(urls.API_SYS_TEACHER_AUDIT_TP_SEARCH_TOPIC_BY_ID, params);
    if (result && result.code === 200) {
      runInAction(() => {
        this.selectedTopic = result.data[0];
      })
    } else {
      message.error("网络错误")
    }
    return result;
	}
  
  //开题

  //代审核开题列表
  @observable  
  auditOP_topicList = [
  ]

  //获取数据
  @action
	async AuditOp_getTopicList(params) {
    let result = await this.post(urls.API_SYS_TEACHER_AUDIT_OP_GET_TOPIC_LIST, params);
    if (result && result.code === 200) {
      runInAction(() => {
        this.auditOP_topicList = result.result
      })
    } else {
      message.error("网络错误")
    }
    return result;
  }

  //审核组信息
  @observable
  auditOP_team = {
    "leader":{
      "name": ""
    },
    "member":[
      {
        "name": ""
      },
    ]
  }

  @action
  async AuditOp_getTeam(params) {
    let result = await this.post(urls.API_SYS_TEACHER_AUDIT_OP_GET_TEAM, params);
    if (result && result.code === 200) {
      runInAction(() => {
        this.auditOP_team = result.result
      })
    } else {
      message.error("网络错误")
    }
    return result;
  }

  //判断是否为审核组教师
  @observable
  auditOP_isTutor = true

  @action
  async AuditOp_getAuditPermission(params) {
    let result = await this.post(urls.API_SYS_TEACHER_AUDIT_OP_GET_AUDIT_PERMISSION, params);
    if (result && result.code === 200) {
      runInAction(() => {
        this.auditOP_isTutor = result.result.flag
      })
    } else {
      message.error("网络错误")
    }
    return result;
  }

  async AuditOp_submitTutorForm(params){
    let result = await this.post (urls.API_SYS_TEACHER_AUDIT_OP_SUBMIT_TUTOR_FORM, params)
    if (result && result.code === 200) {
      message.success("表单提交成功")
    } else {
      message.error("网络错误")
    }
    return result;
  }

  async AuditOp_submitTeamForm(params){
    let result = await this.post (urls.API_SYS_TEACHER_AUDIT_OP_SUBMIT_TEAM_FORM, params)
    if (result && result.code === 200) {
      message.success("表单提交成功")
    } else {
      message.error("网络错误")
    }
    return result;
  }

  // 判断是否为审核组组长
  @observable
  auditOP_isTeamLeader = true

  @action
  async AuditOp_isTeamLeader(params){
    let result = await this.post (urls.API_SYS_TEACHER_AUDIT_OP_IS_TEAM_LEADER, params)
    if (result && result.code === 200) {
      runInAction(() => {
        this.auditOP_isTeamLeader = result.flag
      })
    } else {
      message.error("网络错误")
    }
    return result;
  }

  // 结题

  //结题命题列表
  @observable  
  auditFD_topicList = [
  ]

  //获取数据
  @action
	async AuditFd_getTopicList(params) {
    let result = await this.post(urls.API_SYS_TEACHER_AUDIT_FD_GET_TOPIC_LIST, params);
    if (result && result.code === 200) {
      runInAction(() => {
        this.auditFD_topicList = result.data
      })
    } else {
      message.error("网络错误")
    }
    return result;
  }

  @observable
  auditFD_isTutor = false

  @observable
  auditFD_checkedTopic = 0;

  @action
  async AuditFd_getAuditPermission(params) {
    let result = await this.post(urls.API_SYS_TEACHER_AUDIT_FD_GET_AUDIT_PERMISSION, params);
    if (result && result.code === 200) {
      runInAction(() => {
        this.auditFD_isTutor = result.flag;
      })
    } else {
      message.error("网络错误")
    }
    return result;
  }

  async AuditFd_submitTutorForm(params){
    let result = await this.post (urls.API_SYS_TEACHER_AUDIT_FD_SUBMIT_TUTOR_FORM, params)
    if (result && result.code === 200) {
      message.success("表单提交成功")
    } else {
      message.error("网络错误")
    }
    return result;
  }

  async AuditFd_submitTeamForm(params){
    let result = await this.post (urls.API_SYS_TEACHER_AUDIT_FD_SUBMIT_TEAM_FORM, params)
    if (result && result.code === 200) {
      message.success("表单提交成功")
    } else {
      message.error("网络错误")
    }
    return result;
  }
}

export default new Teacher()