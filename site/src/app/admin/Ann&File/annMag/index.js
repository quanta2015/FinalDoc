/*
 * @Descripttion: 
 * @version: 
 * @Author: wyx
 * @Date: 2020-07-09 09:44:03
 * @LastEditors: wyx
 * @LastEditTime: 2020-07-09 14:16:04
 */
import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';

import { Tabs } from 'antd';
import AnnounceManage from './annMg.js'
import FileManage from '../fileMag'

const { TabPane } = Tabs;

@inject('userStore')
@observer
export default class Ann extends Component {

  state = {
    value: 1,
  }

  @computed
  get usr() {
    return this.props.userStore.usr;
  }

  componentDidMount() {
    if (!this.usr.uid) {
      route('/')
    }
  }

  // onChange = e => {
  //   this.setState({
  //     value: e.target.value,
  //   })
  // }

  render() {
    return (
      <>
        <div className="admin-content">
          <div className="g-ann">
            <Tabs defaultActiveKey="1">
              <TabPane tab="公告详情" key="1">
                <AnnounceManage />
              </TabPane>
              <TabPane tab="文档管理" key="2">
                <FileManage />
              </TabPane>
            </Tabs>
            {/* <div className="m-m">公告模块</div> */}
          </div>
        </div>

      </>
    );
  }
}
