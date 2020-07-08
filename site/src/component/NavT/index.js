import { Component } from 'preact';
import { route } from 'preact-router';
import './index.scss'
import more from './more.svg'
import { MENU_MAIN_T } from '../../constant/data'
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';


@inject('userStore')
@observer
class NavT extends Component {
	constructor(props) {
		super(props)
    this.state = {
      cur: 0,
    }
	}

  doMenu = (path,i)=>{
    this.setState({cur:i},()=>{ 
      route(path)
    })
  }

  async componentDidMount(){
    
  }

  @computed
  get usr() {
      return this.props.userStore.usr;
  }

	render() {
    let cur = this.state.cur
    return (
      <div className="g-nav">
        <div class="g-info">
          <div><span>身份：</span>教师</div>
          <div><span>姓名：</span>{this.usr.name}</div>
          <div><span>工号：</span>{this.usr.uid}</div>
          <div><span>所在系：</span>{this.usr.maj}</div>
          
        </div>
        <div className="g-menu">
          {MENU_MAIN_T.map((item,i)=>
            <div className={(cur==i)?'m-menu-item active':'m-menu-item'} key={i} onClick={this.doMenu.bind(this,item.path,i)}>
              <img src={item.icon} /><span>{item.title}</span> 
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default NavT