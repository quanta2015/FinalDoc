import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx'
import { Button, Modal, Typography, Input, mesage, message } from 'antd'
import './index.scss'

const { Title } = Typography;
const { TextArea } = Input;

@inject('studentStore')
@observer
export default class TopicPG extends Component {
    constructor(props) {
        super()
        this.state = {
            loading: false,
            showProcess: false,
        }
    }

    @computed
    get derApplication() {
        return toJS(this.props.studentStore.derApplication);
    }

    componentDidUpdate(prevProps) {
        if (this.state.showProcess === prevProps.showProcess && prevProps.showProcess !== this.props.showProcess) {
            this.setState({
                showProcess: this.props.showProcess
            })
        }
    }

    handleSubmit = async () => {
        const reason = this.reason.state.value || '';
        if(reason) {
            this.setState({
                loading: true,
                reason: reason
            })
            await this.props.studentStore.insertDeferApl({uid: this.props.sid, reason: reason})
            await this.props.studentStore.getDeferAppliProgs({ sid: this.props.sid })
            message.success('您的申请已提交')
            this.setState({
                loading: false
            })
            this.props.afterSubmit();
        } else {
            message.error('申请理由不能为空');
        }
    }

    render() {
        const process = ['发出申请', '导师审批']
        return (
            <Modal
                className="g-stu-defer"
                visible={this.props.showDefer}
                onCancel={this.props.onCancel}
                title={<Title level={4}>延缓答辩申请</Title>}
                width={720}
                footer={null}
                destroyOnClose={true}
            >
                {
                    this.state.showProcess && this.derApplication.reason ?
                    <div className="m-tl-container">
                        {
                            process.map((item, i) => 
                                <div className={this.derApplication.index >= i ? this.derApplication.index === i ? "m-timeline-item z-focus" : "m-timeline-item z-active" : "m-timeline-item"}>
                                    {   
                                        this.derApplication.index >= i ?
                                        <>
                                            <span className="u-title">{item}</span>
                                                <p className="u-content">{this.derApplication.data[i]}</p>
                                        </>:
                                        <span className="u-title">{item}</span>
                                    }
                                </div>
                            )
                        }
                    </div>
                    :<>
                        <TextArea ref={reason => this.reason = reason} rows={4} placeholder="请输入申请理由..." />
                        <Button className="m-btn" loading={this.state.loading} type="primary" onClick={this.handleSubmit}>提交</Button>
                    </>
                }
            </Modal>
        )
    }
}