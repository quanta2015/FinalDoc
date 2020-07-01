import BaseActions from '../../../component/BaseActions';

import Highlighter from 'react-highlight-words';

import {
	Collapse,
	Button,
	Modal,
	Input,
	message,
	Descriptions,
	Table,
	Space,
	Tooltip
} from 'antd';

import {
	CheckOutlined,
	CloseOutlined,
	FileSearchOutlined,
	SearchOutlined
} from '@ant-design/icons';

import * as urls from '../../../constant/urls'

const { TextArea } = Input;

import style from './style.scss';

//test data
const user = {
	id: "20190117"
}

export default class Home extends BaseActions {
	constructor(props) {
		super(props)

		this.state = {
			subjects: { data: [] },

			ModalText: "您将反对此命题，请在这里提出您的相关建议：",
			adviceModalVisible: false,

			contentModalVisible: false,

			confirmLoading: false,
			advice: "",

			searchText: '',
			searchedColumn: '',

			modalSubject: { data: [{ topic: "", content: "", type: "" }] }
		}
	}

	getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={node => {
						this.searchInput = node;
					}}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Search
			  </Button>
					<Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
						Reset
			  </Button>
				</Space>
			</div>
		),
		filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
		onFilter: (value, record) =>
			record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
		onFilterDropdownVisibleChange: visible => {
			if (visible) {
				setTimeout(() => this.searchInput.select());
			}
		},
		render: text =>
			this.state.searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[this.state.searchText]}
					autoEscape
					textToHighlight={text.toString()}
				/>
			) : (
					text
				),
	});

	handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		this.setState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex,
		});
	};

	handleReset = clearFilters => {
		clearFilters();
		this.setState({ searchText: '' });
	};

	componentWillMount() {
		//获取数据
		this.getTopicList()
	}

	async getTopicList() {
		var data = await this.post(urls.API_SYS_TEACHER_AUDIT_TP_GET_TOPIC_LIST, {
			"uid": user.id
		});
		// console.log(data.data)
		this.setState({
			subjects: data
		})
	}

	async getTopicById(id) {
		var data = await this.post(urls.API_SYS_TEACHER_AUDIT_TP_SEARCH_TOPIC_BY_ID, {
			"userId": user.id,
			"id": id
		})

		// console.log(data)
		this.setState({
			modalSubject: data
		})
	}

	yesBtnClick = async (id) => {

		// console.log(id)
		this.post(urls.API_SYS_TEACHER_AUDIT_TP_CHECK_UPDATE_YES, {
			"id": id
		}).then((response) => {
			// console.log(response)
			message.success("审题通过 已提交")
			this.getTopicList()
		})
	}

	showAdviceModal = () => {
		this.setState({
			adviceModalVisible: true,
		});
	};

	showContentModal = (id) => {
		this.getTopicById(id)
		this.setState({
			contentModalVisible: true,
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
			this.getTopicList()
		})

		setTimeout(() => {
			this.setState({
				adviceModalVisible: false,
				confirmLoading: false,
			});
		}, 500);
	};

	handleAdviceCancel = () => {
		this.setState({
			adviceModalVisible: false,
		});
	};

	handleContentCancel = () => {
		this.setState({
			contentModalVisible: false,
		});
	};

	adviceChange = (e) => {
		this.setState({
			advice: e.target.value
		})
	}

	render(_, { subjects, adviceModalVisible, contentModalVisible, confirmLoading, ModalText, advice, modalSubject }) {

		const columns = [
			{
				title: '选题类型',
				dataIndex: 'type',
				key: 'type',
				filters: [
					{
						text: '毕业设计',
						value: '毕业设计',
					},
					{
						text: '命题设计',
						value: '命题设计',
					},
					{
						text: '软件设计',
						value: '软件设计',
					},
					{
						text: '工程设计',
						value: '工程设计',
					}
				],
				onFilter: (value, record) => {
					// console.log(value,record.type);
					if (record.type != null)
						return record.type.indexOf(value) === 0;
					else
						return false;
				},
			},
			{
				title: '课题题目',
				dataIndex: 'topic',
				key: 'topic',
				...this.getColumnSearchProps('topic'),
			},
			{
				title: '操作',
				render: (text, record) => (
					<Space size="middle">
						<Tooltip placement="top" title="通过">
							<Button type="link" size="small" shape="circle" icon={<CheckOutlined />} onClick={this.yesBtnClick.bind(this, record.id)} />
						</Tooltip>

						<Tooltip placement="top" title="提出建议">
							<Button type="link" size="small" shape="circle" icon={<CloseOutlined />} onClick={this.showAdviceModal} />
						</Tooltip>

						<Tooltip title="详情">
							<Button type="link" size="small" shape="circle" icon={<FileSearchOutlined />} onClick={this.showContentModal.bind(this, record.id)} />
						</Tooltip>

						<Modal
							title="提出建议"
							visible={adviceModalVisible}
							onOk={this.handleAdviceOk.bind(this, record.id, advice)}
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
				),
			}
		];

		return (
			<div className="context">
				<div class="main">
					<Table class="table" columns={columns} dataSource={subjects.data} />
				</div>
			</div>
		);
	}
}
