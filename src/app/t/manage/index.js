import { Component, h } from 'preact'
import { inject } from 'mobx-react'
import NavBar from '../../../component/NavBar';
import PublishBlock from '../../../component/NavT/Publish';
import CheckBlock from '../../../component/NavT/Check';
import style from './style.scss'


@inject('userStore')
export default class Home extends Component {
  state = {
    proj: [],
  }

	render(_,{ proj }) {
		return (
			<div className="g-home">
        <NavBar/>
        {/* <CheckBlock/> */}
        <PublishBlock/>
			</div>
		);
	}
}
