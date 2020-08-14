import { Component } from 'preact';
import { Modal, Tag, Button } from 'antd';
import './index.scss'

export default class InfoDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            topic: null
        }
    }

    componentDidUpdate(prevProps) {
        if (this.state.visible === prevProps.visible && prevProps.visible !== this.props.visible) {
            this.setState({
                visible: this.props.visible,
                topic: this.props.topic
            })
        }
    }

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    handleClick = e => {
        this.props.handleClick();
        setTimeout(() => {
            this.setState({
                visible: false,
            });
        }, 100);
    }

    render() {
        //exmaple: topic={topic: '论文标题', type: '论文类型', content: '摘要', tag: [{name: '', color: ''}], instructor: '指导教师'}
        const { topic } = this.state;
        return (
            <div>
                {
                    topic &&
                    <Modal
                        className="g-detail"
                        title={null}
                        visible={this.state.visible}
                        closable={false}
                        onCancel={this.handleCancel}
                        afterClose={this.props.afterClose}
                        width={700}
                        footer={
                            [
                                <Button onClick={this.handleCancel}>关闭</Button>,
                                this.props.isAudi ? <Button onClick={() => this.handleClick()} danger>取消选定</Button> :
                                    <Button onClick={() => this.handleClick()} type="primary">选定</Button>
                            ]}
                    >
                        <div className="m-hd">
                            <span className="m-type">{topic.type}</span>
                            <span className="m-topic">{topic.topic}</span>
                            <span className="m-name">{topic.instructor}</span>
                        </div>
                        <div className="m-bd">
                            <div className="m-tag">
                                {
                                    topic.tag.map((item) => {
                                        return (
                                            <Tag color={item.color}>
                                                {item.name}
                                            </Tag>
                                        );
                                    })
                                }
                            </div>
                            {
                                topic.phone &&
                                <div className="m-teainfo">
                                    <span className="m-title">联系方式：</span>
                                    <span>{topic.phone}</span>
                                </div>
                            }
                            <div className="m-content">
                                <span className="m-title">课题简介：</span>
                                <br />
                                <p className="u-ph">{topic.content}</p>
                            </div>
                        </div>
                    </Modal>
                }

            </div>

        );
    }
}
