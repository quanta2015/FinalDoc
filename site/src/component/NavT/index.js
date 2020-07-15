import { Component } from 'preact';
import { route } from 'preact-router';
import './index.scss'
import home from "../../icon/icon_setting.svg";

import { CaretRightOutlined } from '@ant-design/icons';
import more from './more.svg'
import { MENU_MAIN_T, MENU_MAIN_T_AUDIT } from '../../constant/data'
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import BaseActions from '../BaseActions'
import * as urls from '../../constant/urls'


@inject('userStore')
@observer
class NavT extends BaseActions {
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

  doMenu = (path, i) => {
    this.setState({ cur: i }, () => {
      route(path)
    })
  }

  async componentDidMount() {
    let list = [];
    //post请求获取数据，看length是否为0.如果不为0，则显示该tab
    let x = await this.post(urls.API_SYS_TEACHER_AUDIT_TP_GET_TOPIC_LIST, { "uid": this.usr.uid })
    console.log(x);
    if (x.data.length > 0) {
      list.push(MENU_MAIN_T_AUDIT[0])
    }

    this.setState({ checkList: list })

    //获取当前系统状态信息，并且更新state
    //当前为写死的
    //目前的想法是把所有状态宏定义在存储里
    //ajax获取状态码
  }

  @computed
  get usr() {
    return this.props.userStore.usr;
  }

  render() {
    let cur = this.state.cur;
    let status = this.state.status;
    return (
      <div data-component="navt">
        <div className="g-nav" >
          
            <div className="g-home-title" onClick={() => { route('/t') }}>
            毕业论文管理系统
            </div>
            <div className="g-status">
            <div className="g-status-name">{status.title}</div>
            <div className="g-status-content">
              {status.content.map((c, i) => {
                return (
                  <>
                    <span className={i == status.active ? 'g-status-active g-status-item' : 'g-status-item'}>{c}</span>
                    {i < status.content.length - 1 && <CaretRightOutlined className="g-status-arrow" />}
                  </>
                )
              })}
            </div>
          </div>
          <div className="g-menu">
            {MENU_MAIN_T.map((item, i) =>
              <div className={(cur == i) ? 'm-menu-item active' : 'm-menu-item'} key={i} onClick={this.doMenu.bind(this, item.path, i)}>
                <img src={item.icon} /><span className="m-menu-span">{item.title}</span>
              </div>
            )}<br />
            {this.state.checkList.map((item, i) =>
              <div
                // 这个+1是为了和最上面的毕业设计管理错开，各端需根据自己情况调整
                className={(cur == i + 1) ? 'm-menu-item active' : 'm-menu-item'}
                key={i + 1}
                onClick={this.doMenu.bind(this, item.path, i + 1)}>
                <img src={item.icon} /><span className="m-menu-span">{item.title}</span>
              </div>
            )}
              <div className='m-menu-item' style={{marginTop:"15vh"}}>
          <img src={home} /><span className="m-menu-span">系统设置</span>
          </div>
          </div>
        
         
          <div className="g-info">
            <div><span>身份：</span>教师</div>
            <div><span>姓名：</span>{this.usr.name}</div>
            <div><span>工号：</span>{this.usr.uid}</div>
            <div><span>所在系：</span>{this.usr.maj}</div>
          </div>

        </div>
      </div>
    )
  }
}

export default NavT