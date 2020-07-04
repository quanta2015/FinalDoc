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
    group_list: [],
    teacher_info:[],
  }

  @computed
  get openDefenseGroup() {
    return this.props.manageStore.openDefenseGroup;
  }

  @computed
  get usr() {
    return this.props.userStore.usr;
  }


  // 接收子组件传来的值
  getDefenseMsg = (result, msg) => {
    // result是子组件那bind的第一个参数this，msg是第二个参数
    console.log(msg,"index")
    this.setState({
       
      group_list: msg.group_list,
      teacher_info:msg.teacher_info
       
    })
  }

  async componentDidMount() {
    await this.props.manageStore.getGroupList_ogp({"ide":this.usr.uid});
    await this.props.manageStore.getTeacherList_ogp({ "ide": this.usr.uid });
    this.setState({
      group_list: toJS(this.openDefenseGroup.group_list),
      teacher_info:toJS(this.openDefenseGroup.teacher_info)
    }, () => {
      console.log(this.state.group_list,this.state.teacher_info)
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
            <Defense teacher_info={this.state.teacher_info} parent={this}/>
          </TabPane>
          <TabPane tab="查看分组详情" key="2">
            <DivideDetail group_list={this.state.group_list} parent={this} />
          </TabPane>

        </Tabs>
      </div>
    );
  }
}

