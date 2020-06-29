import { Component } from 'preact';
import { inject, observer } from 'mobx-react'
import { computed, observable } from 'mobx'
import style from './style';
import AutoAllocate from './autoAllocate.js'
import HeadAllocate from './headAllocate.js'
import Detail from './detail.js'
import { Radio , Select , Tabs } from 'antd';
const { Option } = Select;
const { TabPane } = Tabs;

@inject('manageStore')
@observer
export default class Home extends Component {
    state = {
        value: 1,
    }

    @computed
    get distributeTopic() {
        return this.props.manageStore.distributeTopic;
    }

    async componentDidMount() {
        await this.props.manageStore.getTopicList();
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
                <Tabs defaultActiveKey="1"  >
                    <TabPane tab="分配课题" key="1">
                        {/* Content of Tab Pane 1 */}
                        <div className="head">
                            <div className="topicNum">还有<span>{this.distributeTopic.topic_info.length}篇</span>课题未分配审核</div>
                            {/* <div className="detail"><Button type="primary" href="./m_distributeTopic_detail">审核详情</Button></div> */}
                        </div>
                        <div className="choose">
                            <div class="title">分配方式</div>
                            <Radio.Group onChange={this.onChange} value={this.state.value}>
                                <Radio value={1}>自动分配</Radio>
                                <Radio value={2}>手动分配</Radio>
                            </Radio.Group>
                        </div>
                        {(this.state.value === 1) &&
                            <AutoAllocate />
                        }
                        {(this.state.value === 2) &&
                            <HeadAllocate />
                        }

                     </TabPane>
                    <TabPane tab="数据详情" key="2">
                        {/* Content of Tab Pane 2 */}
                        <Detail/>
                    </TabPane>
                     
                </Tabs>

                
                
            </div>
        );
    }
}
