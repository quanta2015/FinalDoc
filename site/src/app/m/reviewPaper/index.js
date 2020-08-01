import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { route } from 'preact-router';
import "./style.scss"
import Ass from "./ass.js"
import { Tabs } from 'antd';
const { TabPane } = Tabs;

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
			<div className="g-m-cnt">
				<div className="g-m-title">审核任务书</div>
				<div className="g-m g-rp">
					<Ass />
				</div>
			</div>
		);
	}
}
