import { Component } from 'preact';
import { inject, observer } from 'mobx-react'
import { computed, observable, toJS } from 'mobx'
import style from './style';
import AutoAllocate from './autoAllocate.js'
import HeadAllocate from './headAllocate.js'
import Detail from './detail.js'
import { Radio, Select, Tabs } from 'antd';
const { Option } = Select;
const { TabPane } = Tabs;

@inject('manageStore','userStore')
@observer
export default class Home extends Component {
    state = {
        value: 1,
        // 未分配课题列表
        topic_info: [],
        // 已分配课题列表
        checklist_info: [],
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
        await this.props.manageStore.getTopicList({"ide":this.usr.uid});
        await this.props.manageStore.getCheckList({"ide":this.usr.uid});
        await this.props.manageStore.getAuditCount({"ide":this.usr.uid});
        this.setState({
            checklist_info: toJS(this.distributeTopic.checklist_info),
            auditCount: toJS(this.distributeTopic.auditCount),
        }, () => {
            let text = ""
            let flag = 0
            if (this.state.auditCount.unAudit !== 0 || this.state.auditCount.unPassed !== 0) {
                flag = 0
                text = "仅" + this.state.auditCount.Passed + "篇已通过，" + this.state.auditCount.unAudit + "篇未审核，" + this.state.auditCount.unPassed + "篇未通过，不能发布所有课题"
            } else {
                flag = 1
                text = "课题均已通过审核，共" + this.state.auditCount.Passed + "，一键发布所有课题"
            }
            this.setState({ tooltipText: text, flag: flag })
        })
    }

    // 接收子组件传来的值
    getChildrenMsg = (result, msg) => {
        // result是子组件那bind的第一个参数this，msg是第二个参数
        console.log(msg)
        this.setState({
            checklist_info: msg.checklist_info,
            auditCount: msg.auditCount,
        }, () => {
            let text = ""
            let flag = 0
            if (this.state.auditCount.unAudit !== 0 || this.state.auditCount.unPassed !== 0) {
                flag = 0
                text = "仅" + this.state.auditCount.Passed + "篇已通过，" + this.state.auditCount.unAudit + "篇未审核，" + this.state.auditCount.unPassed + "篇未通过，不能发布所有课题"
            } else {
                flag = 1
                text = "课题均已通过审核，共" + this.state.auditCount.Passed + "，一键发布所有课题"
            }
            this.setState({ tooltipText: text, flag: flag })
        })
    }

    // 切换自动手动单选框
    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    render() {
        return (
            <div className="main">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="分配课题" key="1">
                        <div className="choose">
                            <Radio.Group onChange={this.onChange} value={this.state.value}>
                                <Radio value={1}>自动分配</Radio>
                                <Radio value={2}>手动分配</Radio>
                            </Radio.Group>
                        </div>
                        {(this.state.value === 1) &&
                            <AutoAllocate parent={this} />
                        }
                        {(this.state.value === 2) &&
                            <HeadAllocate parent={this} />
                        }
                    </TabPane>
                    <TabPane tab="审核详情" key="2">
                        {/* Content of Tab Pane 2 */}
                        <Detail
                            checklist_info={this.state.checklist_info}
                            auditCount={this.state.auditCount}
                            flag={this.state.flag}
                            tooltipText={this.state.tooltipText}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
