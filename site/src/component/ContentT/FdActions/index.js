import BaseActions from '../../../component/BaseActions';

import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from "preact-router";
import {
    Button,
    Modal,
    message,
    Tooltip,
} from 'antd';

import {
    FileSearchOutlined,
    AuditOutlined,
} from '@ant-design/icons';

import style from './index.scss'

@inject('teacherStore', 'userStore')
@observer
class FdActions extends BaseActions { 

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
        this.props.teacherStore.auditFD_checkedTopic = id;
        route("/t_formFD");
    }

	render(){
        const {confirmLoading, visible}=this.state;
        return(
            <div data-component="t-ContentT-FdActions">
                <Tooltip title="评阅">
                    <Button type="link" shape="circle" icon={<AuditOutlined />} onClick={this.handleAudit.bind(this, this.props.record.id)} />
                </Tooltip>

                <Tooltip title="详情">
                    <Button type="link" shape="circle" icon={<FileSearchOutlined />} onClick={this.showModal.bind(this, this.props.record.id)} />
                </Tooltip>

                <Modal
                    className="t-ContentT-FdActions-Modal"
                    title={null}
                    visible={visible}
                    confirmLoading={confirmLoading}
                    footer={[
                        <Button key="back" onClick={this.handleContentCancel}>
                            关闭
                        </Button>,
                    ]}
                    closable={false}
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

export default FdActions
