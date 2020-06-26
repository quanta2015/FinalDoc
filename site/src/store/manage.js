import BaseActions from '../component/BaseActions'
import { observable, action } from 'mobx'
import * as urls from '../constant/urls'



class manager extends BaseActions {

  @observable
  usr = {
    name:'专业负责人',
    role:2    // 0: teacher 1:student 2: manage
  }

}

export default new manager()