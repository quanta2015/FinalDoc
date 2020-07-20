/*
 * @Descripttion: admin store
 * @version:
 * @Author: wyx
 * @Date: 2020-07-09 19:06:02
 * @LastEditors: wyx
 * @LastEditTime: 2020-07-09 20:33:32
 */

import BaseActions from "../component/BaseActions";
import { observable, action, runInAction } from "mobx";
import * as urls from "../constant/urls";
import { message } from "antd";

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
    //公告列表
    file_list: [
      {
        id: "0",
        f_name: "0",
        f_time: "2020-07-08",
      },
    ],
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
  
}

export default new admin();
