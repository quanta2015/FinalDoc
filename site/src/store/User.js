import BaseActions from '../component/BaseActions'
import { observable, action, runInAction } from 'mobx'
import * as urls from '../constant/urls'
import axios from 'axios'
import { message } from 'antd'

import token from '../util/token.js'

var ROLE = 2

class User extends BaseActions {
  
  @observable
  // usr = {
  //   name:'沈珊瑚',
  //   uid: '20130006',
  //   maj: '物联网软工系',
  //   role:2,    // 0: teacher 1:student 2: manage
  // }
  usr = {
    name: '张三',
    uid: '2018210207004',
    dep: '杭州国际服务工程学院',
    maj: '计算机科学与技术',
    cls: '计算机183',
    role: undefined,
  }

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
				token.saveUser(r.data)
				this.usr = r.data[0]
				console.log(r.data)
				console.log(this.usr)
			})
			console.log("判断成功")
			return r
		} else {
			message.error('网络错误', 0.7)
		}

	}

  @action
  async downloadFile(params) {
    return await axios({
      url: urls.API_SYS_DOWN_FILE,
      method: 'POST',
      responseType: 'blob',
      data: params
    }).then(r => {
      return r;
    }).catch(e => {
      console.log('网络错误')
    })
  }
}

export default new User()