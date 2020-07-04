import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { Tabs } from 'antd';
import Defense from './defense.js'
import DivideDetail from './dividedetail.js'
import "./style.css";

const { TabPane } = Tabs;

@inject('manageStore','userStore')
@observer
export default class Home extends Component {
  state = {
    value: 1,
  }

  @computed
  get openDefenseGroup() {
    return this.props.manageStore.openDefenseGroup;
  }

  @computed
  get usr() {
    return this.props.userStore.usr;
  }

  async componentDidMount() {
    await this.props.manageStore.getGroupList_ogp({"ide":this.usr.uid});
    await this.props.manageStore.getTeacherList_ogp({"ide":this.usr.uid});
     
  }

  // 切换自动手动单选框
  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    return (
      <div className="main">
        <Tabs defaultActiveKey="1" >
          <TabPane tab="添加答辩小组" key="1">
            <Defense/>
          </TabPane>
          <TabPane tab="查看分组详情" key="2">
            <DivideDetail/>
          </TabPane>

        </Tabs>
      </div>
    );
  }
}

