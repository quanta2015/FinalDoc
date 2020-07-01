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
                <Tabs defaultActiveKey="1" >
                    <TabPane tab="分配课题" key="1">
                        
                        <div className="choose">
                           
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
                    <TabPane tab="审核详情" key="2">
                        {/* Content of Tab Pane 2 */}
                        <Detail/>
                    </TabPane>
                     
                </Tabs>

                
                
            </div>
        );
    }
}
