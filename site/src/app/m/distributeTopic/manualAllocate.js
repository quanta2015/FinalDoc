import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import './manualAllocate.scss';
import { Table, Modal, Select, Descriptions, Input, Button, Space, message, Tooltip, Tag } from 'antd';
import { SearchOutlined, CloseCircleTwoTone } from '@ant-design/icons';

const { Option } = Select;

const paginationProps = {
    showTotal: ((total) => {
        return `共 ${total} 条`;
    }),
    position: ['topRight', 'bottomRight']
}

@inject('manageStore', 'userStore')
@observer
export default class ManualAllocate extends Component {
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
        await this.props.manageStore.getJudge({ "ide": this.usr.uid });
        await this.props.manageStore.getTopicList({ "ide": this.usr.uid });
        await this.props.manageStore.getTeaList({ "ide": this.usr.uid, "status": this.props.status });
        await this.props.manageStore.getAreasList();
        this.setState({
            teacher_info: toJS(this.distributeTopic.teacher_info),
            topic_info: toJS(this.distributeTopic.topic_info),
        });

    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        if (this.state.tea_name === "" || this.state.tea_name === undefined) {
            selectedRowKeys = []
            message.info("请先选择"+this.props.title+"教师！")
        }
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


    // 提交手动分配
    handDistribute = async () => {
        if (this.state.selectedRowKeys.length === 0) {
            message.info("还未选择课题！")
            return;
        }
        let temp = { "teacher_id": this.state.tea_id, "topic_id": this.state.selectedRowKeys, "status":this.props.status}
        console.log(temp)
        let res = await this.props.manageStore.allocateTopic(temp);
        console.log(res)
        if (res && res.code === 200) {
            if (res.data[0].err === 0) {
                message.success("分配成功！")
                await this.props.manageStore.getTopicList({ "ide": this.usr.uid })
                await this.props.manageStore.getCheckList({ "ide": this.usr.uid ,"status":this.props.status})
                await this.props.manageStore.getAuditCount({ "ide": this.usr.uid })

                // 状态通知
                /* • 系主任A分配课题审核
                    始：系主任A
                    终：所有被分配到的老师
                    内容：您已被分配审核课题，请尽快完成   => 课题审核已分配
                */
                // 如果未审核课题数量为0，说明已将课题全部分配，审核课题老师已确定
                if (this.distributeTopic.topic_info.length === 0) {
                    const res = await this.props.userStore.insertMessageToMany({ "from": this.usr.uid, "to": "audTea", "context": "课题"+this.props.title+"已分配", "type": 0 })
                    if (res.code === 200) {
                        console.log("站内信发送成功")
                    } else {
                        console.log("站内信发送失败")
                    }
                }

                this.setState({
                    topic_info: toJS(this.distributeTopic.topic_info),
                });
            } else if (res.data[0].err === 1) {
                message.error("分配失败！请重试")
            }

        } else {
            message.error("分配失败！请重试")
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
                            console.log(areas),
                            areas.map((tag, i) => {
                                return (
                                    <Tag color={record.color[i]} >
                                        {tag}
                                    </Tag>
                                );
                            })
                        }
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
            <div className="g-manual">
                <div className="m-top">
                    <div class="check_teacher">
                        <div class="title">{this.props.title}教师</div>
                        {(this.props.judge === 0) &&
                            <Select
                                value={this.state.tea_name}
                                allowClear
                                showSearch
                                defaultActiveFirstOption={false}
                                style={{ width: 400 }}
                                placeholder={"请选择"+this.props.title+"教师"}
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
                        }
                        {(this.props.judge === 1) &&
                            <Select
                                disabled
                                style={{ width: 400 }}
                                placeholder={this.props.tip}
                            >
                            </Select>
                        }
                    </div>
                    <div className="m-btn">
                        <Button onClick={this.clear} className="clear">重置</Button>
                        <Button type="primary" onClick={this.handDistribute}>提交</Button>
                    </div>
                </div>
                <div className="topic_num">{this.distributeTopic.topic_info.length}篇未分配
                            已选{selectedRowKeys.length}篇
                </div>
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
                                    // console.log(record)
                                    this.state.own = record
                                    // console.log(this.state.own)
                                }
                            }
                        }}
                    />
                </div>

                <Modal
                    title="查看详情"
                    title={null}
                    // closeIcon={< CloseCircleTwoTone twoToneColor="#999" style={{
                    //     fontSize: '28px',
                    // }} />}
                    visible={this.state.visible}
                    closable={false}
                    // onOk={this.handleOk}
                    footer={[<Button onClick={this.handleCancel}>关闭</Button>]}
                    onCancel={this.handleCancel}
                    // footer={null}
                    width={900}
                    className="g-mod-ma"
                >
                    <div class="m-dtl-mod">
                        <div class="m-title">
                            <div class="u-type">{this.state.own.type}</div>
                            <Tooltip title={this.state.own.topic}>
                                <div class="u-topic">{this.state.own.topic}</div>
                            </Tooltip>
                            <div class="u-tea-name">{this.state.own.tName}</div>
                        </div>
                        <div class="m-cont">
                            <div class="dtl">
                                <span class="expln">课题简介:</span>
                                <div className="expln_cnt">{this.state.own.content}</div>
                            </div>
                        </div>

                    </div>
                </Modal>

            </div>
        );
    }
}
