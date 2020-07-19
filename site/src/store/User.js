import BaseActions from '../component/BaseActions'
import { observable, action, runInAction } from 'mobx'
import * as urls from '../constant/urls'
import axios from 'axios'
import { message } from 'antd'

import token from '../util/token.js'

var ROLE = 2

class User extends BaseActions {

  @observable
  usr = {}
  // usr = {
  //   name:'沈珊瑚',
  //   uid: '20130006',
  //   maj: '物联网软工系',
  //   role:2,    // 0: teacher 1:student 2: manage
  // }

  @observable
  //站内信
  msgList = []

  @observable
  hasUnread = false

  @action
  getUser() {
    return this.usr
  }



  @action
  async login(params) {
    const r = await this.post(urls.API_USR_LOGIN, params)
    console.log(r)
    if (r) {
      runInAction(() => {
        if (params.remember)
          token.saveUser(r.data)
        this.usr = r.data[0]
        // console.log(r.data)
        // console.log(this.usr)
      })
      console.log("判断成功")
      return r
    } else {
      message.error('网络错误', 0.7)
    }

  }

  @action
  //example: {file: './upload/aaa.doc', id: '1234', name: '开题报告'}
  //action: 下载aaa.doc文件，重命名为 1234_开题报告.doc
  async downloadFile(params) {
    return await axios({
      url: urls.API_SYS_DOWN_FILE,
      method: 'POST',
      responseType: 'blob',
      data: params
    }).then(r => {
      let type = r.headers['content-type'];
      let data = new Blob([r.data], {
        type: type
      })
      let ext = params.file.split('.').slice(-1);
      let blobUrl = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.download = `${params.id}_${params.name}.${ext}`;
      a.href = blobUrl;
      a.click();
      return true;
    }).catch(e => {
      return false;
    })
  }

  @action
  async getAllMessages(params) {
    const r = await this.post(urls.API_SYS_GET_MESSAGES, params)
    if (r && r.code === 200) {
      if (r.data) {
        runInAction(() => {
          this.msgList = r.data
        })
        return r.data
      }
    } else {
      message.error("网络错误")
    }
    return r
  }

  @action
  async readMessages(params) {
    const r = await this.post(urls.API_SYS_READ_MESSAGES, params)
    if (r && r.code === 200) {
      return true;
    }
  }

  @action
  setReadStatus(hasUnread) {
    this.hasUnread = hasUnread
  }
}

export default new User()