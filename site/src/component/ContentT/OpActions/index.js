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

import style from './index.css'



@inject('userStore')
@observer
class OpActions extends BaseActions { 

    constructor(props) {
        super(props)
        this.state = {

            passFlag: 0,
            ModalText: "您将反对此命题的开题报告，请在这里提出您的相关建议：",
            adviceModalVisible: false,
            advice: "",
            
            confirmLoading: false,

            contentModalVisible: false,
            modalSubject: { data: [{ topic: "", content: "", type: "" }] }
        }
    }

    @computed
    get usr() {
        return this.props.userStore.usr;
    }

    //提出建议
    showAdviceModal = (flag) => {
        if(flag == 1)
        {
            this.setState({
                adviceModalVisible: true,
                ModalText: "您将通过此命题的开题报告，请在这里提出您的相关建议：",
                passFlag: 1,
            });
        }else{
            this.setState({
                adviceModalVisible: true,
                ModalText: "您将反对此命题的开题报告，请在这里提出您的相关建议：",
                passFlag: 0,
            });
        }
    };
    
    handleAdviceCancel = () => {
		this.setState({
			adviceModalVisible: false,
		});
    };
    
    handleAdviceOk = (id, advice, passFlag) => {
        console.log(id, advice, passFlag)
		// this.setState({
		// 	ModalText: '正在提交相关的建议。',
		// 	confirmLoading: true,
		// });

		// // console.log(id,advice)
		// this.post(urls.API_SYS_TEACHER_AUDIT_TP_CHECK_UPDATE_NO, {
		// 	"id": id,
		// 	"content": advice
		// }).then((response) => {
		// 	// console.log(response)
		// 	message.success("审题未通过 已提交")
		// 	this.getTopicList()
		// })

		// setTimeout(() => {
		// 	this.setState({
		// 		adviceModalVisible: false,
		// 		confirmLoading: false,
		// 	});
		// }, 500);
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

	render(){
        const {ModalText, adviceModalVisible, advice, confirmLoading, contentModalVisible, modalSubject, passFlag} = this.state;
        return(
            <Space size="middle">
                <Tooltip placement="top" title="通过">
                    <Button type="link" size="small" shape="circle" icon={<CheckOutlined />} onClick={this.showAdviceModal.bind(this, 1)} />
                </Tooltip>

                <Tooltip placement="top" title="提出建议">
                    <Button type="link" size="small" shape="circle" icon={<CloseOutlined />} onClick={this.showAdviceModal.bind(this, 0)} />
                </Tooltip>

                <Tooltip title="详情">
                    <Button type="link" size="small" shape="circle" icon={<FileSearchOutlined />} onClick={this.showContentModal.bind(this, this.props.record.id)} />
                </Tooltip>

                <Modal
                    title="提出建议"
                    visible={adviceModalVisible}
                    onOk={this.handleAdviceOk.bind(this, this.props.record.id, advice, passFlag)}
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
                        <Descriptions.Item label="附件下载" span={2}></Descriptions.Item>
                    </Descriptions>
                </Modal>
            </Space>
        )
    }
}

export default OpActions
