import { Component } from 'preact';
import { inject, observer } from 'mobx-react'
import { computed, observable, toJS } from 'mobx'
import { route } from 'preact-router';
import './style.scss'
import AutoAllocate from '../distributeTopic/autoAllocate.js'
import ManualAllocate from '../distributeTopic/manualAllocate.js'
import Detail from './detail.js'
import { Radio, Select, Tabs } from 'antd';
const { Option } = Select;
const { TabPane } = Tabs;

@inject('manageStore', 'userStore')
@observer
export default class Home extends Component {
    state = {
        value: 1,
        // 已分配情况数量,unAudit未分配,unPassed未通过,Passed已通过
        auditCount: {},
        /* 一键发布按钮 */
        tooltipText: "",
        // 已分配情况数量,unAudit未分配,unPassed未通过,Passed已通过
        auditCount: {},
        // 是否可以发布课题
        flag: 0,
        /* ********** */
    }

    @computed
    get distributeTopic() {
        return this.props.manageStore.distributeTopic;
    }

    @computed
    get distributeReviewers() {
        return this.props.manageStore.distributeReviewers;
    }

    @computed
    get usr() {
        return this.props.userStore.usr;
    }

    async componentDidMount() {
        if (!this.usr.id) {
            route('/')
        }
        await this.props.manageStore.getTopicList({ "ide": this.usr.uid });
        await this.props.manageStore.getCheckList({ "ide": this.usr.uid });
        await this.props.manageStore.getAuditCount({ "ide": this.usr.uid });
        await this.props.manageStore.getStatusFdDef({ "ide": this.usr.uid });
        await this.props.manageStore.getTeaList({ "ide": this.usr.uid, "status": 2 });
    }
    // 切换自动手动单选框
    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };
    render() {
        return (
            <div className="g-m-cnt">
                <div className="g-m-title">分配评阅人</div>
                <div className="g-m g-dt">
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="分配课题" key="1">
                            <div className="m-choose">
                                <Radio.Group onChange={this.onChange} value={this.state.value}>
                                    <Radio value={1}>自动分配</Radio>
                                    <Radio value={2}>手动分配</Radio>
                                </Radio.Group>
                            </div>
                            {(this.state.value === 1) &&
                                <AutoAllocate 
                                status={2}
                                judge={this.distributeReviewers.status_fd}
                                title="评阅"
                                tip="已进入终期答辩阶段，不能再分配评阅教师"/>
                            }
                            {(this.state.value === 2) &&
                                <ManualAllocate 
                                status={2}
                                judge={this.distributeReviewers.status_fd}
                                title="评阅"
                                tip="已进入终期答辩阶段，不能再分配评阅教师"/>
                            }
                        </TabPane>
                        <TabPane tab="评阅详情" key="2">
                            <Detail />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}
