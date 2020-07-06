import BaseActions from '../../../component/BaseActions';
import OpActions from '../../../component/ContentT/OpActions';
import { inject, observer } from 'mobx-react';
import { computed} from 'mobx';
import Highlighter from 'react-highlight-words';

import {
	Input,
	Space,
	Button,
	Table,
} from 'antd';

import {
	SearchOutlined,
} from '@ant-design/icons';

import * as urls from '../../../constant/urls';

import style from './style.scss';

//test data
const user = {
	id: "20190106"
}

const topicTypes = [
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
]

@inject('userStore')
@observer
export default class Home extends BaseActions {
	constructor(props) {
		super(props)

		@computed
		get usr() {
				return this.props.userStore.usr;
		}

		this.state = {
			subjects: { data: [] },

			//选题查询变量
			searchText: '',
			searchedColumn: '',
		}
	}

	componentWillMount() {
		this.getTopicList()
	}

	// 选题类型筛选
	topicFilter = (value, record) => {
		if (record.type != null)
			return record.type.indexOf(value) === 0;
		else
			return false;
	}

	//选题名称查询
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

	//按钮选题名称查询
	handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		this.setState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex,
		});
	};

	//按钮选题名称重置
	handleReset = clearFilters => {
		clearFilters();
		this.setState({ searchText: '' });
	};	

	//获取数据
	async getTopicList() {
		var data = await this.post(urls.API_SYS_TEACHER_AUDIT_TP_GET_TOPIC_LIST, {
			"uid": this.usr.uid
		});

		this.setState({
			subjects: data
		})
	}

	render(_, { subjects}) {

		const columns = [
			{
				title: '选题类型',
				dataIndex: 'type',
				key: 'type',
				filters: topicTypes,
				onFilter: this.topicFilter,
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
					<OpActions record={record}></OpActions>
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
