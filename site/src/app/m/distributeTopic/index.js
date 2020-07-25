import { Component } from 'preact';
import { inject, observer } from 'mobx-react'
import { computed, observable, toJS } from 'mobx'
import { route } from 'preact-router';
import './style.scss'
import AutoAllocate from './autoAllocate.js'
import ManualAllocate from './manualAllocate.js'
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
    }
    // 切换自动手动单选框
    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };
    render() {
        return (
            <div>
                <div className="g-m-title">分配审核选题</div>
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
                                <AutoAllocate />
                            }
                            {(this.state.value === 2) &&
                                <ManualAllocate />
                            }
                        </TabPane>
                        <TabPane tab="审核详情" key="2">
                            <Detail />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
}
