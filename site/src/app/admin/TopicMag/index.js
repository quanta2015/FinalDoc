
import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';

import { Tabs, Radio, Button } from 'antd';

const { TabPane } = Tabs;

@inject('userStore')
@observer
export default class topicAdmin extends Component {

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

  // 切换自动手动单选框


  render() {
    return (
      <>
        <div>
            <spam>
                选题管理页面
            </spam>
        </div>
      </>
    );
  }
}
