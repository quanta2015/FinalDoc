import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import './ass.css';
import { Table, Modal, Select, Descriptions, Input, Button, Space, message, Tooltip, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const paginationProps = {
    showTotal: ((total) => {
        return `共 ${total} 条`;
    }),
    position: ['bottomRight']
}

@inject('manageStore', 'userStore')
@observer
export default class Ass extends Component {
    state = {
        selectedRowKeys: [],// Check here to configure the default column
        // tid,value
        teacher_info: [],
        topic_info: [],
        tea_id: "",
        tea_name: undefined,
        visible: false,
        own: [],
        searchText: '',
        searchedColumn: '',

        // 已分配课题列表
        checklist_info: [],
        // 已分配情况数量,unAudit未分配,unPassed未通过,Passed已通过
        auditCount: {},

    };

    @computed
    get reviewPaper() {
        return this.props.manageStore.reviewPaper;
    }

    @computed
    get usr() {
        return this.props.userStore.usr;
    }

    async componentDidMount() {
        await this.props.manageStore.getTaskList({ "ide": this.usr.uid });
    }


    // 搜索框功能
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

    selectOnlyTea = (value) => {
        let id
        if (value !== "" && value !== undefined) {
            id = value.split(" ")[0];
        } else {
            id = value
            // 清空选择课题列表
            this.setState({
                selectedRowKeys: [],
                topic_info: toJS(this.state.topic_info),
            })
        }
        this.setState({
            tea_id: id,
            tea_name: value
        }, () => {
            let topic = toJS(this.distributeTopic.topic_info);
            let newlist = [];
            topic.map((item, i) => {
                if (item.tid !== this.state.tea_id) {
                    newlist.push(item);
                }
            })

            this.setState({
                topic_info: newlist,
            })
        })
    }

    clear = () => {
        let topic = toJS(this.distributeTopic.topic_info);
        this.setState({
            selectedRowKeys: [],
            tea_id: "",
            tea_name: undefined,
            topic_info: topic,
        })
    }
    
    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };


    // 提交手动分配
    handDistribute = async () => {
        if (this.state.selectedRowKeys.length === 0) {
            message.info("还未选择课题！")
            return;
        }
        let temp = { "teacher_id": this.state.tea_id, "topic_id": this.state.selectedRowKeys }
        console.log(temp)
        let res = await this.props.manageStore.allocateTopic(temp);
        if (res && res.code === 200) {
            message.info("分配成功！")
            await this.props.manageStore.getTopicList({ "ide": this.usr.uid })
            await this.props.manageStore.getCheckList({ "ide": this.usr.uid })
            await this.props.manageStore.getAuditCount({ "ide": this.usr.uid })
            console.log(this.distributeTopic.topic_info.length)
            this.setState({
                topic_info: toJS(this.distributeTopic.topic_info),
            });
        } else {
            message.info("分配失败！请重试")
        }
        this.setState({
            selectedRowKeys: [],
            tea_id: "",
            tea_name: undefined,
        })
    }

    render() {
        const { selectedRowKeys } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            selections: [
                Table.SELECTION_ALL,
                Table.SELECTION_INVERT,
            ],
        };

        const columns = [
            {
                title: '出题教师',
                dataIndex: 'name',
                key: 'name',
                ...this.getColumnSearchProps('name'),
            },
            {
                title: '课题题目',
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
                title: '操作',
                dataIndex: '',
                key: 'topic',
                render: (text, record) => (
                    <Space size="middle">
                        <a > 下载</a>
                    </Space>
                ),
            },
        ];
        return (
            <div>

                <div className="ass_top_box">

                    <div className="ass_noTopicNum">{this.reviewPaper.task_info.length}篇未审核
                            已选{selectedRowKeys.length}篇</div>
                    <div className="ass_head_btn">
                        <Button onClick={this.clear} className="ass_clear">重置</Button>
                        <Button type="primary" onClick={this.handDistribute}>通过</Button>
                    </div>
                </div>

                <div className="ass_table">
                    <Table
                        onChange={this.handleChange}
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={this.reviewPaper.task_info}
                        pagination={paginationProps}
                        onRow={(record) => {
                            return {
                                onClick: () => {
                                    console.log(record)
                                    this.state.own = record
                                    console.log(this.state.own)
                                }
                            }
                        }}
                    />
                </div>

                <Modal
                    title="查看详情"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    width={900}
                >
                    <Descriptions
                        title=""
                        bordered
                    >
                        <Descriptions.Item label="课题名称" span={3}>{this.state.own.topic}</Descriptions.Item>
                        <Descriptions.Item label="课题简介" span={3}>{this.state.own.content}</Descriptions.Item>
                    </Descriptions>
                </Modal>

            </div>
        );
    }
}
