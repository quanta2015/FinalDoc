import { Component } from 'preact';
import { inject } from 'mobx-react'
import { route } from 'preact-router';
import './index.scss'
// import more from './more.svg'
import { MENU_MAIN_M } from '../../constant/data'


class NavM extends Component {
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
        <div className="g-info">
          <div>身份：系主任</div>
          <div>姓名：李四</div>
          <div>工号：04080901</div>
          <div>所在系：计算机科学与技术</div>
          {/* <div>所在学院：杭州国际服务工程学院</div> */}
        </div>
        <div className="g-menu">
          {MENU_MAIN_M.map((item,i)=>
            <div className={(cur==i)?'m-menu-item active':'m-menu-item'} key={i} onClick={this.doMenu.bind(this,item.path,i)}>
              <img src={item.icon} /><span>{item.title}</span> 
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default NavM