import { Component } from "preact";
import { route } from "preact-router";
import { inject, observer } from "mobx-react";
import { computed, toJS } from "mobx";

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
const { RangePicker } = DatePicker;
@inject("userStore")
@observer
export default class scheduleSet extends Component {
  state = {
    majorSelected: false,
    major: "",
    timelineData: null,
    timeOption: [],
  };
  @computed
  get usr() {
    return toJS(this.props.userStore.usr);
  }

  componentDidMount() {
    console.log("this.usr.uid");
    if (!this.usr.uid) route("/");
  }
  onRangeChange = (date, dateString) => {
    console.log(dateString);
  };
  onSelectChange = (value) => {
    this.setState({ majorSelected: true });
    let param = {
      major: value,
      role: 1,
    };

    console.log(`selected ${param}`);
  };

  render() {
    console.log("========管理端系统设置->时间进度设定 界面页面===========");
    const { majorSelected, major, timeOption, timelineData } = this.state;
    return (
      <div>
        <Row gutter={[0, 0]}>
          <Col span={8}>
            <div>
              <div>管理端系统设置->时间进度设定 界面页面</div>
              <Select
                placeholder="请选择专业系"
                style={{ width: 278 }}
                onChange={this.onSelectChange}
                size="middle"
              >
                <Option value="计算机系">计算机系</Option>
                <Option value="金融系">金融系</Option>
                <Option value="物联网软工系">物联网软工系</Option>
              </Select>
              {majorSelected && (
                <div>
                  <div>开题报告：</div>
                  <div>
                    <RangePicker
                      onChange={this.onRangeChange}
                      renderExtraFooter={() => "extra footer"}
                    />
                  </div>
                </div>
              )}
            </div>
          </Col>
          <Col span={1}></Col>
          <Col span={15}>
            <Calendar onPanelChange={this.onPanelChange} />
          </Col>
        </Row>
      </div>
    );
  }
}
