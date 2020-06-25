import BaseActions from '../component/BaseActions'
import { observable, action } from 'mobx'
import * as urls from '../constant/urls'



class User extends BaseActions {

  @action
  async getProjList() {
    return await this.get(urls.API_SYS_GET_PROJLIST,null)
  }

}

export default new User()