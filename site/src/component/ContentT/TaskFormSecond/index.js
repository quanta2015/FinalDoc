import { Form, Input, Button, Checkbox, DatePicker, message, Steps, Modal, TimePicker } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import BaseActions from '../../BaseActions';
import moment from 'moment'
import * as urls from '../../../constant/urls';
import style from './index.scss'

const { RangePicker } = DatePicker;
const { Step } = Steps;

const PRE_TIME_LINE = [
  [[2020,8,1],[2020,10,30]],
  [[2020,11,1,],[2021,0,20]],
  [[2021,0,20],[2021,2,10]],
  [[2021,3,10],[2021,6,10]]
]

export default class TaskForm extends BaseActions {

  state = {
    cur: 0,
    errList: [],
    target: "",
    technical_route: "",
    learn_content: "",
    reference: "",
    ft: [moment([2000, 0, 1]), moment([2000, 0, 1])],
    schedule: []
  }

  submit = async () => {
    let err = [];
    let err_page = -1;
    let flag = false;
    //约束判断
    if (!this.state.ft) {
      flag = true;
      err.push(99)
      err_page = 3;
    }
    for (let i = 0; i < this.state.schedule.length; i++) {
      if (this.state.schedule[i].content.trim() == "") {
        flag = true;
        err.push((i + 1) * 100 + 2)
        err_page = 3;
      }
    }
    for (let i = 0; i < this.state.schedule.length; i++) {
      if (!this.state.schedule[i].time) {
        flag = true;
        err.push((i + 1) * 100 + 1)
        err_page = 3;
      }
    }
    if (this.state.reference.trim() == "") {
      flag = true;
      err.push(2);
      err_page = 2;
    }
    if (this.state.learn_content.trim() == "") {
      flag = true;
      err.push(11);
      err_page = 1;
    }
    if (this.state.technical_route.trim() == "") {
      flag = true;
      err.push(12);
      err_page = 1;
    }
    if (this.state.target.trim() == "") {
      flag = true;
      err.push(0);
      err_page = 0;
    }

    if (flag) {
      message.error("您有信息未填完，请检查！");
      this.setState({ cur: err_page, errList: err })
      return;
    }

    Modal.confirm({
      title: "提交任务书",
      content: "请确认您的信息填写无误！",
      okText: "提交",
      cancelText: "取消",
      onOk: this.pushData,
      onCancel: () => { }
    })
  }

  pushData = async () => {
    let data = {};
    data.target = this.state.target;
    data.technical_route = this.state.technical_route;
    data.learn_content = this.state.learn_content;
    data.reference = this.state.reference;
    data.ft = this.state.ft;
    data.schedule = this.state.schedule;

    let d = { data: data, pid: this.props.pid };
    let x = await this.post(urls.API_TEACHER_SAVE_TASK, d);
    if (x.code == 200) {
      message.success('提交成功')
    } else {
      message.error('提交错误，请检查网络')
    }

    this.props.close();
    this.props.freshList();
  }

  removeErr = (x) => {
    let list = [];
    this.state.errList.forEach((e) => { if (e != x) list.push(e) })
    this.setState({ errList: list })
  }
  componentWillMount = async () => {
    let x = await this.get(urls.API_TEACHER_GET_TIME_LINE);
    x = x.data;
    let schedule = new Array(4);
    PRE_TIME_LINE[0][0] = x[0];
    PRE_TIME_LINE[3][1] = x[1];
    for (let i = 0; i < PRE_TIME_LINE.length; i++) {
      schedule[i] = {};
      schedule[i].content = "";
      schedule[i].time = [moment(PRE_TIME_LINE[i][0]), moment(PRE_TIME_LINE[i][1])];
    }
    this.setState(
      {
        ft: [moment(x[0]), moment(x[1])],
        schedule: schedule
      })
  }

  freshScheduleDates(dates, i) {
    let s = this.state.schedule;
    s[i].time = dates;
    this.setState({ schedule: s })
  }

  freshScheduleContent(v, i) {
    let s = this.state.schedule;
    s[i].content = v;
    this.setState({ schedule: s })
  }

  removeTimeLine(index) {

    let s = [];
    this.state.schedule.forEach((e, i) => { if (i != index) s.push(e) });
    this.setState({ schedule: [] }, () => {
      this.setState({ schedule: s })
    })
  }

  addTimeLine = () => {
    let s = this.state.schedule;
    s.push({ content: "", time: [moment(), moment()] });
    this.setState({ schedule: s })
  }


