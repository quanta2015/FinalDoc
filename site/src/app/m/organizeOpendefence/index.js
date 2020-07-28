import { Component } from 'preact';
import { Tabs } from 'antd';
import { route } from 'preact-router';
import { inject, observer } from 'mobx-react'
import { computed, observable, toJS } from 'mobx'
import Defense from './defense.js'
import DivideDetail from './dividedetail.js'
import "./style.scss";

const { TabPane } = Tabs;

@inject('manageStore', 'userStore')
@observer
export default class Home extends Component {
  state = {
    value: 1,
  }

  // 切换自动手动单选框
  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  @computed
  get usr() {
    return this.props.userStore.usr;
  }

  componentDidMount() {
    if (!this.usr.id) {
      route('/')
    }
  }

  render() {
    return (
      <div className="g-m-cnt">
        <div className="g-m-title">组织开题答辩</div>
        <div className="g-m g-ogp">
          <Tabs defaultActiveKey="1" >
            <TabPane tab="添加答辩小组" key="1">
              <Defense />
            </TabPane>
            <TabPane tab="查看分组详情" key="2">
              <DivideDetail />
            </TabPane>

          </Tabs>
        </div>
      </div>
    );
  }
}

