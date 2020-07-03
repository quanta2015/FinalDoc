import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { Table, Modal, Select, Descriptions, Input, Button, Space, message, Tooltip, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import "./manualAllocate.css"

const { Option } = Select;

const paginationProps = {
    showTotal: ((total) => {
        return `共 ${total} 条`;
    }),
    position: ['topRight', 'bottomRight']
}

@inject('manageStore')
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
    };

    @computed
    get distributeTopic() {
        return this.props.manageStore.distributeTopic;
    }

    async componentDidMount() {
        await this.props.manageStore.getTopicList();
        await this.props.manageStore.getTeaList();
        await this.props.manageStore.getAreasList();
        // console.log(toJS(this.distributeTopic.areas_list))
        // 获取到教师列表
        let tea = this.distributeTopic.teacher_info;
        let topic = toJS(this.distributeTopic.topic_info);
        // console.log(topic[1].areas.split(","))
        // 将教师列表值变为id+name
        let teaName = []
        let topicList = []




        topic.map((item) =>
            topicList.push({
                key: item.key, tid: item.tid, tName: item.tName, topic: item.topic, content: item.content,
                areas: item.areas.split(","),
                color: item.color.split(",")
            })
        )


        tea.map((item) =>
            teaName.push({ tid: item.uid + " " + item.maj + "-" + item.Tname + "-" + item.areas, value: item.maj + "-" + item.Tname + "-" + item.areas })
        )
        teaName.sort(function (a, b) {
            if (a.value < b.value) {
                return 1;
            } else if (a.value > b.value) {
                return -1;
            }
            return 0;
        })

        this.setState({
            teacher_info: teaName,
            topic_info: topicList
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
            /******************** */
            let topic = toJS(this.distributeTopic.topic_info);
            let topicList = []
            topic.map((item) =>
                topicList.push({
                    key: item.key, tid: item.tid, tName: item.tName, topic: item.topic, content: item.content,
                    areas: item.areas.split(","),
                    color: item.color.split(",")
                })
            )
            /******************** */
            // 清空选择课题列表
            this.setState({
                selectedRowKeys: [],
                topic_info: topicList,
            })
        }
        this.setState({
            tea_id: id,
            tea_name: value
        }, () => {
            /******************** */
            let topic = toJS(this.distributeTopic.topic_info);
            let topicList = []
            topic.map((item) =>
                topicList.push({
                    key: item.key, tid: item.tid, tName: item.tName, topic: item.topic, content: item.content,
                    areas: item.areas.split(","),
                    color: item.color.split(",")
                })
            )
            /******************** */
            // let topiclist = toJS(this.distributeTopic.topic_info);
            let newlist = [];
            console.log("1 " + topicList.length)
            topicList.map((item, i) => {
                if (item.tid !== this.state.tea_id) {
                    newlist.push(item);
                }
            })

            console.log("2 " + newlist.length)

            this.setState({
                topic_info: newlist,
            })
        })
    }

    clear = () => {
        this.setState({
            selectedRowKeys: [],
            tea_id: "",
            tea_name: undefined,
            topic_info: toJS(this.distributeTopic.topic_info),
        })
    }

    // 提交手动分配
    handDistribute = async () => {
        if (this.state.selectedRowKeys.length === 0) {
            message.info("还未选择课题！")
            return;
        }
        let temp = [{ "teacher_id": this.state.tea_id, "topic_id": this.state.selectedRowKeys }]
        console.log(temp)
        let res = await this.props.manageStore.allocateTopic(temp);
        if (res && res.code === 200) {
            message.info("分配成功！")
            await this.props.manageStore.getTopicList();
            // 获取到教师列表
            let topic = this.distributeTopic.topic_info;
            this.setState({
                topic_info: topic
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
                 
                    
                <div className="noTopicNums">{this.distributeTopic.topic_info.length}篇未分配
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
