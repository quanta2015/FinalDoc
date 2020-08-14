import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';

import { Tabs } from 'antd';


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
         
         系统设置页面
         <br></br>
         <br></br>
         <br></br>
         
         ←点击此处进入时间进度管理
        </div>

      </>
    );
  }
}
