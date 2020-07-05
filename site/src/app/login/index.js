import { Component } from 'preact';
import {  Input, Button, Spin, message } from 'antd'
import { inject } from 'mobx-react'
// import { Redirect } from 'react-router-dom'
import './index.scss'
import { route } from 'preact-router';

@inject('userStore')
class Login extends Component {
	constructor(props) {
		super(props)
	}

	doLogin=async ()=>{
		let r = await this.props.userStore.login()
		
		switch(r.role) {
			case 0: route('/t');break;
			case 1: route('/s');break;
			case 2: route('/m');break;
		}	
	}

  
	render() {

		return (
				<div className='g-login'>
					<div className="m-login">
						<input placeholder="学号"/>
						<input placeholder="密码"/>
						<button type="primary" className="input-btn" block onClick={this.doLogin}>登 录</button>
					</div>
						
								
				</div>
		)
	}
}

export default Login
