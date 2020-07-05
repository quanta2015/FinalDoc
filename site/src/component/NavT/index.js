import { Component } from 'preact';
import { route } from 'preact-router';
import './index.scss'
import more from './more.svg'
import { MENU_MAIN_T } from '../../constant/data'


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

	render(_,{ cur }) {
    return (
      <div className="g-nav">
        <div class="g-info">
          <div>身份：教师</div>
          <div>姓名：王五</div>
          <div>工号：04080902</div>
          <div>所在系：计算机科学与技术</div>
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