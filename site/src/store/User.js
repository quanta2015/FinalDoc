import BaseActions from '../component/BaseActions'
import { observable, action } from 'mobx'
import axios from 'axios'
import * as urls from '../constant/urls'

class User extends BaseActions {
  @observable
  usr = {
    name: '张三',
      uid: '2017210201045',
    // uid: '2014214272',
    dep: '杭州国际服务工程学院',
    maj: '计算机科学与技术',
    cls: '计算机183',
    role: 1    // 0: teacher 1:student 2: manage
  }

  @action
  async getProjList() {
    return await this.get(urls.API_SYS_GET_PROJLIST, null)
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
      let blobUrl = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.download = `${params.id}_${params.name}`;
      a.href = blobUrl;
      document.body.appendChild(a)
      a.click();
      document.body.removeChild(a)
      window.URL.revokeObjectURL(href)
      return true;
    }).catch(e => {
      return false;
    })
  }
}

export default new User()