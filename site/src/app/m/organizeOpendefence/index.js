import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { Tabs } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { message, Select } from 'antd'
import Defense from './defense.js'
import DivideDetail from './dividedetail.js'
import "./style.css";

const { TabPane } = Tabs;

@inject('manageStore')
@observer
export default class Home extends Component {
  state = {
    value: 1,
    group_list: [],
  }

  @computed
  get distributeTopic() {
    return this.props.manageStore.distributeTopic;
  }

  @computed
  get openDefenseGroup() {
    return this.props.manageStore.openDefenseGroup;
  }

  // 接收子组件传来的值
  getChildrenMsg = (result, msg) => {
    // result是子组件那bind的第一个参数this，msg是第二个参数
    console.log(msg)
    this.setState({
      group_list: msg,
    })
  }

  async componentDidMount() {
    await this.props.manageStore.getTopicList();
    await this.props.manageStore.getGroupList_ogp();
    this.setState({
      group_list: toJS(this.openDefenseGroup.group_list),
    }, () => {
      console.log(this.state.group_list)
    })
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
            <Defense />
          </TabPane>
          <TabPane tab="查看分组详情" key="2">
            <DivideDetail group_list={this.state.group_list} parent={this} />
          </TabPane>

        </Tabs>
      </div>
    );
  }
}

