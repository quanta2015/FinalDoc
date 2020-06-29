import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import headAllocate from './headAllocate.css';
import { Table, Modal, Select, Descriptions,Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

const paginationProps = {
	showTotal: ((total) => {
		return `共 ${total} 条`;
	}),
}

@inject('manageStore')
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

    };




     

    @computed
    get distributeTopic() {
        return this.props.manageStore.distributeTopic;
    }



    async componentDidMount() {
        await this.props.manageStore.getTopicList();
        await this.props.manageStore.getTeaList();
        // 获取到教师列表
        let tea = this.distributeTopic.teacher_info;
        let topic = this.distributeTopic.topic_info;
        // 将教师列表值变为id+name
        let teaName = []


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
        // console.log(topic)
        this.setState({
            teacher_info: teaName,
            topic_info: topic
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
//===============================

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
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
                        Search
              </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
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
            // this.state.searchedColumn === dataIndex ? (
            //     <Highlighter
            //         highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            //         searchWords={[this.state.searchText]}
            //         autoEscape
            //         textToHighlight={text.toString()}
            //     />
            // ) : (
            //         text
            //     ),
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
            // this.setState({
            //     select_topic: []
            // })
        }
        this.setState({
            tea_id: id,
            tea_name: value
        }, () => { console.log(this.state.tea_id, this.state.tea_name) })
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
                title: '课题题目',
                dataIndex: 'topic',
                key: 'topic',
                ...this.getColumnSearchProps('topic'),
            },
            {
                title: '出题教师',
                dataIndex: 'tName',
                key: 'tName',
                ...this.getColumnSearchProps('tName'),
            },
            {
                title: '研究领域',
                dataIndex: 'areas',
                key: 'areas',
                ...this.getColumnSearchProps('areas'),
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
                <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.topic_info}
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
                        <Descriptions.Item label="课题简介" span={3}>{this.state.own.content}</Descriptions.Item>
                         
                    </Descriptions>
                </Modal>

            </div>
        );
    }
}
