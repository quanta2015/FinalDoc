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
                            <AutoAllocate/>
                        }
                        {(this.state.value === 2) &&
                            <HeadAllocate />
                        }
                    </TabPane>
                    <TabPane tab="审核详情" key="2">
                        {/* Content of Tab Pane 2 */}
                        <Detail/>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
