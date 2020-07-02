import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import './detail.css';
import { Table, Tag, Space, message, Modal, Button, Descriptions, Input, Tooltip } from 'antd';

import { SearchOutlined } from '@ant-design/icons';


const paginationProps = {
	showTotal: ((total) => {
		return `共 ${total} 条`;
	}),
}

@inject('manageStore')
@observer
export default class Detail extends Component {
	state = {
		filteredInfo: null,
		// value: [],
		visible: false,
		own: [],
	}
	handleChange = (filters) => {//筛选
		this.setState({
			filteredInfo: filters,
		})
	}
	getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={node => {
						this.searchInput = node;
					}}
					placeholder={`输入教师姓名`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
						重置
          			</Button>
					<Button
						type="primary"
						onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						搜索
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

			text

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

	showModal = (record) => {
		console.log(record.topicTOPIC)
		this.setState({
			visible: true,
			own: record,
		});
	};

	handleCancel = e => {
		console.log(e);
		this.setState({
			visible: false,
		});
	};

	@computed
	get distributeTopic() {
		return this.props.manageStore.distributeTopic;
	}

	render() {
		let { filteredInfo } = this.state;
		filteredInfo = filteredInfo || {}
		const columns = [
			{
				title: '审核教师',
				dataIndex: 'checkTeacher',
				key: 'checkTeacher',
				...this.getColumnSearchProps('checkTeacher'),
			},
			{
				title: '课题题目',
				dataIndex: 'topicTOPIC',
				key: 'topicTOPIC',
				ellipsis: {
					showTitle: false,
				},
				...this.getColumnSearchProps('topicTOPIC'),
				render: topicTOPIC => (
					<Tooltip placement="topLeft" title={topicTOPIC}>
						{topicTOPIC}
					</Tooltip>
				),

			},


			{
				title: '审核状态',
				key: 'result',
				dataIndex: 'result',

				filters: [
					{ text: '未通过', value: 0 },
					{ text: '通过', value: 1 },
					{ text: '待审核', value: 2 }
				],

				filterMultiple: false,
				//filteredValue: filteredInfo.result || null,
				onFilter: (value, record) => record.result === value,


				render: result => {
					// console.log(result);
					let color = "";
					let tag = "";
					if (result == 2) {
						tag = "待审核";
						color = "blue"
					}
					else if (result == 1) {
						tag = "通过";
						color = "green";
					}
					else {
						tag = "未通过";
						color = "red"
					}
					// console.log(tag);
					return (
						<Tag color={color} >
							{tag}
						</Tag>
					)
				}

			},
			{
				title: '操作',
				key: 'result',
				dataIndex: 'result',

				render: (text, record) => (
					<Space size="middle">
						<a onClick={() => this.showModal(record)}>  详情</a>

					</Space>

				),
			},
		]

		let color = "";
		let tag = "";
		if (this.state.own.result == 2) {
			tag = "待审核";
			color = "blue";

		}
		else if (this.state.own.result == 1) {
			tag = "通过";
			color = "green";
		}
		else {
			tag = "未通过";
			color = "red"
		}


		return (
			<div>
				{/* 所有课题审核通过，才可以一键发布课题 */}
				<div className="release">
					<Tooltip placement="top" title={this.props.tooltipText}>
						{(this.props.flag === 0) &&
							<Button type="primary" disabled>发布课题</Button>
						}
						{(this.props.flag === 1) &&
							<Button type="primary">发布课题</Button>
						}
					</Tooltip>
				</div>
				<div className="detail_table">
					<Table columns={columns} dataSource={this.props.checklist_info} tableLayout='fixed'
						onRow={(record) => {
							return {
								onClick: () => {
									console.log(record)
									this.state.own = record
									console.log(this.state.own)
								}
							}
						}}
						onChange={this.handleChange}
						pagination={paginationProps}
					/>
				</div>
				<Modal
					title="查看详情"
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					footer={null}
				>
					<Descriptions
						title=""
						bordered
					>
						<Descriptions.Item label="课题名称" span={3}>{this.state.own.topicTOPIC}</Descriptions.Item>
						<Descriptions.Item label="课题简介" span={3}>{this.state.own.content}</Descriptions.Item>
						<Descriptions.Item label="出题教师" >{this.state.own.teaName}</Descriptions.Item>
						<Descriptions.Item label="审核教师" >{this.state.own.checkTeacher}</Descriptions.Item>
						<Descriptions.Item label="审核状态" ><Tag color={color} >
							{tag}
						</Tag></Descriptions.Item>

						<Descriptions.Item label="审核建议">
							{this.state.own.sugg}
						</Descriptions.Item>
					</Descriptions>
				</Modal>
			</div>
		);
	}
}


