import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import './detail.scss';
import { Table, Tag, Space, message, Modal, Button, Descriptions, Input, Tooltip, Popconfirm } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

import { SearchOutlined, CloseCircleTwoTone } from '@ant-design/icons';


const paginationProps = {
	showTotal: ((total) => {
		return `共 ${total} 条`;
	}),
}



@inject('manageStore', 'userStore')
@observer
export default class Detail extends Component {
	state = {
		filteredInfo: null,
		// value: [],
		visible: false,
		check_visible: false,
		own: [],
	}

	@computed
	get distributeTopic() {
		return this.props.manageStore.distributeTopic;
	}

	@computed
	get usr() {
		return this.props.userStore.usr;
	}

	async componentDidMount() {
		await this.props.manageStore.getCheckList({ "ide": this.usr.uid });
		await this.props.manageStore.getAuditCount({ "ide": this.usr.uid });
		await this.props.manageStore.getJudge({ "ide": this.usr.uid });

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
		this.setState({
			visible: true,
			own: record,
		});
	};

	showCheckModal = () => {
		this.setState({
			check_visible: true,
		});
	};

	handleCheckCancel = e => {
		this.setState({
			check_visible: false,
		});
	};

	handleCancel = e => {
		this.setState({
			visible: false,
		});
	};

