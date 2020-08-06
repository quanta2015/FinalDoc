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
  @computed
  get usr() {
    return toJS(this.props.userStore.usr);
  }

  componentDidMount() {
    console.log("this.usr.uid");
    if (!this.usr.uid) route("/");
  }
   onRangeChange=(date, dateString)=> {
    console.log(dateString);
  }
  

  render() {
    console.log("========管理端系统设置->时间进度设定 界面页面===========");
    return (
      <div>
        <div>管理端系统设置->时间进度设定 界面页面</div>
        <RangePicker onChange={this.onRangeChange} renderExtraFooter={() => 'extra footer'} />
      </div>
    );
  }
}
