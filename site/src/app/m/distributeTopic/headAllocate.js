import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import headAllocate from './headAllocate.css';
import { Table, Modal, Select, Descriptions, Input, Button, Space, message, Tooltip, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const paginationProps = {
    showTotal: ((total) => {
        return `共 ${total} 条`;
    }),
    position: ['topRight', 'bottomRight']
}

@inject('manageStore','userStore')
@observer
export default class HeadAllocate extends Component {
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
    get distributeTopic() {
        return this.props.manageStore.distributeTopic;
    }

    @computed
    get usr() {
        return this.props.userStore.usr;
    }

    async componentDidMount() {
        await this.props.manageStore.getTopicList({"ide":this.usr.uid});
        await this.props.manageStore.getTeaList({"ide":this.usr.uid});
        await this.props.manageStore.getAreasList();
        // 获取到教师列表
        this.setState({
            teacher_info: toJS(this.distributeTopic.teacher_info),
            topic_info: toJS(this.distributeTopic.topic_info),
        });
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };
    //模态框
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
                topic_info: toJS(this.distributeTopic.topic_info),
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

    // 给父组件传值
    toParent = () => {
        // console.log(this.props.parent.getChildrenMsg.bind(this, this.state.msg))
        let msg = {checklist_info:toJS(this.state.checklist_info), auditCount:toJS(this.state.auditCount)}
        console.log(msg.auditCount);
        this.props.parent.getChildrenMsg(this, msg)
    }

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
            await this.props.manageStore.getTopicList({"ide":this.usr.uid})
            await this.props.manageStore.getCheckList({"ide":this.usr.uid})
            await this.props.manageStore.getAuditCount()

            this.setState({
                topic_info: toJS(this.distributeTopic.topic_info),
                checklist_info: toJS(this.distributeTopic.checklist_info),
                auditCount: toJS(this.distributeTopic.auditCount),
            },()=>{
                this.toParent()
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
                dataIndex: 'tName',
                key: 'tName',
                ...this.getColumnSearchProps('tName'),
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
                title: '研究领域',
                dataIndex: 'areas',
                key: 'areas',
                filters: toJS(this.distributeTopic.areas_list),
                filterMultiple: false,
                onFilter: (value, record) =>
                    record.areas.indexOf(value) !== -1,

                render: (areas, record) => (
                    <>


                        {
                            // console.log(areas),
                            areas.map((tag, i) => {
                                return (
                                    <Tag color={record.color[i]} >
                                        {tag}
                                    </Tag>
                                );
                            })}
                    </>
                ),
            },
            {
                title: '操作',
                dataIndex: '',
                key: 'topic',
                render: (text, record) => (
                    <Space size="middle">
                        <a onClick={() => this.showModal(record)}>  详情</a>
                    </Space>
                ),
            },
        ];
        return (
            <div>
                <div className="top_box">
                    <div class="checkTeacher">
                        <div class="title">审核教师</div>
                        <Select
                            value={this.state.tea_name}
                            allowClear
                            showSearch
                            defaultActiveFirstOption={false}
                            style={{ width: 400 }}
                            placeholder="请选择审核教师"
                            optionFilterProp="children"
                            onChange={this.selectOnlyTea}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {this.state.teacher_info.map((item, i) =>
                                <Select.Option key={item.tid}>{item.value}</Select.Option>
                            )}
                        </Select>
                    </div>
                    <div className="head_btn">
                        <Button onClick={this.clear} className="clear">重置</Button>
                        <Button type="primary" onClick={this.handDistribute}>提交</Button>
                    </div>
                </div>
                <div className="noTopicNum">{this.distributeTopic.topic_info.length}篇未分配
                            已选{selectedRowKeys.length}篇</div>
                <div className="headAllocate_table">
                    <Table
                        onChange={this.handleChange}
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={this.state.topic_info}
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
