import { Component }from 'preact';
import { inject } from 'mobx-react'
import { route } from 'preact-router';
import './index.css'
import { MENU_MAIN_T } from '../../constant/data'


class NavBar extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return (
            <div className="m-nav-bar">
                <div className="head-bar-item">退出</div>
            </div>
        )
    }
}


export default NavBar;