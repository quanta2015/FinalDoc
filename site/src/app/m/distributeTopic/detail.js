import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import './detail.css';
import { Table, Tag, Space, message, Modal, Button, Descriptions, Input, Tooltip } from 'antd';

import { SearchOutlined } from '@ant-design/icons';


const paginationProps = {
	showTotal: ((total) => {
		return `共 ${total} 条`;
	}),

	pageSize: 5
}

@inject('manageStore')
export default class Detail extends Component {
	state = {
		filteredInfo: null,
		value: [],//数据
		visible: false,
		own: [],
		tooltipText: "",
		auditcount: [],
		// 是否可以发布课题
		flag: 0,
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

	handleOk = e => {
		console.log(e);
		this.setState({
			visible: false,
		});
	};

	handleCancel = e => {
		console.log(e);
		this.setState({
			visible: false,
		});
	};

	async componentDidMount() {
		let r = await this.props.manageStore.getCheckList()
		let count = await this.props.manageStore.getAuditCount()
		// console.log(r.data)
		r.data.sort(function (a, b) {
			if (a.result < b.result) {
				return -1;
			} else if (a.result > b.result) {
				return 1;
			}
			return 0;
		})
		this.setState({ value: r.data, auditcount: count.data[0] }, () => {
			let text = ""
			let flag = 0
			if (this.state.auditcount.unAudit !== 0 || this.state.auditcount.unPassed !== 0) {
				flag = 0
				text = "还有" + this.state.auditcount.unAudit + "篇课题未审核，" + this.state.auditcount.unPassed + "篇未通过，还不能发布所有课题"
			} else {
				flag = 1
				text = "课题均已通过审核，共"+ this.state.auditcount.Passed +"，可以发布所有课题"
			}
			this.setState({ tooltipText: text, flag: flag })
		});
	}
	render(_, { own }) {
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
					console.log(result);
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
					console.log(tag);
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
		if (own.result == 2) {
			tag = "待审核";
			color = "blue";

		}
		else if (own.result == 1) {
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
					<Tooltip placement="top" title={this.state.tooltipText}>
						{(this.state.flag === 0) &&
							<Button type="primary" disabled>发布课题</Button>
						}
						{(this.state.flag === 1) &&
							<Button type="primary">发布课题</Button>
						}
					</Tooltip>
				</div>
				<Table columns={columns} dataSource={this.state.value} tableLayout='fixed'
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

				<Modal
					title="查看详情"
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}

				>


					<Descriptions
						title=""
						bordered


					>
						<Descriptions.Item label="课题名称" span={3}>{own.topicTOPIC}</Descriptions.Item>
						<Descriptions.Item label="课题简介" span={3}>{own.content}</Descriptions.Item>
						<Descriptions.Item label="审核教师" span={2}>{own.checkTeacher}</Descriptions.Item>
						<Descriptions.Item label="审核状态" ><Tag color={color} >
							{tag}
						</Tag></Descriptions.Item>

						<Descriptions.Item label="审核建议">
							{own.sugg}

						</Descriptions.Item>
					</Descriptions>
				</Modal>
				{/* <div className="back"><Button type="primary" href="./m_distributeTopic">返回</Button></div> */}

			</div>



		);
	}
}


