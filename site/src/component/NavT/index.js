import { Component } from 'preact';
import { route } from 'preact-router';
import './index.scss'
import { MENU_MAIN_T, MENU_MAIN_T_AUDIT } from '../../constant/data'
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import BaseActions from '../BaseActions'
import * as urls from '../../constant/urls'
import { message } from 'antd';


@inject('userStore','teacherStore')
@observer
class NavT extends BaseActions {
  constructor(props) {
    super(props)
    this.state = {
      cur: 0,
      checkList: [],
    }
  }

  doMenu = (path, i) => {
    this.setState({ cur: i }, () => {
      route(path)
    })
  }

  async componentDidMount() {
    let list = [];
    //post请求获取数据，看length是否为0.如果不为0，则显示该tab
    let x = await this.post(urls.API_SYS_TEACHER_AUDIT_TP_GET_TOPIC_LIST, { "uid": this.usr.uid })
    if (x.data.length > 0) {
      list.push(MENU_MAIN_T_AUDIT[0])
    }

    x = await this.post(urls.API_TEACHER_AUDIT_OP_IS_MEMBER,{uid:this.usr.uid});
    if(x.flag[0]){
      list.push(MENU_MAIN_T_AUDIT[1])
    }
    
    if(x.flag[1]){
      list.push(MENU_MAIN_T_AUDIT[2])
    }

    
    this.setState({ checkList: list })
  }

  @computed
  get usr() {
    return this.props.userStore.usr;
  }

  currStage = {
    name: '选题阶段',
    index: 1,
    stage: ['发布课题', '选择课题','审核命题', '双选成功']
  }
  
  logout = ()=>{
    this.props.userStore.logout();
  }

  render() {
    let cur = this.state.cur;
    let status = this.state.status;
    return (
      <div data-component="navt">
        <div className="g-nav" >
          <div className="g-menu">
            <div className="g-home-title" onClick={() => { route('/t') }}>
              毕业设计命题系统
            </div>
            <div className="g-st">
              {this.currStage.stage.map((item, id) => 
                <span className={id === this.currStage.index ? 'm-st active' : 'm-st'}>{item}</span>
              )}
            </div>
            {MENU_MAIN_T.map((item, i) =>
              <div className={(cur == i) ? 'm-menu-item active' : 'm-menu-item'} key={i} onClick={this.doMenu.bind(this, item.path, i)}>
                <img src={item.icon} /><span className="m-menu-span">{item.title}</span>
              </div>
            )}
            {this.state.checkList.map((item, i) =>
              <div
                // 这个+1是为了和最上面的毕业设计管理错开，各端需根据自己情况调整
                className={(cur == i + 1) ? 'm-menu-item active' : 'm-menu-item'}
                key={i + 1}
                onClick={this.doMenu.bind(this, item.path, i + 1)}>
                <img src={item.icon} /><span className="m-menu-span">{item.title}</span>
              </div>
            )}
          </div>
          <div className="m-logout" onClick={this.logout}>
            <span>退出登录</span>
          </div>
          <div className="g-info">
            <div className="g-info-typeline">
              <div className="g-info-type">教师</div>
              <div className="g-info-maj">{this.usr.maj}</div>
            </div>
            <div className="g-info-name"><span className="g-info-name-id">{this.usr.uid}</span><span>{this.usr.name}</span></div>
          </div>

        </div>
      </div>
    )
  }
}

export default NavT