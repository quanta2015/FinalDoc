import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';
import { Divider } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import './index.scss'
import { MENU_MAIN_M, MENU_MAIN_T_AUDIT } from '../../constant/data'


@inject('manageStore', 'userStore')
@observer
class NavM extends Component {
  constructor(props) {
    super(props)

    this.state = {
      cur: 0,
      //状态信息
      status: {
        title: '1、选题阶段',
        content: ['指定命题', '分配命题', '审核命题', '双选命题'],
        active: 2
      }
    }
  }

  @computed
  get usr() {
    return this.props.userStore.usr;
  }

  // async componentDidMount() {
  //   let list = [];
  //   //post请求获取数据，看length是否为0.如果不为0，则显示该tab
  //   let x = await this.post(urls.API_SYS_TEACHER_AUDIT_TP_GET_TOPIC_LIST, { "uid": this.usr.uid })
  //   if (x.data.length > 0) {
  //     list.push(MENU_MAIN_T_AUDIT[0])
  //   }

  //   this.setState({ checkList: list })
  // }

  doMenu = (path, i) => {
    this.setState({ cur: i }, () => {
      route(path)
    })
  }

  gohome = () => {
    route('/m')
  }

  render() {
    return (
      <div className="g-mg-nav">

        <div className="g-logo">
          <div onClick={this.gohome}>毕业设计命题系统</div>
        </div>
        <div className="g-status">
          <div className="g-status-name">
            {this.state.status.title}
          </div>
          <div className="g-status-content">
            {this.state.status.content.map((c, i) => {
              return (
                <>
                  <span className={i == this.state.status.active ? 'g-status-active g-status-item' : 'g-status-item'}>{c}</span>
                  {i < this.state.status.content.length - 1 && <CaretRightOutlined className="g-status-arrow" />}
                </>
              )
            })}
          </div>
        </div>
        <div className="g-menu">
          {MENU_MAIN_M.map((item, i) =>
            <div
              className={(this.state.cur == i) ? 'm-menu-item active' : 'm-menu-item'}
              key={i}
              onClick={this.doMenu.bind(this, item.path, i)}>
              <img src={item.icon} /><span>{item.title}</span>
            </div>
          )}
          <Divider>指导教师</Divider>
          {MENU_MAIN_T_AUDIT.map((item, i) =>
            <div
              className={(this.state.cur == i + 4) ? 'm-menu-item active' : 'm-menu-item'}
              key={i + 4}
              onClick={this.doMenu.bind(this, item.path, i + 4)}>
              <img src={item.icon} /><span>{item.title}</span>
            </div>
          )}
        </div>
        <div className="g-info">
          <div>身份：系主任</div>
          <div>姓名：{this.usr.name}</div>
          <div>工号：{this.usr.uid}</div>
          <div>所在系：{this.usr.maj}</div>
        </div>
      </div>

    )
  }
}

export default NavM