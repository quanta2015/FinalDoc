import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { Table, Space, Popconfirm, Modal, Button, Tooltip, Input, message, Tag } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { FILE_DOWNLOAD_TYPE } from '../../../constant/data'
import "./totalSchedule.scss"

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
		// modal开关
		visible: false,
		// 被点击的那一行
		row_file: [],
		row_name: "",
	}



	async componentDidMount() {
		await this.props.manageStore.viewProgress({ "ide": this.usr.uid });
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
	get summary() {
		return this.props.manageStore.summary;
	}

	@computed
	get usr() {
		return this.props.userStore.usr;
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

	showModal = async (record) => {
		let res = await this.props.manageStore.viewFiles({ "topic_id": record.pid });
		console.log(res)
		this.setState({
			visible: true,
			row_file: res[0],
			row_name: record.sName,
		}, () => {
			console.log(this.state.row_file)
		});
	};

	downloadFile = (fileurl, sname, tname) => {
		let params = { file: fileurl, id: sname, name: tname };
		console.log(params)
		this.props.userStore.downloadFile(params)
			.then(r => {
				message.success('下载成功！');
				if (!r) {
					message.error('网络错误');
				}
			})
	}

	test = (a, b, c) => {
		console.log(a, b, c)
	}

	prevFile = (file) => {
		let param = { file: file };
		this.props.manageStore.previewFile(param);
	}

	columns = [
		{
			title: '论文课题',
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
			title: '指导教师',
			key: 'tName',
			dataIndex: 'tName',
			...this.getColumnSearchProps('tName'),
		},
		// {
		// 	title: '当前阶段',
		// 	key: 'phase',
		// 	dataIndex: 'phase',
		// 	filters: phase,
		// 	filterMultiple: false,
		// 	onFilter: (value, record) =>
		// 		record.phase.indexOf(value) !== -1,
		// },
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
				} else if (status === "待审核") {
					color = "blue"
				}
				// console.log(tag);
				return (
					<Tag color={color} >
						{status}
					</Tag>
				)
			}
		},
		// {
		// 	title: '文件下载',
		// 	key: 'more',
		// 	render: (text, record) => (
		// 		<Space size="middle">
		// 			<a onClick={() => this.showModal(record)}>详情</a>
		// 		</Space>
		// 	),
		// },
	];

	render() {
		return (
			<div>
				<div class="g-tol-tbl">
					<Table pagination={paginationProps} columns={this.columns} dataSource={toJS(this.summary.stu_list)} />
				</div>
				<Modal
					title={this.state.row_name + "同学已上交的文件"}
					visible={this.state.visible}
					onCancel={this.handleCancel}
					footer={null}
					width={600}
					className="m-file-mod"
				>
					<div className="m-filemodal">
						{FILE_DOWNLOAD_TYPE.map((item) =>
							<div className="fm-item">
								<h3 className="">{item.stage}</h3>
								{item.file.map((item) =>
									<div className="file-btn">
										{(this.state.row_file[item.type] === null) &&
											<Tooltip placement="top" title="未上传该文件">
												<Button icon={<DownloadOutlined />} size="small" disabled>
													{item.name}
												</Button>
											</Tooltip>
										}
										{(this.state.row_file[item.type] !== null) &&
											<div>
												<Button icon={<DownloadOutlined />} size="small" onClick={() => this.downloadFile(this.state.row_file[item.type], this.state.row_name, item.name)}>
													{item.name}
												</Button>
												<span onClick={() => this.prevFile(this.state.row_file[item.type])}>预览</span>
											</div>
										}
									</div>
								)}
							</div>
						)}
					</div>
				</Modal>
			</div>
		);
	}
}
