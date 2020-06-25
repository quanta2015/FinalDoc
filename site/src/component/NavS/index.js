import { Component } from 'preact';
import { inject } from 'mobx-react'
import { route } from 'preact-router';
import './index.scss'
import more from './more.svg'
import { MENU_MAIN_S } from '../../constant/data'


class NavS extends Component {
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
        <div className="g-menu">
          {MENU_MAIN_S.map((item,i)=>
            <div className={(cur==i)?'m-menu-item active':'m-menu-item'} key={i} onClick={this.doMenu.bind(this,item.path,i)}>
              <img src={item.icon} /><span>{item.title}</span> 
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default NavS
