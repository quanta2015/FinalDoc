import { Component, h } from 'preact'
import { inject } from 'mobx-react'
import NavBar from '../../../component/NavBar';
import PublishBlock from '../../../component/ContentT/Publish';
import CheckBlock from '../../../component/ContentT/Check';
import style from './style.scss'
import Router, { route } from 'preact-router';
import { Switch, Button } from 'antd';


@inject('userStore')
export default class Home extends Component {
  tid=null;
  succ=true;

  changePage = (tid)=>{
    this.succ = !this.succ;
    if(!!tid){
      this.tid=tid
    }else{
      this.tid=null;
    }
    console.log(this.succ)
    if(this.succ){
      route("/t_manage/check")
    }else{
      route("/t_manage/publish")
    }
  }

	render() {
    console.log(this.state.succ);
		return (
      <div className="g-home">
        <NavBar/>
        <CheckBlock change={this.changePage.bind(this)}/>
        <PublishBlock path='/t_manage/publish'/>
        <Router>
          <PublishBlock path='/t_manage/publish'/>
        </Router>
      </div>
		);
	}
}
