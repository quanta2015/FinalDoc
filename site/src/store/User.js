import BaseActions from '../component/BaseActions'
import { observable, action } from 'mobx'
import axios from 'axios'
import * as urls from '../constant/urls'

var ROLE = 2

class User extends BaseActions {
  
  @observable
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
  async login() {
    this.usr.role = ROLE
    return { role: this.usr.role }
  }

  @action
	async login(params) {
		const r = await this.post(urls.API_USR_LOGIN, params)
		console.log(r)
		if (r) {
			runInAction(() => {
				token.saveUser(r.data)
				this.currUser = r.data
				console.log(r.data)
				console.log(this.currUser)
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