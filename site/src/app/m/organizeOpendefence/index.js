import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { Tabs } from 'antd';
import DivideDetail from './dividedetail.js'
import './style.css'
const { TabPane } = Tabs;

@inject('manageStore')
@observer
export default class Home extends Component {
  state = {

  }

  @computed
  get distributeTopic() {
    return this.props.manageStore.distributeTopic;
  }

  async componentDidMount() {

  }

  render() {
    return (
      <div className="main">
        <Tabs defaultActiveKey="1" >
          <TabPane tab="添加答辩小组" key="1">
            <div>123</div>
          </TabPane>
          <TabPane tab="查看分组详情" key="2">
            <DivideDetail />
          </TabPane>

        </Tabs>
      </div>
    );
  }
}
