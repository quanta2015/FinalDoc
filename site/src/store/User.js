import BaseActions from '../component/BaseActions'
import { observable, action } from 'mobx'
import * as urls from '../constant/urls'


var ROLE = 2

class User extends BaseActions {
  
  @observable
  usr = {
    name: undefined,
    uid: undefined,
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
  async getProjList() {
    return await this.get(urls.API_SYS_GET_PROJLIST, null)
  }

  @action
  async downloadFile(params) {
    return await this.post(urls.API_SYS_DOWN_FILE, params)
  }

}

export default new User()