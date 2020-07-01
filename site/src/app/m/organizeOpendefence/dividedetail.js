import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { Table, Space, Popconfirm, Modal, Button, Tooltip } from 'antd';
import './dividedetail.css';

const paginationProps = {
    showTotal: ((total) => {
        return `共 ${total} 条`;
    }),
    showSizeChanger: false,
    pageSize: 5,
}

export default class DivideDetail extends Component {
    columns = [
        {
            title: '序号',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: '组长',
            dataIndex: 'leader',
            key: 'leader',
        },
        {
            title: '组员',
            dataIndex: 'member',
            key: 'member',
        },
        {
            title: '答辩课题',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => this.showModal(record)}>详情</a>
                </Space>
            ),
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) =>
                this.state.dataSource.length >= 1 ? (
                    <Popconfirm title="是否删除该小组？" onConfirm={() => this.handleDelete(record.key)}>
                        <a>删除</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    topic_columns = [
        {
            title: '答辩课题',
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
            title: '学生姓名',
            dataIndex: 'sname',
            key: 'sname',
        },
        {
            title: '班级',
            dataIndex: 'class',
            key: 'class',
        },
        {
            title: '指导老师',
            dataIndex: 'tname',
            key: 'tname',
        },
    ];

    state = {
        dataSource: [
            {
                key: '1',
                leader: '周一真',
                member: '王奔，江兵兵，周春儿',
            },
            {
                key: '2',
                leader: '程从玲',
                member: '王子栋，潘虹',
            },
            {
                key: '3',
                leader: '张量',
                member: '张佳，姚茂群，周迪斌',
            },
            {
                key: '4',
                leader: '严彩萍',
                member: '贾中云，丁丹丹，王伟坤',
            },
        ],
        topic_data: [
            {
                key: '1',
                topic: '高校本科毕业设计命题刍探',
                sname: '薛心怡',
                class: '计算机181',
                tname: '丁丹丹',
            },
            {
                key: '2',
                topic: '工科类本科毕业设计指导教学模式探索',
                sname: '杨薪宏',
                class: '计算机181',
                tname: '周一真',
            },
            {
                key: '3',
                topic: '学生毕业论文选题系统的研究与设计',
                sname: '胡晶媛',
                class: '计算机183',
                tname: '周炯',
            },
            {
                key: '4',
                topic: '关于小学英语毕业试卷命题设计的几点思考',
                sname: '汪艺侠',
                class: '计算机183',
                tname: '孙晓燕',
            },
            {
                key: '5',
                topic: '高校本科毕业设计命题刍探',
                sname: '柴海伦',
                class: '计算机183',
                tname: '张乐星',
            },
            {
                key: '6',
                topic: '关于胡晶媛是永远滴神的讨论',
                sname: '李子依',
                class: '计算机183',
                tname: '崔华建',
            },
        ],
        visible: false,
    }

    // 模态框
    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    // 表格中的删除 
    handleDelete = key => {
        const dataSource = [...this.state.dataSource];
        this.setState({
            dataSource: dataSource.filter(item => item.key !== key),
        });
    };

    render() {
        return (
            <div>
                <div className="dividedetail">
                    <Table dataSource={this.state.dataSource} columns={this.columns} />
                </div>


                <Modal
                    title="答辩课题详情"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={false}
                >
                    <div className="topicdetail">
                        <Table pagination={paginationProps} dataSource={this.state.topic_data} columns={this.topic_columns} size="small" />
                    </div>
                </Modal>
            </div>
        );
    }
}