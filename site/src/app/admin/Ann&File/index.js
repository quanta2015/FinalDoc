/*
 * @Descripttion: 
 * @version: 
 * @Author: wyx
 * @Date: 2020-07-09 09:44:03
 * @LastEditors: wyx
 * @LastEditTime: 2020-07-23 17:13:10
 */ 
import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';
import './annMag/annMg.scss'
import { Tabs, Radio, Button } from 'antd';
import AnnounceManage from './annMag/annMg.js'
import FileManage from './fileMag'
import TLIST from './nameList/tList.js'
import SLIST from './nameList/sList.js'

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

  // 切换自动手动单选框
  onChange = e => {
    this.setState({
        value: e.target.value,
    });
  };

  render() {
    return (
      <>
        <div className="admin-content">
          <div className="g-ann">
            <Tabs defaultActiveKey="1">
              <TabPane tab="公告详情" key="1">
                <AnnounceManage />
              </TabPane>
              <TabPane tab="文档管理" key="2">
                <FileManage />
              </TabPane>
              <TabPane tab="名单管理" key="3">
                <div className="m-choose">
                  <Radio.Group onChange={this.onChange} value={this.state.value} style={{ marginBottom: 20 }}>
                    <Radio.Button value={1}>教师名单</Radio.Button>
                    <Radio.Button value={2}>学生名单</Radio.Button>
                  </Radio.Group>
                  <Button
                    className="m-release-btn"
                    onClick={this.handleAdd}
                    type="primary"
                    style={{
                      marginBottom: 16,
                    }}
                  >
                    添加信息
                  </Button>
                </div>
                {(this.state.value === 1) &&
                    <TLIST />
                }
                {(this.state.value === 2) &&
                    <SLIST />
                }
                {/* <NameListManage /> */}
              </TabPane>
            </Tabs>
            {/* <div className="m-m">公告模块</div> */}
          </div>
        </div>

      </>
    );
  }
}
