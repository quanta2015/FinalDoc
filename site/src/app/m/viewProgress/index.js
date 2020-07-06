import { Component } from 'preact';
import { route } from 'preact-router';
import { inject, observer } from 'mobx-react';
import TotalSchedule from './totalSchedule.js'
import { computed } from 'mobx';
import "./style.css"

@inject('manageStore', 'userStore')
@observer
export default class Home extends Component {
	@computed
	get usr() {
		return this.props.userStore.usr;
	}

	componentDidMount() {
		if (!this.usr.id) {
			route('/')
		}
	}
	
	render() {
		return (
			<div className="vp_main">
				<TotalSchedule />
			</div>
		);
	}
}
