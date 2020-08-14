import { Component } from "preact";
import { route } from "preact-router";
import { inject, observer } from "mobx-react";
import { computed, toJS, values } from "mobx";
import moment from 'moment';
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
const { Option } = Select;
@inject("userStore", "adminStore")
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
  onRangeChange = (id, dateString) => {
    console.log(dateString)
    let params={
      role:1,
      state_id:id,
      state_start:dateString[0],
      state_end:dateString[1]
    }
    console.log(params);
    this.props.adminStore.changeTimeline(params).then((r) => {
      console.log(r)
    });

  };
  onSelectChange = (value) => {
    let param = {
      major: value,
      role: 1,
    };
    this.props.adminStore.getTimeline(param).then((r) => {
      this.setState({ majorSelected: true, timeOption: r });
    });
  };

  render() {
    console.log("========管理端系统设置->时间进度设定 界面页面===========");
    const { majorSelected, major, timeOption, timelineData } = this.state;
    return (
      <div>
        <Row gutter={[0, 0]}>
          <Col span={8}>
            <div>
              <div>教师端时间进度设置界面</div>
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
              {majorSelected &&
                timeOption.map((item, index) => {
                  return (
                    <div>
                      <div>{item.state_name}</div>
                      <div>
                        <RangePicker
                        defaultValue={[moment(item.state_start),moment(item.state_end)]}
                        
                        key={item.state_id}
                          onChange={(dates,dateStrings)=>this.onRangeChange(item.state_id,dateStrings)}
                          renderExtraFooter={() => "extra footer"}
                          
                        />
                      </div>
                    </div>
                  );
                })}
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
