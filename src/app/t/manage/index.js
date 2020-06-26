import { Component, h } from 'preact'
import { inject } from 'mobx-react'
import NavBar from '../../../component/NavBar';
import PublishBlock from '../../../component/NavT/Publish';
import CheckBlock from '../../../component/NavT/Check';
import style from './style.scss'


@inject('userStore')
export default class Home extends Component {
  tid=null;
  state = {
    succ:true
  }

  changePage = (tid)=>{
    let s = !this.state.succ;
    if(!!tid){
      this.tid=tid
    }else{
      this.tid=null;
    }
    this.setState({succ:s})
  }

	render() {
    console.log(this.state.succ);
		return (
      <div className="g-home">
        <NavBar/>
        {this.state.succ&&
          <CheckBlock change={this.changePage.bind(this)}/>
        }
        {
          !this.state.succ&&
          <PublishBlock tid={this.tid} change={this.changePage.bind(this)}/>
        }
		
      </div>
		);
	}
}
