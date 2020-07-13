import { Component } from 'preact';
import { route } from 'preact-router';
import './index.scss'
import more from './more.svg'
import { MENU_MAIN_T,MENU_MAIN_T_AUDIT } from '../../constant/data'
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
      checkList:[]
    }
	}

  doMenu = (path,i)=>{
    this.setState({cur:i},()=>{ 
      route(path)
    })
  }

  async componentDidMount(){
    let list = [];
    //post请求获取数据，看length是否为0.如果不为0，则显示该tab
    let x = await this.post(urls.API_SYS_TEACHER_AUDIT_TP_GET_TOPIC_LIST,{"uid": this.usr.uid})
    if(x.data.length>0){
      list.push(MENU_MAIN_T_AUDIT[0])
    }

    this.setState({checkList:list})
  }

  @computed
  get usr() {
      return this.props.userStore.usr;
  }

	render() {
    let cur = this.state.cur
    return (
      <div data-component="navt">
      <div className="g-nav" >
        <div class="g-info">
          <div><span>身份：</span>教师</div>
          <div><span>姓名：</span>{this.usr.name}</div>
          <div><span>工号：</span>{this.usr.uid}</div>
          <div><span>所在系：</span>{this.usr.maj}</div>
          
        </div>
        <div className="g-menu">
          {MENU_MAIN_T.map((item,i)=>
            <div className={(cur==i)?'m-menu-item active':'m-menu-item'} key={i} onClick={this.doMenu.bind(this,item.path,i)}>
              <img src={item.icon} /><span className="m-menu-span">{item.title}</span> 
            </div>
          )}<br/>
          {this.state.checkList.map((item,i)=>
            <div 
            className={(cur==i+2)?'m-menu-item active':'m-menu-item'} 
            key={i+2} 
            onClick={this.doMenu.bind(this,item.path,i+2)}>
              <img src={item.icon} /><span className="m-menu-span">{item.title}</span> 
            </div>
          )}
        </div>
        
      </div>
      </div>
    )
  }
}

export default NavT