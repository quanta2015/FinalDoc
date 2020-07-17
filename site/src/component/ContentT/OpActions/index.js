import BaseActions from '../../../component/BaseActions';

import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from "preact-router";
import {
    Button,
    Input,
    Modal,
    message,
    Tooltip,
} from 'antd';

import {
    FileSearchOutlined,
    AuditOutlined,
    CloseCircleTwoTone,
} from '@ant-design/icons';

const { TextArea } = Input;

import style from './index.scss'

@inject('teacherStore', 'userStore')
@observer
class OpActions extends BaseActions { 

    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            confirmLoading: false,
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

    showModal = (id) => {
        this.props.teacherStore.getTopicById({ "userId": this.usr.uid, "id": id })
		this.setState({
			visible: true,
		});
    };
    
    handleContentCancel = () => {
		this.setState({
			visible: false,
		});
	};

    handleAudit = (id) => {
        this.props.teacherStore.getTopicById({ "userId": this.usr.uid, "id": id })
        .then(() => {route("/t_formOP")});
    }

	render(){
        const {confirmLoading, visible}=this.state;
        return(
            <div data-component="t-ContentT-OpActions">
                <Tooltip title="开题审核">
                    <Button type="link" shape="circle" icon={<AuditOutlined />} onClick={this.handleAudit.bind(this, this.props.record.id)} />
                </Tooltip>

                <Tooltip title="详情">
                    <Button type="link" shape="circle" icon={<FileSearchOutlined />} onClick={this.showModal.bind(this, this.props.record.id)} />
                </Tooltip>

                <Modal
                    className="t-ContentT-OpActions-Modal"
                    closeIcon={< CloseCircleTwoTone twoToneColor="#999" style={{
                        fontSize: '28px',
                    }} />}
                    title={null}
                    visible={visible}
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
                    </div>
                </Modal>
            </div>
        )
    }
}

export default OpActions
