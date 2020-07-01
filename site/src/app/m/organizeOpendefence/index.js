import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { Tabs } from 'antd';
<<<<<<< HEAD
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { message,Select } from 'antd'
import Defense from './defense.js'
import "./style.css";

=======
import DivideDetail from './dividedetail.js'
import './style.css'
>>>>>>> dbefc47a1bf0a6549ded9b6831c31e2476b51947
const { TabPane } = Tabs;

@inject('manageStore')
@observer
export default class Home extends Component {
  state = {
<<<<<<< HEAD
    value: 1,
=======

>>>>>>> dbefc47a1bf0a6549ded9b6831c31e2476b51947
  }

  @computed
  get distributeTopic() {
    return this.props.manageStore.distributeTopic;
  }

  async componentDidMount() {
<<<<<<< HEAD
    await this.props.manageStore.getTopicList();
  }

  // 切换自动手动单选框
  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

=======

  }

>>>>>>> dbefc47a1bf0a6549ded9b6831c31e2476b51947
  render() {
    return (
      <div className="main">
        <Tabs defaultActiveKey="1" >
<<<<<<< HEAD
          <TabPane tab="分配小组" key="1">
            <Defense/>
          </TabPane>
          <TabPane tab="数据详情" key="2">
            {/* Content of Tab Pane 2 */}
            234
          </TabPane>

        </Tabs>



=======
          <TabPane tab="添加答辩小组" key="1">
            <div>123</div>
          </TabPane>
          <TabPane tab="查看分组详情" key="2">
            <DivideDetail />
          </TabPane>

        </Tabs>
>>>>>>> dbefc47a1bf0a6549ded9b6831c31e2476b51947
      </div>
    );
  }
}

 