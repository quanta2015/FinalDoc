import { Component } from 'preact';
import { Tabs } from 'antd';
import Defense from './defense.js'
import DivideDetail from './dividedetail.js'
import "./style.css";

const { TabPane } = Tabs;

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

