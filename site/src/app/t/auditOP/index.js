import { Component } from 'preact';
import { route } from 'preact-router';
import OpActions from '../../../component/ContentT/OpActions';

import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';

import Highlighter from 'react-highlight-words';

import {
	Input,
	Space,
	Button,
	Table,
	Divider,
	Tag,
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
		return toJS(this.props.teacherStore.auditOP_topicList);
	}

	@computed
	get team() {
		return toJS(this.props.teacherStore.auditOP_team);
	}

	componentWillMount() {
		if (!this.usr.id) {
			route('/')
		}
		this.props.teacherStore.AuditOp_getTopicList( {"uid": this.usr.uid} )
		// this.props.teacherStore.AuditOp_getTeam( {"uid": this.usr.uid} )
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
					<OpActions record={record}></OpActions>
				),
			}
		];

		return (
			<div className="g-content" data-component="t-auditOP">
				<div class="m-title">
					<Divider className="u-divider" orientation="left" plain>
						审核组
					</Divider>
					<div class="u-leader-block">
						组长：<Tag color="#2db7f5">{this.team.leader.name}</Tag>
					</div>
					<div>
						组员：
						{this.team.member.map((item) => 
							<Tag color="#2db7f5">{item.name}</Tag>
						)}
					</div>
				</div>
				<div class="m-main">
					<Table class="m-main-table" columns={columns} dataSource={this.topicList} />
				</div>
			</div>
		);
	}
}
