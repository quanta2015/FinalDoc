import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { Table, Tag, Space, Tooltip } from 'antd';
import "./totalSchedule.css"

const phase = ["选题阶段","开题答辩","论文定稿","论文答辩","最终审核"]

const columns = [
	{
		title: '姓名',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: '班级',
		dataIndex: 'class',
		key: 'class',
	},
	{
		title: '课题',
		dataIndex: 'topic',
		key: 'topic',
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
		key: 'teacher',
		dataIndex: 'teacher',
	},
	{
		title: '当前阶段',
		key: 'phase',
		dataIndex: 'phase',
	},
	{
		title: '状态',
		key: 'status',
		render: status => (
			<Tag color={'blue'}>
				通过
			</Tag>
		),
	},
	{
		title: '文件下载',
		key: 'more',
		render: (text, record) => (
			<Space size="middle">
				<a>详情</a>
			</Space>
		),
	},
];

const data = [
	{
		key: '1',
		name: '薛心怡',
		class: '计算机181',
		topic: '关于毕业论文的研究',
		teacher: '周春儿',
		phase: '选题阶段',
		status: ['nice', 'developer'],
		more: ''
	},
];

@inject('manageStore')
@observer
export default class TotalSchedule extends Component {
	render() {
		return (
			<div class="totalSchedule_table">
				<Table columns={columns} dataSource={data} />
			</div>
		);
	}
}
