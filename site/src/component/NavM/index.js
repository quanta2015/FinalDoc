import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';
import { Modal,Divider } from 'antd';
import UploadImage from '../ImgUpload'
import './index.scss'
// import more from './more.svg'
import { MENU_MAIN_M, MENU_MAIN_T, MENU_MAIN_T_AUDIT } from '../../constant/data'
import BaseActions from '../BaseActions'
import * as urls from '../../constant/urls'


@inject('manageStore', 'userStore')
@observer
class NavM extends BaseActions {
  constructor(props) {
    super(props)

    this.state = {
      cur: 0,
      visible: false,
      checkList: [],
    }
  }

  @computed
  get usr() {
    return this.props.userStore.usr;
  }

  async componentDidMount() {
    let list = [];
    //post请求获取数据，看length是否为0.如果不为0，则显示该tab
    let x = await this.post(urls.API_SYS_TEACHER_AUDIT_TP_GET_TOPIC_LIST, { "uid": this.usr.uid })
    if (x.data.length > 0) {
      list.push(MENU_MAIN_T_AUDIT[0])
    }

    this.setState({ checkList: list })
  }

  doMenu = (path, i) => {
    this.setState({ cur: i }, () => {
      route(path)
    })
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <div className="g-mg-nav">
        <div className="g-info">
          <div>身份：系主任</div>
          <div>姓名：{this.usr.name}</div>
          <div>工号：{this.usr.uid}</div>
          <div>所在系：{this.usr.maj}</div>
        </div>
        <div className="g-menu">
          <Divider orientation="left">系主任</Divider>
          {MENU_MAIN_M.map((item, i) =>
            <div
              className={(this.state.cur == i) ? 'm-menu-item active' : 'm-menu-item'}
              key={i}
              onClick={this.doMenu.bind(this, item.path, i)}>
              <img src={item.icon} /><span>{item.title}</span>
            </div>
          )}
          <br />
          <Divider>指导教师</Divider>
          {MENU_MAIN_T.map((item, i) =>
            <div
              className={(this.state.cur == i + 4) ? 'm-menu-item active' : 'm-menu-item'}
              key={i + 4}
              onClick={this.doMenu.bind(this, item.path, i + 4)}>
              <img src={item.icon} /><span className="m-menu-span">{item.title}</span>
            </div>
          )}
          <br />
          {this.state.checkList.map((item, i) =>
            <div
              className={(cur == i + 6) ? 'm-menu-item active' : 'm-menu-item'}
              key={i + 6}
              onClick={this.doMenu.bind(this, item.path, i + 6)}>
              <img src={item.icon} /><span className="m-menu-span">{item.title}</span>
            </div>
          )}
        </div>

      </div>

    )
  }
}

export default NavM