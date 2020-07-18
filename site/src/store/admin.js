/*
 * @Descripttion: admin store
 * @version: 
 * @Author: wyx
 * @Date: 2020-07-09 19:06:02
 * @LastEditors: wyx
 * @LastEditTime: 2020-07-09 20:33:32
 */ 

import BaseActions from '../component/BaseActions'
import { observable, action, runInAction } from 'mobx'
import * as urls from '../constant/urls'

class admin extends BaseActions {
    @observable
    announceManage = {
        //公告列表
        announce_list: [
            {
                key: '1',
                title: '杭州师范大学2019-2020-2学期本科学生专业转换名单公示表',
                target: '学生',
                date: '2020-07-08',
            },{
                key: '2',
                title: '杭州师范大学2019-2020-2学期本科学生专业转换名单公示表',
                target: '全体',
                date: '2020-03-14',
            },{
                key: '3',
                title: '杭州师范大学2019-2020-2学期本科学生专业转换名单公示表',
                target: '全体',
                date: '2020-03-14',
            },{
                key: '4',
                title: '杭州师范大学2019-2020-2学期本科学生专业转换名单公示表',
                target: '全体',
                date: '2020-03-14',
            },{
                key: '5',
                title: '杭州师范大学2019-2020-2学期本科学生专业转换名单公示表',
                target: '全体',
                date: '2020-03-14',
            },{
                key: '6',
                title: '杭州师范大学2019-2020-2学期本科学生专业转换名单公示表',
                target: '全体',
                date: '2020-03-14',
            },{
                key: '7',
                title: '杭州师范大学2019-2020-2学期本科学生专业转换名单公示表',
                target: '全体',
                date: '2020-03-14',
            },{
                key: '8',
                title: '杭州师范大学2019-2020-2学期本科学生专业转换名单公示表',
                target: '全体',
                date: '2020-03-14',
            },{
                key: '9',
                title: '杭州师范大学2019-2020-2学期本科学生专业转换名单公示表',
                target: '全体',
                date: '2020-03-14',
            },{
                key: '10',
                title: '杭州师范大学2019-2020-2学期本科学生专业转换名单公示表',
                target: '全体',
                date: '2020-03-14',
            },{
                key: '11',
                title: '杭州师范大学2019-2020-2学期本科学生专业转换名单公示表',
                target: '全体',
                date: '2020-03-14',
            },{
                key: '12',
                title: '杭州师范大学2019-2020-2学期本科学生专业转换名单公示表',
                target: '全体',
                date: '2020-03-14',
            },{
                key: '13',
                title: '杭州师范大学2019-2020-2学期本科学生专业转换名单公示表',
                target: '全体',
                date: '2020-03-14',
            },
        ],
    }
    @action
    async getAnnData(params) {
      const r = await this.post(urls.API_ADMIN_GET_TOTAL_ANN_LIST, params)
      console.log(r)
      if (r) {
        runInAction(() => {
         
          
          this.announceManage.announce_list = r.data
        
          console.log(this.announceManage)
        })
        console.log("获取成功")
        return r
      } else {
        message.error('网络错误', 0.7)
      }
  
    }
}

export default new admin()