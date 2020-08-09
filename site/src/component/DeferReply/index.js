import { Component } from 'preact';
import { Button, Modal, Typography, Input, mesage, message } from 'antd'
import './index.scss'

const { Title } = Typography;
const { TextArea } = Input;

export default class TopicPG extends Component {
    constructor(props) {
        super()
    }

    // mock data
    deferProgresss = [
        {content: '那天在外地，想请个假，请老师通过，谢谢老师！'},
        {content: '同意'}
    ]

    handleSubmit = async () => {
        const reason = this.reason.state.value || '';
        if(reason) {
            // 添加申请
            this.props.afterSubmit();
        } else {
            message.error('申请理由不能为空');
        }
        console.log(this.reason.state.value);
    }

    render() {
        const process = ['发出申请', '导师审批', '系主任审批']
        const currProgress = this.deferProgresss.length - 1;
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
                    this.props.showProcess ?
                    <div className="m-tl-container">
                        {
                            process.map((item, index) => 
                                <div className={currProgress >= index ? currProgress === index ? "m-timeline-item z-focus" : "m-timeline-item z-active" : "m-timeline-item"}>
                                    {   
                                        currProgress >= index ?
                                        <>
                                            <span className="u-title">{item}</span>
                                            {/* <span className="u-time">{this.deferProgresss[index].time}</span> */}
                                            <p className="u-content">{this.deferProgresss[index].content}</p>
                                        </>:
                                        <span className="u-title">{item}</span>
                                    }
                                </div>
                            )
                        }
                    </div>
                    :<>
                        <TextArea ref={reason => this.reason = reason} rows={4} placeholder="请输入申请理由..." />
                        <Button className="m-btn" type="primary" onClick={this.handleSubmit}>提交</Button>
                    </>
                }
            </Modal>
        )
    }
}