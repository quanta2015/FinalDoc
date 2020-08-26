import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';
import { Divider } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';
import './index.scss'
import { MENU_MAIN_M, MENU_MAIN_M_OGP,MENU_MAIN_M_FGP,MENU_MAIN_T, MENU_MAIN_T_AUDIT } from '../../constant/data'
import BaseActions from '../BaseActions'
import * as urls from '../../constant/urls'


@inject('manageStore', 'userStore')
@observer
class NavM extends BaseActions {
  constructor(props) {
    super(props)

    this.state = {
      cur: 0,
      checkList: [],
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

  @computed
  get distributeReviewers() {
    return this.props.manageStore.distributeReviewers;
  }

  @computed
  get reviewPaper() {
    return this.props.manageStore.reviewPaper;
  }


  async componentDidMount() {
    await this.props.manageStore.getJudgeFdDef({ "ide": this.usr.uid });
    await this.props.manageStore.getStatusFdDef({ "ide": this.usr.uid });
    let list = [];
    //post请求获取数据，看length是否为0.如果不为0，则显示该tab
    let x = await this.post(urls.API_SYS_TEACHER_AUDIT_TP_GET_TOPIC_LIST, { "uid": this.usr.uid })
    if (x.data.length > 0) {
      list.push(MENU_MAIN_T_AUDIT[0])
    }

    x = await this.post(urls.API_TEACHER_AUDIT_OP_IS_MEMBER, { uid: this.usr.uid });
    if (x.flag) {
      list.push(MENU_MAIN_T_AUDIT[1])
    }


    this.setState({ checkList: list })
     

    //获取当前系统状态信息，并且更新state
    //当前为写死的
    //目前的想法是把所有状态宏定义在存储里
    //ajax获取状态码
  }

  doMenu = (path, i) => {
    this.setState({ cur: i }, () => {
      route(path)
    })
  }

  gohome = () => {
    route('/m')
  }

  logout = () => {
    this.props.userStore.logout();
  }

  render() {
    const len = MENU_MAIN_M.length
    return (
      <div>
        <div className="g-mg-nav">
          <div className="g-logo">
            <div onClick={this.gohome}>毕业设计命题系统</div>
          </div>
          <div className="g-st">
            {this.state.status.content.map((c, i) => {
              return (
                <>
                  <span className={i == this.state.status.active ? 'm-st active' : 'm-st'}>{c}</span>
                </>
              )
            })}
          </div>
          <div className="g-menu">
            {/* 系主任功能 */}
             
            {MENU_MAIN_M.map((item, i) =>
            {
              if (this.distributeReviewers.status_fd !== 1) 
              return (
              <div
                className={(this.state.cur == i) ? 'm-menu-item active' : 'm-menu-item'}
                key={i}
                onClick={this.doMenu.bind(this, item.path, i)}>
                <img src={item.icon} /><span className="m-menu-span">{item.title}</span>
              </div>
              )}
            )}
           
            { MENU_MAIN_M_FGP.map((item, i) =>
            {
              if (this.distributeReviewers.status_fd ===1)
               return(
              <div
                className={(this.state.cur == i) ? 'm-menu-item active' : 'm-menu-item'}
                key={i}
                onClick={this.doMenu.bind(this, item.path, i)}>
                <img src={item.icon} /><span className="m-menu-span">{item.title}</span>
              </div>
               )
             }
            )}
            <Divider>指导教师</Divider>
            {MENU_MAIN_T.map((item, i) =>
              <div className={(this.state.cur == i + len) ? 'm-menu-item active' : 'm-menu-item'} key={i + len} onClick={this.doMenu.bind(this, item.path, i + len)}>
                <img src={item.icon} /><span className="m-menu-span">{item.title}</span>
              </div>
            )}
            <br />
            {this.state.checkList.map((item, i) =>
              <div
                // 这个+1是为了和最上面的毕业设计管理错开，各端需根据自己情况调整
                className={(this.state.cur == i + len + 1) ? 'm-menu-item active' : 'm-menu-item'}
                key={i + len + 1}
                onClick={this.doMenu.bind(this, item.path, i + len + 1)}>
                <img src={item.icon} /><span className="m-menu-span">{item.title}</span>
              </div>
            )}
          </div>
          <div className="g-info">
            <div className="m-logout" onClick={this.logout}>
              <span>退出登录</span>
            </div>
            <div className="m-info">
              {/* <div>身份：系主任</div>
              <div>姓名：{this.usr.name}</div>
              <div>工号：{this.usr.uid}</div>
              <div>所在系：{this.usr.maj}</div> */}
              <div className="u-role">
                <div className="none">{this.usr.maj}</div>
                <div className="role">系主任</div>
                <div className="maj">{this.usr.maj}</div>
              </div>
              <div className="u-id_name">
                <div>{this.usr.uid}</div>
                <div>{this.usr.name}</div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="u-block">123</div> */}
      </div>
    )
  }
}

export default NavM