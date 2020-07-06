import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import "./style.css"
import TotalSchedule from './totalSchedule'

@inject('manageStore')
@observer
export default class Home extends Component {
	render() {
		return (
			<div className="vp_main">
				<TotalSchedule />
			</div>
		);
	}
}
