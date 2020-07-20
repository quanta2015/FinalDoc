import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import './ass.scss';
import { Table, Modal, Select, Descriptions, Input, Button, Space, message, Tooltip, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Item from 'antd/lib/list/Item';

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

        searchText: '',
        searchedColumn: '',

        // 已分配课题列表
        checklist_info: [],
        // 已分配情况数量,unAudit未分配,unPassed未通过,Passed已通过
        auditCount: {},

        // 点击“详情”,查看该课题任务书内容
        visible: false,
        topic_id: 0,
        topic_type: "",
        topic: "",
        tName: "",
        task: {},
        schedule: [],
        ft: [],

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



    clear = () => {
        this.setState({
            selectedRowKeys: [],
        })
    }



    // 提交手动分配
    reviewTask = async () => {
        if (this.state.selectedRowKeys.length === 0) {
            message.info("还未选择待审核任务书！")
            return;
        }
        let temp = { "topic_id": this.state.selectedRowKeys }
        console.log(temp)
        let res = await this.props.manageStore.reviewTask(temp);
        if (res && res.code === 200) {
            message.success("审核成功！")
            await this.props.manageStore.getTaskList({ "ide": this.usr.uid })

        } else {
            message.error("审核失败！请重试")
        }
        this.setState({
            selectedRowKeys: [],

        })
    }
    openDefense = async () => {
        // let res = await this.props.manageStore.openDefense(temp);
        // if (res && res.code === 200) {
        //     message.success("已进入开题答辩阶段，请分配答辩小组！")
        // } else {
        //     message.error("未进入开题答辩阶段！请重试")
        // }

    }

    showModal = async (record) => {
        // console.log(toJS(record))
        let task = await this.props.manageStore.getTaskContent({ "pid": record.key, "role": this.usr.role })
        //console.log(task)
        this.setState({
            visible: true,
            topic_type: record.type,
            topic_id: record.key,
            topic: record.topic,
            tName: record.name,
            task: toJS(task),
            schedule: toJS(task.schedule),
            ft: toJS(task.ft),
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    render() {
        const { selectedRowKeys } = this.state;

        const rowSelection = {

            selectedRowKeys,
            // onChange: this.onSelectChange,
            onChange: (selectedRowKeys) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`);
                this.setState({ selectedRowKeys });

            },
            getCheckboxProps: record => ({
                disabled: record.tag === "通过" || record.tag === "未提交", // Column configuration not to be checked
            }),
            selections: [
                // Table.SELECTION_ALL,
                // Table.SELECTION_INVERT,
                {
                    key: 'odd',
                    text: '全选待审核任务书',
                    onSelect: () => {
                        this.setState({ selectedRowKeys: toJS(this.reviewPaper.to_audit_list) });
                    },
                },
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
                title: '状态',
                dataIndex: 'tag',
                key: 'tag',
                filters: [
                    { text: '待审核', value: '待审核' },
                    { text: '未提交', value: '未提交' },
                    { text: '通过', value: '通过' },

                ],
                filterMultiple: false,
                onFilter: (value, record) => record.tag === value,
                render: tag => {
                    // console.log(result);
                    let color = "";
                    if (tag === "待审核") {
                        color = "blue"
                    }
                    else if (tag === "未提交") {
                        color = "red";
                    }
                    else if (tag === "通过") {
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
                title: '任务书详情',
                key: 'action',
                render: (text, record) => {
                    if (record.tag !== "未提交") {
                        return (
                            <Space size="middle">
                                <a onClick={() => this.showModal(record)}>查看</a>
                            </Space>
                        )
                    } else {
                        return (
                            <Space size="middle">
                                <Tooltip title="该课题未提交任务书，点击提醒">
                                    <Button size="small">
                                        提醒
                                    </Button>
                                </Tooltip>
                            </Space>
                        )
                    }
                }
                // render: (text, record) => (

                //     <Space size="middle">
                //         <a onClick={() => this.showModal(record)}>查看</a>
                //     </Space>
                // ),
            },

        ];
        return (
            <div class="g-ass">

                <div className="m-ass_top_box">

                    <div className="m-ass_noTopicNum">{this.reviewPaper.to_audit_list.length}篇未审核
                            已选{selectedRowKeys.length}篇</div>
                    <div className="m-ass_head_btn">
                        {
                            (this.reviewPaper.to_audit_list.length === 0 && this.reviewPaper.suc === 0) &&
                            <Button onClick={this.clear} className="ass_clear" disabled>重置</Button>
                        }
                        {
                            (this.reviewPaper.to_audit_list.length === 0 && this.reviewPaper.suc === 0) &&
                            <Button type="primary" disabled>通过</Button>
                        }
                        {
                            (this.reviewPaper.to_audit_list.length > 0) &&
                            <Button onClick={this.clear} className="ass_clear">重置</Button>
                        }
                        {
                            (this.reviewPaper.to_audit_list.length > 0) &&
                            <Button type="primary" onClick={this.reviewTask}>通过</Button>
                        }
                        {
                            (this.reviewPaper.suc === 1) &&
                            <Button type="primary" onClick={this.openDefense}>进入开题答辩阶段</Button>
                        }

                    </div>
                </div>

                <div className="m-ass_table">
                    <Table
                        onChange={this.handleChange}

                        // rowSelection={rowSelection}
                        rowSelection={{
                            // type: selectionType,
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={this.reviewPaper.task_info}
                        pagination={paginationProps}
                    // onRow={(record) => {
                    //     return {
                    //         onClick: () => {
                    //             console.log(record)
                    //             this.state.own = record
                    //             console.log(this.state.own)
                    //         }
                    //     }
                    // }}
                    />
                </div>

                <Modal
                    title={null}
                    closable={false}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    // footer={null}
                    footer={[<Button onClick={this.handleCancel}>关闭</Button>]}
                    width={900}

                    className="g-mod-task"
                >
                    <div class="m-dtl-mod">
                        <div class="m-title">
                            <div class="u-type">{this.state.topic_type}</div>
                            <Tooltip title={this.state.topic}>
                                <div class="u-topic">{this.state.topic}</div>
                            </Tooltip>
                            <div class="u-tea-name">{this.state.tName}</div>
                        </div>
                        <div class="m-cont">
                            <div class="m-f-title">一、内容和要求</div>
                            <div class="m-s-title">1．总体目标及性能（参数）要求</div>
                            <div className="m-cont-item">
                                {this.state.task.target}
                            </div>
                            <div class="m-s-title">2．研究内容及拟采用的技术路线</div>
                            <div class="m-s-title">研究内容：</div>
                            <div className="m-cont-item">
                                {this.state.task.learn_content}
                            </div>
                            <div class="m-s-title">技术路线：</div>
                            <div className="m-cont-item">
                                {this.state.task.technical_route}
                            </div>
                            <div class="m-s-title">3．参考文献</div>
                            <div className="m-cont-item">
                                {this.state.task.reference}
                            </div>
                            <div class="m-f-title">二、起止日期及进度安排</div>
                            <div class="m-s-title">起止日期：</div>
                            <div className="m-cont-item">
                                <div class="u-time">
                                    <div class="u-num">{this.state.ft[0]}</div>
                                    <div>至</div>
                                    <div class="u-num">{this.state.ft[1]}</div>
                                </div>
                            </div>
                            <div class="m-s-title">进度安排：</div>

                            {this.state.schedule.map((item) => {
                                return (
                                    <div className="m-cont-item">
                                        <div className="list">
                                            <div class="u-time">
                                                <div class="u-num">{item.time[0]}</div>
                                                <div>至</div>
                                                <div class="u-num">{item.time[1]}</div>
                                            </div>
                                            <div>{item.content}</div>

                                        </div>
                                    </div>
                                )
                            })}


                        </div>
                    </div>
                </Modal>

            </div>
        );
    }
}
