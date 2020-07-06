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
	Tooltip
} from 'antd';

import {
	CheckOutlined,
	CloseOutlined,
	FileSearchOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;

import * as urls from '../../../constant/urls';


@inject('userStore')
@observer
class TpActions extends BaseActions { 

    constructor(props) {
        super(props)
        this.state = {

            ModalText: "您将反对此命题，请在这里提出您的相关建议：",
            adviceModalVisible: false,
            advice: "",
            
            confirmLoading: false,

            contentModalVisible: false,
            modalSubject: { data: [{ topic: "", content: "", type: "" }] }
        }
    }

    //通过
    yesBtnClick = async (id) => {
		this.post(urls.API_SYS_TEACHER_AUDIT_TP_CHECK_UPDATE_YES, {
			"id": id
		}).then(async(response) => {
            message.success("审题通过 已提交")
            let data = await this.post(urls.API_SYS_TEACHER_AUDIT_TP_GET_TOPIC_LIST, {
				"uid": this.usr.uid
			});
            this.props.changeTopicList(data)
        })
	}

    //提出建议
    showAdviceModal = () => {
		this.setState({
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

		// console.log(id,advice)
		this.post(urls.API_SYS_TEACHER_AUDIT_TP_CHECK_UPDATE_NO, {
			"id": id,
			"content": advice
		}).then((response) => {
			// console.log(response)
			message.success("审题未通过 已提交")
			this.props.getTopicList()
		})

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

    //详情
    async getTopicById(id) {
		var data = await this.post(urls.API_SYS_TEACHER_AUDIT_TP_SEARCH_TOPIC_BY_ID, {
			"userId": this.usr.uid,
			"id": id
		})

		// console.log(data)
		this.setState({
			modalSubject: data
		})
	}

    showContentModal = (id) => {
		this.getTopicById(id)
		this.setState({
			contentModalVisible: true,
		});
	};

	handleContentCancel = () => {
		this.setState({
			contentModalVisible: false,
		});
	};

	render(_,{ModalText, adviceModalVisible, advice, confirmLoading, contentModalVisible, modalSubject}){
        return(
            <Space size="middle">
                <Tooltip placement="top" title="通过">
                    <Button type="link" size="small" shape="circle" icon={<CheckOutlined />} onClick={this.yesBtnClick.bind(this, this.props.record.id)} />
                </Tooltip>

                <Tooltip placement="top" title="提出建议">
                    <Button type="link" size="small" shape="circle" icon={<CloseOutlined />} onClick={this.showAdviceModal} />
                </Tooltip>

                <Tooltip title="详情">
                    <Button type="link" size="small" shape="circle" icon={<FileSearchOutlined />} onClick={this.showContentModal.bind(this, this.props.record.id)} />
                </Tooltip>

                <Modal
                    title="提出建议"
                    visible={adviceModalVisible}
                    onOk={this.handleAdviceOk.bind(this, this.props.record.id, advice)}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleAdviceCancel}
                >
                    <p>{ModalText}</p>
                    <TextArea value={advice} onChange={this.adviceChange}></TextArea>
                </Modal>

                <Modal
                    title="详细内容"
                    visible={contentModalVisible}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleContentCancel}
                    footer={null}
                    width={900}
                >
                    <Descriptions column={2} bordered>
                        <Descriptions.Item label="课题名称">{modalSubject.data[0].topic}</Descriptions.Item>
                        <Descriptions.Item label="课题类型" span={1}>{modalSubject.data[0].type}</Descriptions.Item>
                        <Descriptions.Item label="课题简介" span={2}>{modalSubject.data[0].content}</Descriptions.Item>
                    </Descriptions>
                </Modal>
            </Space>
        )
    }
}

export default TpActions