  render = () => {
    return (
      <div data-component="taskformtwo">
        <div className="taskformtwo">
          <div className="task-steps">
            <Steps
              progressDot
              current={this.state.cur}
            >
              <Step title={<span className="m-step-title">总体目标</span>} />
              <Step title={<span className="m-step-title">研究内容</span>} />
              <Step title={<span className="m-step-title">参考文献</span>} />
              <Step title={<span className="m-step-title">日期进度</span>} />
            </Steps>
          </div>
          <div className="task-content">

            <div className={this.state.cur == 0 ? 'task-cell' : 'hided task-cell'}>
              <div
                className={this.state.errList.indexOf(0) < 0 ? 'task-cell-title' : 'task-cell-title warning'}>
                <span className="redfont">*</span>
                总体目标及性能（参数）要求
              </div>
              <Input.TextArea
                rows={12}
                value={this.state.target}
                onChange={e => { this.setState({ target: e.target.value }); this.removeErr(0) }}
              />
              {
                this.state.errList.indexOf(0) >= 0 &&
                <span className="err-tip">* 请填写总体目标及性能（参数）要求！</span>
              }
            </div>

            <div className={this.state.cur == 1 ? 'task-cell' : 'hided task-cell'}>
              <div
                className={this.state.errList.indexOf(11) < 0 ? 'task-cell-title' : 'task-cell-title warning'}>
                <span className="redfont">*</span>
                研究内容
              </div>
              <Input.TextArea
                rows={7}
                value={this.state.learn_content}
                onChange={e => { this.setState({ learn_content: e.target.value }); this.removeErr(11) }}
              />
              {
                this.state.errList.indexOf(11) >= 0 &&
                <span className="err-tip">* 请填写研究内容！</span>
              }
              <div className="spacer-block"></div>
              <div className={this.state.errList.indexOf(12) < 0 ? 'task-cell-title' : 'task-cell-title warning'}>
                <span className="redfont">*</span>
                拟采用的技术路线
              </div>
              <Input.TextArea
                rows={7}
                value={this.state.technical_route}
                onChange={e => { this.setState({ technical_route: e.target.value }); this.removeErr(12) }}
              />
              {
                this.state.errList.indexOf(12) >= 0 &&
                <span className="err-tip">* 请填写拟采用的技术路线！</span>
              }
            </div>


            <div className={this.state.cur == 2 ? 'task-cell' : 'hided task-cell'}>
              <div
                className={this.state.errList.indexOf(2) < 0 ? 'task-cell-title' : 'task-cell-title warning'}>
                <span className="redfont">*</span>
                参考文献
              <span className="redfont">（15篇以上，其中英文至少2篇）</span>
              </div>
              <Input.TextArea
                rows={12}
                value={this.state.reference}
                onChange={e => { this.setState({ reference: e.target.value }); this.removeErr(2) }}
              />
              {
                this.state.errList.indexOf(2) >= 0 &&
                <span className="err-tip">* 请填写参考文献！</span>
              }
            </div>



            <div className={this.state.cur == 3 ? 'task-cell' : 'hided task-cell'}>
              <div className="task-cell-title">
                <span className="redfont">*</span>
                起止日期
              </div>
              <RangePicker
                value={this.state.ft}
                onChange={(dates, ds) => { this.setState({ ft: dates }); this.removeErr(99) }}
                style={{ width: 250 }}
              />
              {
                this.state.errList.indexOf(99) >= 0 &&
                <span className="err-tip">* 请选择起止日期！</span>
              }
              <div className="spacer-block"></div>
              <div className="task-cell-title">
                <span className="redfont">*</span>
                进度安排列表
              </div>
              <div className="cell-times" ref={x => this.tml = x}>
                {
                  this.state.schedule.length > 0 &&
                  this.state.schedule.map((x, i) => (
                    
                    <div className="times-line">
                      <div className="time-line-cell">
                        <RangePicker
                          value={x.time}
                          onChange={(dates, ds) => { this.freshScheduleDates(dates, i); this.removeErr((i + 1) * 100 + 1) }}
                        />
                        {
                          this.state.errList.indexOf((i + 1) * 100 + 1) >= 0 &&
                          <span className="err-tip">* 请选择起止日期！</span>
                        }
                      </div>
                      <div className="time-line-cell">
                        <Input.TextArea
                          style={{ width: 400 }}
                          autoSize={{ minRows: 1, maxRows: 7 }}
                          placeholder="请输入安排内容"
                          value={x.content}
                          onChange={(x) => { this.freshScheduleContent(x.target.value, i); this.removeErr((i + 1) * 100 + 1) }}
                        />
                        {
                          this.state.errList.indexOf((i + 1) * 100 + 2) >= 0 &&
                          <span className="err-tip">* 请输入安排内容！</span>
                        }
                      </div>
                      {
                        this.state.schedule.length > 0 &&
                        <MinusCircleOutlined
                          style={{ margin: '0 10px 0 0', fontSize: "18px", cursor: "pointer" }}
                          onClick={() => this.removeTimeLine(i)}
                        />
                      }

                    </div>
                  ))
                }
                <Button
                  type="dashed"
                  onClick={this.addTimeLine}
                  style={{ width: '100%' }}
                >
                  <PlusOutlined /> 新增进度安排
                </Button>
              </div>
            </div>
          </div>
          <div className="task-btns">
            {
              this.state.cur < 3 &&
              <Button className="task-btn" type="primary" onClick={() => { this.setState({ cur: this.state.cur + 1 }) }}>下一步</Button>
            }
            {
              this.state.cur == 3 &&
              <Button className="task-btn" type="primary" onClick={this.submit}>提交</Button>
            }
            {
              this.state.cur > 0 &&
              <Button className="task-btn" type="dashed" onClick={() => { this.setState({ cur: this.state.cur - 1 }) }}>上一步</Button>
            }
            {
              this.state.cur == 0 &&
              <Button className="task-btn" type="dashed" onClick={this.props.close}>取  消</Button>
            }
          </div>
        </div>
      </div>
    )
  }
}