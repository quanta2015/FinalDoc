import BaseActions from '../../../component/BaseActions';

import { inject, observer } from 'mobx-react';
import { computed} from 'mobx';
import {
    Button,
    Input,
    Modal,
    message,
	Descriptions,
	Space,
    Tooltip,
    InputNumber
} from 'antd';

import {
	FileSearchOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;

import * as urls from '../../../constant/urls';

import style from './index.css'

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

	handleCancel = () => {
		this.setState({
			visible: false,
		});
	};

    handleUnchecked = () => {

    }

    handleChecked = () => {

    }

    handleUnsubmitted = () => {
        message.warn("文献综述还未提交");
    }

	render(){
        const {confirmLoading, visible}=this.state;
        return(
            <div>

                <Tooltip title="详情">
                    <Button type="link" size="small" shape="circle" icon={<FileSearchOutlined />} onClick={this.showModal.bind(this, this.props.record.id)} />
                </Tooltip>

                <Modal
                    className="t-ContentT-OpActions-Modal"
                    title="详细内容"
                    visible={visible}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    width={900}
                >
                    <Descriptions column={3} bordered>
                        <Descriptions.Item label="课题名称" span={2}>{this.selectedTopic.topic}</Descriptions.Item>
                        <Descriptions.Item label="课题类型" span={1}>{this.selectedTopic.type}</Descriptions.Item>
                        <Descriptions.Item label="课题简介" span={3}>{this.selectedTopic.content}</Descriptions.Item>
                        <Descriptions.Item label="文档审核" span={3}>
                            <Space size={10}>
                            <Tooltip className="unchecked" title="未审核">
                                <Button className="file_btn" type="dashed">开题报告</Button>
                            </Tooltip> 
                            <Tooltip className="checked" title="已审核">
                                <Button className="file_btn" type="dashed">外文翻译</Button>
                            </Tooltip> 
                            <Tooltip className="unsubmitted" title="未提交">
                                <Button className="file_btn" type="dashed" onClick={this.handleUnsubmitted}>文献综述</Button>
                            </Tooltip>
                            </Space>
                        </Descriptions.Item>
                    </Descriptions>

                    <div className="score_block">
                        <h4 className="score_title">评分: </h4>
                        <InputNumber min={0} max={100} defaultValue={0} />
                    </div>
    
                </Modal>
            </div>
        )
    }
}

export default OpActions
