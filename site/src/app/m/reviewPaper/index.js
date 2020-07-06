import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { route } from 'preact-router';
import "./style.css"
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
			<div className="rp_main">
				<Tabs defaultActiveKey="1">
					<TabPane tab="审核任务书" key="1">
						Content of Tab Pane 1
    				</TabPane>
					<TabPane tab="审核论文定稿" key="2">
						Content of Tab Pane 2
    				</TabPane>
					<TabPane tab="签署最终意见" key="3">
						Content of Tab Pane 3
    				</TabPane>
				</Tabs>
			</div>
		);
	}
}
