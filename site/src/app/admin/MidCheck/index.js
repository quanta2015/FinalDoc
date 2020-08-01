import { Component } from "preact";
import { inject, observer } from "mobx-react";
import { computed, toJS } from "mobx";
import { route } from "preact-router";

import { Tabs, Radio, Button } from "antd";

const { TabPane } = Tabs;

@inject("userStore")
@observer
export default class midCheck extends Component {
  state = {
    value: 1,
  };

  @computed
  get usr() {
    return this.props.userStore.usr;
  }

  componentDidMount() {
    if (!this.usr.uid) {
      route("/");
    }
  }

  // 切换自动手动单选框

  render() {
    return (
      <>
        <div>
         
          <div className="g-ad">
            <div className="g-ann">
              <Tabs defaultActiveKey="1">
                <TabPane tab="学生端进度设置" key="1">
                <span>中期检查界面</span>
                </TabPane>
                <TabPane tab="教师端进度设置" key="2">
                <span>中期检查界面</span>
                </TabPane>
              </Tabs>
              {/* <div className="m-m">公告模块</div> */}
            </div>
          </div>
        </div>
      </>
    );
  }
}
