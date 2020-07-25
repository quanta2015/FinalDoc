import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS, action } from 'mobx';
import { Table, Modal, Select, Descriptions, Input, Button, Space, message, Tooltip, Tag, Popconfirm } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import "./manualAllocate.css"

const { Option } = Select;

const paginationProps = {
    showTotal: ((total) => {
        return `共 ${total} 条`;
    }),
    // position: ['topRight', 'bottomRight']
}

@inject('manageStore', 'userStore')
@observer
export default class ManualAllocate extends Component {
    state = {
        selectedRowKeys: [],// Check here to configure the default column
        tea_id: "",
        tea_name: undefined,
        visible: false,
        own: [],
        searchText: '',
        searchedColumn: '',
        select_topic: {},
        select_topic2: {
            key: '11',
            sName: '杨薪宏',
            topic: '课题题目课题题目11',
            content: '课题简介课题简介',
            tName: '谢琪',
            classname: '计算机181',

        },
        sug_topic: [],
        sug_topic_key: [],
        topic_info: [],
        new_topic_info: [],
        add_topic: undefined
    };

    @computed
    get openDefenseGroup() {
        return this.props.manageStore.openDefenseGroup;
    }

    @computed
    get usr() {
        return this.props.userStore.usr;
    }

    async componentDidMount() {
        //await this.props.manageStore.getTopicList_ogp({"ide":this.usr.uid});
        this.setState({
            sug_topic: toJS(this.openDefenseGroup.sug_topic),

            topic_info: toJS(this.openDefenseGroup.topic_info)
        })
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };

    //模态框
    showModal = (record) => {
        this.setState({
            visible: true,
            own: record,
        });
    };

    handleCancel = e => {
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

    // 提交手动分配
    manualDistribute = async () => {
        if (this.props.select_leader.length === 0 ||
            this.props.select_member.length < 2) {
            message.info("选择数量不够")
            return;
        }
        let member_x = []
        this.props.select_member.map((item) => member_x.push(item.split(" ")[0]))
        let temp = { "ide": this.usr.uid, "leader_id": this.props.select_leader.split(" ")[0], "teacher_id": member_x, "topic_id": this.state.selectedRowKeys }
        console.log(temp)
        let res = await this.props.manageStore.manualAllocateTopic_ogp(temp);
        if (res && res.code === 200) {
            if (res.data[0].err === 0) {
                message.success("成功添加答辩小组！")
            } else {
                message.error("添加答辩小组失败！请重试")
            }

            await this.props.manageStore.getTopicList_ogp({ "ide": this.usr.uid });
            await this.props.manageStore.getTeacherList_ogp({ "ide": this.usr.uid });
            await this.props.manageStore.getGroupList_ogp({ "ide": this.usr.uid });
        } else {
            message.error("添加答辩小组失败！请重试")
        }
        this.clear()
    }
    clear = () => {
        this.props.clear()
        this.setState({
            selectedRowKeys: [],
        })
    }
    selectTopic = (value, object) => {
        console.log(object, "option")
        this.setState({
            add_topic: value
        });
        this.state.select_topic.key = object.key;
        this.state.select_topic.classname = object.classname;
        this.state.select_topic.tName = object.tName;
        this.state.select_topic.sName = object.sName;
        this.state.select_topic.content = object.content;
        this.state.select_topic.topic = object.topic;
        console.log(this.state.select_topic)
    }
    addTopic = () => {
        this.state.sug_topic.push(this.state.select_topic)
        this.state.sug_topic_key.push(this.state.select_topic.key)
        this.openDefenseGroup.sug_topic = this.state.sug_topic
        this.setState({
            add_topic: undefined,
            select_topic: {}
        })
    }
    handleDelete = (value) => {
        let arr = []
        this.state.sug_topic.map((item, i) => {
            if (item.key !== value) {
                arr.push(item)
            }
        })
        this.setState({
            sug_topic: arr
        })
        this.openDefenseGroup.sug_topic = arr
    };
    render() {
        
        let list = toJS(this.openDefenseGroup.sug_topic)
        this.state.sug_topic_key = []
        for (let i of list) {
            this.state.sug_topic_key.push(i.key)
        }

        this.state.new_topic_info = [];
        for (let i of toJS(this.openDefenseGroup.topic_info)) {
            if (this.state.sug_topic_key.indexOf(i.key) == -1) {
                this.state.new_topic_info.push(i);
            }
        }

       

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
                title: '学生姓名',
                dataIndex: 'sName',
                key: 'sName',
                ...this.getColumnSearchProps('sName'),
            },
            {
                title: '班级',
                dataIndex: 'classname',
                key: 'classname',
                ...this.getColumnSearchProps('classname'),
                ellipsis: {
                    showTitle: false,
                },
                render: classname => (
                    <Tooltip placement="topLeft" title={classname}>
                        {classname}
                    </Tooltip>
                ),
            },
            {
                title: '指导教师',
                dataIndex: 'tName',
                key: 'tName',
                ...this.getColumnSearchProps('tName'),
            },
            {
                title: '操作',
                dataIndex: '',
                key: 'topic',
                render: (text, record) => (
                    <Space size="middle">
                        <a onClick={() => this.showModal(record)}>  详情</a>
                        <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                            <a>Delete</a>
                        </Popconfirm>
                    </Space>
                ),
            },
        ];
        return (
            <div>
                <div class="manu-table">
                    <div>
                        <Select
                            value={this.state.add_topic}
                            showSearch
                            style={{ width: 500 }}
                            placeholder="请选择课题"
                            optionFilterProp="children"
                            defaultActiveFirstOption={false}
                            onChange={this.selectTopic}
                            allowClear
                            // filterOption={(input, option) =>
                            //     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            // }
                            optionLabelProp="label"
                        >
                            {console.log(this.state.new_topic_info, "new"),
                                this.state.new_topic_info.map((item, i) =>
                                    <Select.Option
                                        key={item.key} value={item.topic} topic={item.topic} content={item.content} sName={item.sName} tName={item.tName} classname={item.classname}>{item.topic}</Select.Option>
                                )}
                        </Select>
                        <Button type="primary" onClick={this.addTopic}>
                            添加
                        </Button>
                    </div>

                    <div class="head_info">
                        <div className="noTopicNums">{this.openDefenseGroup.topic_info.length}篇未分配 已选{selectedRowKeys.length}篇</div>
                        <div class="manu-btn">
                            <Button className="reset"
                                onClick={this.clear}>重置</Button>
                            <Button type="primary" onClick={this.manualDistribute}>
                                提交
                        </Button>
                        </div>
                    </div>

                    <div className="ogp_headAllocate_table">
                        <Table
                            onChange={this.handleChange}
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={this.openDefenseGroup.sug_topic}
                            pagination={paginationProps}
                            onRow={(record) => {
                                return {
                                    onClick: () => {
                                        // console.log(record)
                                        this.state.own = record
                                        // console.log(this.state.own)
                                    }
                                }
                            }
                            }
                        />
                    </div>
                </div>
                <Modal
                    title="查看详情"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={null}
                    width="800px"
                >
                    <div class="ogp-descrip">
                        <Descriptions
                            title=""
                            bordered
                        >
                            <Descriptions.Item label="课题名称" span={3}>{this.state.own.topic}</Descriptions.Item>
                            <Descriptions.Item label="课题简介" span={3}>{this.state.own.content}</Descriptions.Item>
                        </Descriptions>
                    </div>
                </Modal>
            </div>
        );
    }
}
