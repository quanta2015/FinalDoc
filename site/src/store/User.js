import BaseActions from '../component/BaseActions'
import { observable, action, runInAction } from 'mobx'
import * as urls from '../constant/urls'
import axios from 'axios'
import { message } from 'antd'

import token from '../util/token.js'
import { route } from 'preact-router'

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
  //通知列表 index 未读通知所处位置
  noticeList = { index: null, data: [] }

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

  @action
  // r.data: [[{已读公告1},{}...],[{未读公告1},{}...]]
  async getNoticeList() {
    let params = { uid: this.usr.uid, role: this.usr.role };
    const r = await this.post(urls.API_SYS_GET_NOTICE, params);
    if (r && r.code === 200 && r.data) {
      let unreadIndex = r.data[1].length - 1;
      runInAction(() => {
        this.noticeList.index = unreadIndex;
        this.noticeList.data = [...r.data[1], ...r.data[0]];
      })
      return (r.data[1].length + r.data[0].length)
    } else {
      return 0
      // message.error("网络错误")
    }
  }

  @action
  async readNotice(aid) {
    let params = { uid: this.usr.uid, ann_id: aid }
    const r = await this.post(urls.API_SYS_READ_NOTICE, params);
    if (r && r.code === 200) {
      return true;
    }
  }

  //状态通知 一对多
  //params: { from: str, to: str, context: str }
  //from:id
  // to:admin 管理员; allTea 全体教师; audTea 本系审核教师; topTea 本系课题对应教师; allStu 全体学生; topStu 本系学生
  @action
  async insertMessageToMany(param) {
    return await this.post(urls.API_SYS_POST_MESSAGETOMANY, param)
  }
  //状态通知 一对一
  @action
  async insertMessageToOne(param) {
    return await this.post(urls.API_SYS_POST_MESSAGETOONE, param) 
  }

  @action
  logout() {
    token.removeUser();
    this.usr ={}
    route("/")
    
  }
  

}

export default new User()