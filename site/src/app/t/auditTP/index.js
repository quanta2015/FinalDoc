import { Component } from 'preact';
import TpActions from '../../../component/ContentT/TpActions';

import { route } from 'preact-router';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';

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

import './style.scss';

@inject('teacherStore', 'userStore')
@observer
export default class Home extends Component {
	constructor(props) {
		super(props)
		this.state = {

			topicTypes: null,
			//选题查询变量
			searchText: '',
			searchedColumn: '',
		}
	}

	@computed
	get usr() {
		return this.props.userStore.usr;
	}

	@computed
	get topicList() {
		return toJS(this.props.teacherStore.auditTP_topicList);
	}

	componentWillMount() {
		if (!this.usr.id) {
			route('/')
		}
		this.props.teacherStore.AuditTp_getTopicList( {"uid": this.usr.uid} )
		this.props.teacherStore.getAllTopic().then(()=>{
			this.setState({
				topicTypes:this.props.teacherStore.topicTypes
			})
		});
		
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

	render() {
		const columns = [
			{
				title: '选题类型',
				dataIndex: 'type',
				key: 'type',
				filters: this.state.topicTypes,
				onFilter: this.props.teacherStore.topicFilter,
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
					<TpActions record={record}></TpActions>
				),
			}
		];

		return (
			<div className="g-content" data-component="t-auditTP">
				<div class="m-main">
					<Table class="m-main-table" columns={columns} dataSource={this.topicList} />
				</div>
			</div>
		);
	}
}
