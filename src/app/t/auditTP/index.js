import SearchBar from '../../../component/ContentT/SearchBar';
import BaseActions from '../../../component/BaseActions';

import { Collapse, Button, Modal, Input} from 'antd';

const { Panel } = Collapse;
const { TextArea } = Input;

import style from './style.scss';

//test data
const user={
	id: "20040070"
}

export default class Home extends BaseActions {
	constructor(props) {
		super(props)
		
        this.state = {
			subjects: {data: []},
			subjectCategorys: {data: []},
			ModalText: "您将反对此命题，请在这里提出您的相关建议：",
			visible: false,
			confirmLoading: false,
			advice: ""
		}
	}

	async componentWillMount() {
		//获取数据
		var data1 = await this.post("http://www.hanhuikrkr.com:8090/auditTp/getTopicList",{
			"uid": user.id
		});

		var data2 = await this.post("http://www.hanhuikrkr.com:8090/auditTp/getTopicTypes",{
			"uid": user.id
		});

		this.setState({
			subjects: data1,
			subjectCategorys: data2
		})
	}

	dataChange = (result, newSubjects) =>{
		this.setState({
			subjects: newSubjects
		})
	}

	yesBtnClick = (id) =>{
		// console.log(id)
		this.post("http://www.hanhuikrkr.com:8090/auditTp/checkUpdataYes",{
			"id": id
		})
	}

	showModal = () => {
		this.setState({
		  visible: true,
		});
	};
	
	handleOk = (id, advice) => {
		this.setState({
			ModalText: '正在提交相关的建议。',
			confirmLoading: true,
		});
		
		// console.log(id,advice)
		this.post("http://www.hanhuikrkr.com:8090/auditTp/checkUpdataNo",{
			"id": id,
			"content": advice
		})

		setTimeout(() => {
			this.setState({
				visible: false,
				confirmLoading: false,
		  	});
		}, 500);
	};
	
	handleCancel = () => {
		this.setState({
			visible: false,
		});
	};

	adviceChange = (e) =>{
		this.setState({
			advice: e.target.value
		})
	}

	render(_,{ subjects,subjectCategorys, visible, confirmLoading, ModalText, advice }) {
		return (
			<div className="g-home">
				<SearchBar subjectCategorys={subjectCategorys} dataChange={this.dataChange}/>
				<Collapse>
					{subjects.data.map( (subject) => 
						<Panel header={subject.topic} key={subject.id}>
							<p>{subject.content}</p>
							<div>
								<span>选题类型: {subject.type}</span>
							</div>
	
							<div class="btn_group">
								<Button style="margin-right:5px" type="primary" size="small" onClick={this.yesBtnClick.bind(this,subject.id)}>通过</Button>
								<Button size="small" onClick={this.showModal}>提出意见</Button>

								<Modal
									title="提出建议"
									visible={visible}
									onOk={this.handleOk.bind(this,subject.id,advice)}
									confirmLoading={confirmLoading}
									onCancel={this.handleCancel}
								>
								<p>{ModalText}</p>
								<TextArea value={advice} onChange={this.adviceChange}></TextArea>
								</Modal>
							</div>
						</Panel>
					)}
				</Collapse>
			</div>
		);
	}
}
