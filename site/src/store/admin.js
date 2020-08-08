
import BaseActions from "../component/BaseActions";
import { observable, action, runInAction } from "mobx";
import * as urls from "../constant/urls";
import { message } from "antd";
import axios from 'axios'
class admin extends BaseActions {
  @observable
  announceManage = {
    //公告列表
    announce_list: [
      {
        key: "0",
        title: "0",
        target: "学生",
        date: "2020-07-08",
      },
    ],
  };

  @observable
  adminFileManage = {
    //文件列表
    file_list: [
      {
        id: "0",
        f_name: "0",
        f_time: "2020-07-08",
      },
    ],
  };

  @observable
  nameListManage = {
    //名单管理
    tea_list:[],
    stu_list:[],
  };

  @action
  async getAnnData(params) {
    const r = await this.post(urls.API_ADMIN_GET_TOTAL_ANN_LIST, params);
    console.log(r);
    if (r) {
      runInAction(() => {
        this.announceManage.announce_list = r.data;

        console.log(this.announceManage);
      });
      console.log("获取成功");
      return r;
    } else {
      message.error("网络错误", 0.7);
    }
  }
  @action
  async launchAnn(params) {
    const r = await this.post(urls.API_ADMIN_UPLOAD_ANN, params);
    if (r && r.code === 200) {
      runInAction(() => {
        message.success("发布公告成功");
      });
      return r;
    } else {
      message.error("网络错误");
    }
    return r;
  }
  @action
  async launchfile(params) {
    const r = await this.post(urls.API_ADMIN_INSERT_FILE_RECORD, params);
    if (r && r.code === 200) {
      runInAction(() => {
        message.success("发布文件成功");
      });
      return r;
    } else {
      message.error("网络错误");
    }
    return 301;
  }
  @action
  async getFileList(params) {
    const r = await this.post(urls.API_ADMIN_GET_ALL_FILE, params);
    if (r && r.code === 200) {
      runInAction(() => {
        this.adminFileManage.file_list = r.data;

        console.log(this.announceManage);
      });
      return r.data;
    } else {
      message.error("网络错误");
    }
    return r;
  }
  @action
  async getAnnDetail(params) {
    const r = await this.post(urls.API_ADMIN_CALL_ANN_DETAIL, params);
    if (r && r.code === 200) {
      runInAction(() => {
        message.success("获取公告详情成功");
      });
      return r.data[0];
    } else {
      message.error("网络错误");
    }
    return r;
  }
  @action
  async deletOneAnn(params) {
    const r = await this.post(urls.API_ADMIN_DEL_ONE_ANN, params);
    if (r && r.code === 200) {
      runInAction(() => {
        message.success("删除公告成功");
      });
      return r.data;
    } else {
      message.error("网络错误");
    }
    return r;
  }
  @action
  //example: {file: './upload/aaa.doc', id: '1234', name: '开题报告'}
  //action: 下载aaa.doc文件，重命名为 1234_开题报告.doc
  async adminDownload(params) {
    return await axios({
      url: urls.API_ADMIN_DOWNLOAD_FILE,
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
      a.download = `${params.name}.${ext}`;
      a.href = blobUrl;
      a.click();
      return true;
    }).catch(e => {
      return false;
    })
  }
  @action
  async delUploadedFile(params) {
    const r = await this.post(urls.API_ADMIN_DELETE_UPLOAD_FILE, params);
    if (r && r.code === 200) {
      runInAction(() => {
        message.success("删除该文件成功");
      });
      return r.data;
    } else {
      message.error("网络错误");
    }
    return r;
  }

  /**
   * @description: 获取全部学生名单
   * @param {null} 
   * @return: 
   */
  @action
  async getAllStuList() {
    const res = await this.post(urls.API_ADMIN_GET_ALL_STU_LIST, null);
    if (res && res.code === 200) {
      runInAction(() => {
        this.nameListManage.stu_list = res.data;
      });
    } else {
      message.error("网络错误");
    }
  }

    /**
   * @description: 获取全部教师名单
   * @param {null} 
   * @return: 
   */
  @action
  async getAllTeaList() {
    const res = await this.post(urls.API_ADMIN_GET_ALL_TEA_LIST, null);
    if (res && res.code === 200) {
      runInAction(() => {
        this.nameListManage.tea_list = res.data;
      });
    } else {
      message.error("网络错误");
    }
  }
  
  /**
   * @description: 修改某条信息
   * @param {key: String, name: String, job_title: String, maj: String, cls: String, tel:String}
   * @return: 
   */
  @action
  async editInfo(params) {
    return 
    await this.post(urls.API_ADMIN_EDIT_ONE_INFO,params);
  }

  @action
  async getTimeline(params) {
    const r = await this.post(urls.API_ADMIN_GET_TIMELINE_WITH_MAJOR, params);
    if (r && r.code === 200) {
      runInAction(() => {
        message.success("获取时间流程详情成功");
      });
      return r.data;
    } else {
      message.error("网络错误");
    }
    return r;
  }


  @action
  async changeTimeline(params) {
    const r = await this.post(urls.API_ADMIN_CHANGE_TIMELINE_WITH_MAJOR, params);
    if (r && r.code === 200) {
      runInAction(() => {
        message.success("修改时间流程详情成功");
      });
      return r.data;
    } else {
      message.error("网络错误");
    }
    return r;
  }
}

export default new admin();
