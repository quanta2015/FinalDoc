import BaseActions from '../component/BaseActions'
import { observable, action } from 'mobx'
import * as urls from '../constant/urls'



class Teacher extends BaseActions {
  

  @action
  async postTopicInfo(data) {
      const r = await this.post(urls.API_SYS_POST_TOPIC_INFO, data);
      if (r && r.code === 200) {
          return r;
      } else {
          message.error("网络错误")
      }
      return r;
  }

  @action
  async getStuInfoByLikeID(id) {
      const r = await this.post(urls.API_SYS_GET_STU_BY_LIKEID, {num:id});
      if (r && r.code === 200) {
          
      } else {
          message.error("网络错误")
      }
      return r;
  }


  @action
  async getTopicFullInfo(pid) {
      const r = await this.post(urls.API_SYS_GET_FUUL_TOPIC_BY_ID, {pid:pid});
      if (r && r.code === 200) {
          
      } else {
          message.error("网络错误")
      }
      return r;
  }


}

export default new Teacher()