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

 

  @computed
  get usr() {
    return this.props.userStore.usr;
  }
  @computed
  get openDefenseGroup() {
    return this.props.manageStore.openDefenseGroup;
  }

  //封装 延期课题列表
  async getTopicDe() {
    await this.props.manageStore.getTopicListDe_ogp({ "ide": this.usr.uid, "status": 2 });
  }

  async componentDidMount() {
    await this.props.manageStore.getTopicListDe_ogp({ "ide": this.usr.uid, "status": 2 });
    await this.props.manageStore.getTopicList_ogp({ "ide": this.usr.uid, "status": 1 });
    if (!this.usr.id) {
      route('/')
    }
    
  }

  // 点击tab回调
  onChange(key) {
    console.log(key);

  };

  render() {
    return (
      <div className="g-m-cnt">
        <div className="g-m-title">组织开题答辩</div>
        <div className="g-m g-ogp">
          <Tabs defaultActiveKey="1"  onChange={() => {
            //切换当前版面
            this.openDefenseGroup.select_leader = undefined
            this.openDefenseGroup.select_member = []
            this.openDefenseGroup.sug_topic_id = []
          }}>
            <TabPane tab="正常答辩分组" key="1">
              
              <Defense
                count={this.openDefenseGroup.topic_info.length + this.openDefenseGroup.topicde_info.length}
                topicde={this.openDefenseGroup.topic_info}
                status={1}
                />
            </TabPane>
            <TabPane tab="延期答辩分组" key="2">
              <Defense
                count={this.openDefenseGroup.topic_info.length + this.openDefenseGroup.topicde_info.length}
                topicde={this.openDefenseGroup.topicde_info}
                status={2} 
               />
            </TabPane>
            <TabPane tab="查看分组详情" key="3">
              <DivideDetail />
            </TabPane>

          </Tabs>
        </div>
      </div>
    );
  }
}

