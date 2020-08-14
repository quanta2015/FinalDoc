import { Component } from "preact";
import { inject, observer } from "mobx-react";
import { computed, toJS } from "mobx";
import { route } from "preact-router";

import {
  Table,
  Pagination,
  Tag,
  Space,
  message,
  Modal,
  Button,
  Descriptions,
  Input,
  Tooltip,
  Popconfirm,
  Card,
  Divider,
  Col,
  Row,
  Form,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Upload,
  Result,
  Tabs,
  Calendar,
} from "antd";
import StuSchedule from "./stu_schedule/index.js";
import TeaSchedule from "./tea_schedule/index.js";
import "./timeline.scss";
const { TabPane } = Tabs;

@inject("userStore")
@observer
export default class Ann extends Component {
  state = {
    value: 1,
  };

  @computed
  get usr() {
    return this.props.userStore.usr;
  }
  onPanelChange = (value, mode) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };
  componentDidMount() {
    if (!this.usr.uid) {
      route("/");
    }
  }

  render() {
    return (
      <>
        <div className="g-admin-timeline">
          <div className="g-admin-timeset">
            <Card title="设定流程进度" bordered={false}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="学生端进度设置" key="1">
                  <StuSchedule />
                </TabPane>
                <TabPane tab="教师端进度设置" key="2">
                  <TeaSchedule />
                </TabPane>
              </Tabs>
              
            </Card>
          </div>
        </div>
      </>
    );
  }
}
