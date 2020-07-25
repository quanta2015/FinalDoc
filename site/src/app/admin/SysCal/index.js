import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';

import { Tabs } from 'antd';
import Schedule from './schedule/index.js'


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

  render() {
    return (
      <>
        <div className="admin-content">
          <div className="g-ann">
            <Tabs defaultActiveKey="1">
              <TabPane tab="学生端进度设置" key="1">
                <Schedule />
              </TabPane>
              <TabPane tab="教师端进度设置" key="2">
                <Schedule />
              </TabPane>
            </Tabs>
            {/* <div className="m-m">公告模块</div> */}
          </div>
        </div>

      </>
    );
  }
}
