import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { Table, Space, Popconfirm, Modal, Button, Tooltip, Input, message, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import "./totalSchedule.css"

const paginationProps = {
	showTotal: ((total) => {
		return `共 ${total} 条`;
	}),
}

const phase = [
	{ text: '选题阶段', value: '选题阶段' },
	{ text: '开题答辩', value: '开题答辩' },
	{ text: '论文定稿', value: '论文定稿' },
	{ text: '论文答辩', value: '论文答辩' },
	{ text: '最终审核', value: '最终审核' }
]

@inject('manageStore', 'userStore')
@observer
export default class TotalSchedule extends Component {
	state = {
		// 表格中搜索功能
		searchText: '',
		searchedColumn: '',

		visible: false,
	}

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

	handleCancel = e => {
		console.log(e);
		this.setState({
			visible: false,
		});
	};

	@computed
	get viewProgress() {
		return this.props.manageStore.viewProgress;
	}

	@computed
	get usr() {
		return this.props.userStore.usr;
	}

	async componentDidMount() {
		await this.props.manageStore.getViewProgress({ "ide": this.usr.uid });
	}

	// 表格中的搜索功能
	getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={node => {
						this.searchInput = node;
					}}
					placeholder={`请输入关键字查询`}
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
						搜索
                    </Button>
					<Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
						重置
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
		render: text => text
	});

	showModal = (record) => {
		console.log(record)
		this.setState({
			visible: true,
		});
	};

	columns = [
		{
			title: '姓名',
			dataIndex: 'sName',
			key: 'sName',
			...this.getColumnSearchProps('sName'),
		},
		{
			title: '班级',
			dataIndex: 'class',
			key: 'class',
			...this.getColumnSearchProps('class'),
		},
		{
			title: '课题',
			dataIndex: 'topic',
			key: 'topic',
			...this.getColumnSearchProps('topic'),
			ellipsis: {
				showTitle: false,
			},
			render: topic => (
				<Tooltip placement="topLeft" title={topic}>
					{topic}
				</Tooltip>
			),
		},
		{
			title: '指导教师',
			key: 'tName',
			dataIndex: 'tName',
			...this.getColumnSearchProps('tName'),
		},
		{
			title: '当前阶段',
			key: 'phase',
			dataIndex: 'phase',
			filters: phase,
			filterMultiple: false,
			onFilter: (value, record) =>
				record.phase.indexOf(value) !== -1,
		},
		{
			title: '状态',
			key: 'status',
			dataIndex: 'status',
			render: status => {
				let color = "";
				if (status === "已选题" || status === "已通过") {
					color = "green"
				} else if (status === "未选题" || status === "未通过") {
					color = "red"
				}
				// console.log(tag);
				return (
					<Tag color={color} >
						{status}
					</Tag>
				)
			}
		},
		{
			title: '文件下载',
			key: 'more',
			render: (text, record) => (
				<Space size="middle">
					<a onClick={() => this.showModal(record)}>详情</a>
				</Space>
			),
		},
	];

	render() {
		return (
			<div>
				<div class="totalSchedule_table">
					<Table pagination={paginationProps} columns={this.columns} dataSource={toJS(this.viewProgress.stu_list)} />
				</div>
				<Modal
					title="查看详情"
					visible={this.state.visible}
					onCancel={this.handleCancel}
					footer={null}
				>
					<div>123</div>
				</Modal>
			</div>
		);
	}
}