	showConfirm = () => {
		confirm({
			title: <div style={{ fontSize: '20px' }}><br />确认后，不能再次发布！<br /><br /></div>,
			icon: <ExclamationCircleOutlined style={{ fontSize: '28px', paddingTop: '30px', paddingLeft: '30px' }} />,
			okText: '确认',
			cancelText: '取消',
			width: 500,

			onOk: () => {
				console.log('OK');
				this.release()
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}

	release = async () => {
		let res = await this.props.manageStore.getRelease({ "ide": this.usr.uid });
		if (res && res.code === 200) {
			message.info("发布成功！")

			await this.props.manageStore.getTopicList({ "ide": this.usr.uid })
			await this.props.manageStore.getCheckList({ "ide": this.usr.uid })
			await this.props.manageStore.getAuditCount({ "ide": this.usr.uid })
			await this.props.manageStore.getJudge({ "ide": this.usr.uid })

			// 状态通知
			/* • 系主任A发布B系的所有课题
				终：所有课题对应的出题教师
				内容：您的课题已被发布  => 课题已发布

				终：所有管理员
				内容：B系已发布课题

				终：所有该系的学生
				内容：您所在系课题已发布，请尽快选定课题  => 课题已发布

				始：（例）课题A带学生B的出题老师C
				终：学生B
				内容：课题《A》双选成功  => 双选成功
			*/
			await this.props.userStore.insertMessageToMany({ "from": this.usr.uid, "to": "topTea", "context": "课题已发布", "type": 0})
			await this.props.userStore.insertMessageToMany({ "from": this.usr.uid, "to": "topStu", "context": "课题已发布", "type": 0})
			await this.props.userStore.insertMessageToMany({ "from": this.usr.uid, "to": "admin", "context": this.usr.maj + "已发布课题", "type": 0})
			await this.props.userStore.insertMessageToMany({ "from": this.usr.uid, "to": "okStu", "context": "双选成功", "type": 1})
			
		} else {
			message.info("发布失败！请重试")
		}
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
					{ text: '待审核', value: 2 },
					{ text: '待学生选题', value: 3 },
					{ text: '有学生选择', value: 4 },
				],

				filterMultiple: false,
				//filteredValue: filteredInfo.result || null,
				onFilter: (value, record) => record.result === value,


				render: result => {
					// console.log(result);
					let color = "";
					let tag = "";
					if (result === 2) {
						tag = "待审核";
						color = "blue"
					}
					else if (result === 1) {
						tag = "通过";
						color = "green";
					}
					else if (result === 0) {
						tag = "未通过";
						color = "red"
					} else if (result === 3) {
						tag = "待学生选题";
						color = "blue"
					} else if (result === 4) {
						tag = "有学生选择";
						color = "green"
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
						<a onClick={() => this.showModal(record)}>详情</a>

					</Space>

				),
			},
		]

		let color = "";
		let tag = "";
		if (this.state.own.result === 2) {
			tag = "待审核";
			color = "blue";

		}
		else if (this.state.own.result === 1) {
			tag = "通过";
			color = "green";
		}
		else if (this.state.own.result === 0) {
			tag = "未通过";
			color = "red"
		}
		else if (this.state.own.result === 3) {
			tag = "待学生选择";
			color = "blue"
		}
		else if (this.state.own.result === 4) {
			tag = "有学生选择";
			color = "green"
		}

		return (
			<div className="g-detail">
				{/* 所有课题审核通过，才可以一键发布课题 */}
				<div className="release_btn">

					{((this.distributeTopic.auditCount.unAudit !== 0 || this.distributeTopic.auditCount.unPassed !== 0 || this.distributeTopic.topic_info.length !== 0 || this.distributeTopic.auditCount.Passed === 0) && this.distributeTopic.judge_info.flag !== 1) &&
						<Tooltip placement="top" title={this.distributeTopic.auditCount.Passed + "篇已通过，" + this.distributeTopic.auditCount.unAudit + "篇未审核，" + this.distributeTopic.auditCount.unPassed + "篇未通过, " + this.distributeTopic.topic_info.length + "篇未分配，不能发布所有课题"}>
							<Button type="primary" disabled >发布课题</Button>
						</Tooltip>
					}
					{(this.distributeTopic.auditCount.unAudit === 0 && this.distributeTopic.auditCount.unPassed === 0 && this.distributeTopic.auditCount.Passed !== 0 && this.distributeTopic.topic_info.length === 0 && this.distributeTopic.judge_info.flag === 0) &&
						// <Popconfirm placement="top" title={"确认后，不能再次发布"} onConfirm={this.release} okText="确认" cancelText="取消">
						<Button type="primary" onClick={this.showConfirm}>发布课题</Button>
						// </Popconfirm>
					}
					{

						(this.distributeTopic.judge_info.flag === 1) &&
						<Button type="primary" disabled>已发布</Button>
					}

				</div>
				<div className="detail_table">
					<Table columns={columns} dataSource={this.distributeTopic.checklist_info} tableLayout='fixed'
						onRow={(record) => {
							return {
								onClick: () => {
									this.state.own = record
								}
							}
						}}
						onChange={this.handleChange}
						pagination={paginationProps}
					/>
				</div>
				<Modal
					title={null}
					// closeIcon={< CloseCircleTwoTone twoToneColor="#999" style={{
					// 	fontSize: '28px',
					// }} />}
					closable={false}
					visible={this.state.visible}
					onCancel={this.handleCancel}
					// footer={null}
					footer={[<Button onClick={this.handleCancel}>关闭</Button>]}
					width={900}
					className="g-mod-close"
				>
					<div class="m-dtl-mod">
						<div class="m-title">
							<div class="u-type">{this.state.own.type}</div>
							<Tooltip title={this.state.own.topicTOPIC}>
								<div class="u-topic">{this.state.own.topicTOPIC}</div>
							</Tooltip>
							<div class="u-tea-name">{this.state.own.teaName}</div>
						</div>
						<div class="m-cont">
							<div class="dtl"><span class="expln">审核状态:</span>
								{(this.state.own.result === 1) && <Tag color={"green"} >通过</Tag>}
								{(this.state.own.result === 0) && <Tag color={"red"} >未通过</Tag>}
								{(this.state.own.result === 2) && <Tag color={"blue"} >待审核</Tag>}
								{(this.state.own.result === 3) && <Tag color={"blue"} >待学生选择</Tag>}
								{(this.state.own.result === 4) && <Tag color={"green"} >有学生选择</Tag>}
							</div>
							<div class="dtl"><span class="expln">审核建议:</span>
								{(this.state.own.sugg === null) && <span>无</span>}
								{(this.state.own.sugg !== null) && <span>{this.state.own.sugg}</span>}
							</div>
							<div class="dtl"><span class="expln">课题简介:</span>{this.state.own.content}</div>
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}


