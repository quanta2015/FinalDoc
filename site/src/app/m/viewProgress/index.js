import { Component } from 'preact';
import { route } from 'preact-router';
import { inject, observer } from 'mobx-react';
import TotalSchedule from './totalSchedule.js'
import TeaTopicNum from './teaTopicNum.js'
import { computed } from 'mobx';
import { Tabs } from 'antd';
const { TabPane } = Tabs;
import "./style.scss"

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
				<div className="g-m-title">查看论文进度</div>
				<div className="g-m g-vp">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="教师出题统计" key="1">
							<TeaTopicNum />
                        </TabPane>
                        <TabPane tab="论文进度情况" key="2">
							<TotalSchedule />
                        </TabPane>
                    </Tabs>
                </div>
			</div>
		);
	}
}
