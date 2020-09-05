import { Component } from "preact";
import { inject, observer } from "mobx-react";
import { computed, toJS } from "mobx";
import { route } from "preact-router";

import { Tabs, Radio, Button } from "antd";
const { TabPane } = Tabs;

@inject("userStore")
@observer
export default class reviewdebate extends Component {
  state = {
    normal: true,
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

  onChange = (e) => {
    console.log(e.target.value);
    this.setState({
      normal: e.target.value,
    });
  };
  render() {
    const { normal } = this.state;
    return (
      <>
        <div className="admin-content">
          <div className="g-ann">
            <Tabs defaultActiveKey="1">
              <TabPane tab="开题答辩" key="open">
                <div className="m-choose">
                  <Radio.Group
                    onChange={this.onChange}
                    value={normal}
                    style={{ marginBottom: 20 }}
                  >
                    <Radio.Button value={true}>正常答辩</Radio.Button>
                    <Radio.Button value={false}>延期答辩</Radio.Button>
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
                {normal === true && <div>开题答辩->正常答辩</div>}
                {normal === false && <div>开题答辩->延期答辩</div>}
              </TabPane>

              <TabPane tab="毕设答辩" key="final">
                <div className="m-choose">
                  <Radio.Group
                    onChange={this.onChange}
                    value={this.state.value}
                    style={{ marginBottom: 20 }}
                  >
                    <Radio.Button value={true}>正常答辩</Radio.Button>
                    <Radio.Button value={false}>延期答辩</Radio.Button>
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
                {normal === true && <div>开题答辩->正常答辩</div>}
                {normal === false && <div>开题答辩->延期答辩</div>}
              </TabPane>
            </Tabs>
            {/* <div className="m-m">公告模块</div> */}
          </div>
        </div>
      </>
    );
  }
}
