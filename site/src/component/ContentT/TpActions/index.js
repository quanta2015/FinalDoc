import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

import {
    Button,
    Input,
    Modal,
    message,
    Switch, 
	Tooltip
} from 'antd';

import {
	CheckOutlined,
	CloseOutlined,
    FileSearchOutlined,
    CloseCircleTwoTone,
} from '@ant-design/icons';

const { TextArea } = Input;

import style from './index.scss';

@inject('teacherStore', 'userStore')
@observer
class TpActions extends Component { 

    constructor(props) {
        super(props)
        this.state = {

            adviceModalVisible: false,
            contentModalVisible: false,
            contentTextAreaVisible: false,
            confirmLoading: false,
            ModalText: "您将反对此命题，请在这里提出您的相关建议：",
            advice: "",
        }
    }

    @computed
    get usr() {
        return this.props.userStore.usr;
    }

    @computed
    get selectedTopic() {
        return this.props.teacherStore.selectedTopic;
    }

    handleBtnPass = (id) => {
        this.props.teacherStore.AuditTp_passTopic( {"id": id} )
        .then(() => {this.props.teacherStore.AuditTp_getTopicList( {"uid": this.usr.uid} )})
    }

    //提出建议
    showAdviceModal = () => {
		this.setState({
            ModalText: "您将反对此命题，请在这里提出您的相关建议：",
            advice: "",
			adviceModalVisible: true,
		});
    };
    
    handleAdviceCancel = () => {
		this.setState({
			adviceModalVisible: false,
		});
    };
    
    handleAdviceOk = (id, advice) => {
		this.setState({
			ModalText: '正在提交相关的建议。',
			confirmLoading: true,
		});

        this.props.teacherStore.AuditTp_opposeTopic({ "id": id, "content": advice})
        .then( () => {this.props.teacherStore.AuditTp_getTopicList( {"uid": this.usr.uid} )})

		setTimeout(() => {
			this.setState({
                adviceModalVisible: false,
				confirmLoading: false,
			});
		}, 500);
    };
    
    adviceChange = (e) => {
		this.setState({
			advice: e.target.value
		})
	}

    //详情处理
    showContentModal = (id) => {
        this.props.teacherStore.getTopicById({ "userId": this.usr.uid, "id": id })
		this.setState({
            ModalText: "您将反对此命题，请在这里提出您的相关建议：",
            advice: "",
			contentModalVisible: true,
		});
	};

	handleContentCancel = () => {
		this.setState({
			contentModalVisible: false,
		});
	};

    switchContentAdvise = (checked) => {
        if(checked === false){
            this.setState({
                contentTextAreaVisible: true
            })
        }else{
            this.setState({
                contentTextAreaVisible: false
            })
        }
            
    }

    handleContentSubmit = (flag, id, advice) => {
        if(!flag === true)
        {
            this.props.teacherStore.AuditTp_passTopic( {"id": id} )
            .then(() => {this.props.teacherStore.AuditTp_getTopicList( {"uid": this.usr.uid} )})
            .then(() => {
                this.setState({
                    contentModalVisible: false,
                });
            })
        }
        else
        {
            this.props.teacherStore.AuditTp_opposeTopic({ "id": id, "content": advice})
            .then( () => {this.props.teacherStore.AuditTp_getTopicList( {"uid": this.usr.uid} )})
            .then(() => {
                this.setState({
                    contentModalVisible: false,
                });
            })
        }
    }

	render(){

        const {ModalText, adviceModalVisible, advice, confirmLoading, contentModalVisible, contentTextAreaVisible} = this.state;
        return(
            <div>
                <Tooltip placement="top" title="通过">
                    <Button type="link" shape="circle" icon={<CheckOutlined />} onClick={this.handleBtnPass.bind(this, this.props.record.id)} />
                </Tooltip>

                <Tooltip placement="top" title="提出建议">
                    <Button type="link" shape="circle" icon={<CloseOutlined />} onClick={this.showAdviceModal} />
                </Tooltip>

                <Tooltip title="详情">
                    <Button type="link" shape="circle" icon={<FileSearchOutlined />} onClick={this.showContentModal.bind(this, this.props.record.id)} />
                </Tooltip>

                <Modal
                    title="提出建议"
                    visible={adviceModalVisible}
                    onOk={this.handleAdviceOk.bind(this, this.props.record.id, advice)}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleAdviceCancel}
                >
                    <p>{ModalText}</p>
                    <TextArea value={advice} onChange={this.adviceChange} rows={3}></TextArea>
                </Modal>

                <Modal
                    className="t-ContentT-TpActions-Modal"
                    closeIcon={< CloseCircleTwoTone twoToneColor="#999" style={{
                        fontSize: '28px',
                    }} />}
                    title={null}
                    visible={contentModalVisible}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleContentCancel}
                    footer={null}
                    width={900}
                >
                    <div>
                        <div class="m-title">
							<div class="u-type">{this.selectedTopic.type}</div>
							<div class="u-topic">{this.selectedTopic.topic}</div>
							<div class="u-none">{this.selectedTopic.type}</div>
						</div>
                    </div>
                    <div class="m-cont">
                        <div class="dtl"><span class="expln">课题简介:&nbsp;</span>{this.selectedTopic.content}</div>
                        <Switch className="u-switch" checkedChildren="通过选题" unCheckedChildren="提出建议" defaultChecked onChange={this.switchContentAdvise}/>
                        <div>
                            { contentTextAreaVisible && <TextArea className="u-textarea" rows={3} value={advice} onChange={this.adviceChange} placeholder={ModalText}></TextArea>}
                        </div>
                    </div>
                    <div class="m-footer">
                        <Button type="primary" shape="round" onClick={this.handleContentSubmit.bind(this, contentTextAreaVisible, this.props.record.id, advice)}>
                            提交
                        </Button>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default TpActions
