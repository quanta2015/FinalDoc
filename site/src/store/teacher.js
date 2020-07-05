import BaseActions from '../component/BaseActions'
import { observable, action } from 'mobx'
import * as urls from '../constant/urls'



class Teacher extends BaseActions {
  @observable
  usr = {
    name:'张三',
    role:0    // 0: teacher 1:student 2: manage
  }

}

export default new Teacher()