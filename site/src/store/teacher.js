import BaseActions from '../component/BaseActions'
import { observable, action, runInAction } from 'mobx'

import * as urls from '../constant/urls'
import { message } from 'antd'

class Teacher extends BaseActions {

  // 选题类型列表
  auditTP_topicTypes = [
    {
      text: '毕业设计',
      value: '毕业设计',
    },
    {
      text: '命题设计',
      value: '命题设计',
    },
    {
      text: '软件设计',
      value: '软件设计',
    },
    {
      text: '工程设计',
      value: '工程设计',
    }
  ]

  // 选题类型筛选
	AuditTP_topicFilter = (value, record) => {
		if (record.type != null)
			return record.type.indexOf(value) === 0;
		else
			return false;
	}

  //代审核命题列表
  @observable  
  auditTP_topicList = [
    {
      id: 656,
      topic: "subjectA",
      content: "subjectA",
      type: "fca"
    },
    {
      id: 659,
      topic: "subjectB",
      content: "subjectB",
      type: "fcb"
    },
    {
      id: 619,
      topic: "subjectC",
      content: "subjectC",
      type: "fcc"
    },
    {
      id: 620,
      topic: "subjectD",
      content: "subjectD",
      type: "fcd"
    }
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
  selectedTopic = {
    id: 656,
    topic: "subjectA",
    content: "subjectA",
    type: "fca"
  }
  
  @action
  async getTopicById(params) {
    let result = await this.post(urls.API_SYS_TEACHER_AUDIT_TP_SEARCH_TOPIC_BY_ID, params);
    if (result && result.code === 200) {
      runInAction(() => {
        this.selectedTopic = result.data[0]
      })
    } else {
      message.error("网络错误")
    }
    return result;
	}
  
}

export default new Teacher()