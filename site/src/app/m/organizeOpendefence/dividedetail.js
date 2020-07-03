import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { Table, Space, Popconfirm, Modal, Button, Tooltip, Input, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './dividedetail.css';

const paginationProps = {
    showTotal: ((total) => {
        return `共 ${total} 条`;
    }),
}

const topic_paginationProps = {
    showTotal: ((total) => {
        return `共 ${total} 条`;
    }),
    showSizeChanger: false,
    pageSize: 5,
}

@inject('manageStore')
@observer
export default class DivideDetail extends Component {
    state = {
        // 点击某个小组详情，模态框中的表格数据
        topic_data: [],
        // 控制模态框的开关
        visible: false,
        // 表格中搜索功能
        searchText: '',
        searchedColumn: '',

        group_list: [],
    }

    // 模态框
    showModal = async (record) => {
        console.log(record.gid)
        let param = { "group_id": record.gid }
        let group_info = await this.props.manageStore.topicDetailList_ogp(param);
        // console.log(group_info)
        this.setState({
            visible: true,
            topic_data: group_info,
        });
    };

    // 表格中的搜索功能
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

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    @computed
    get openDefenseGroup() {
      return this.props.manageStore.openDefenseGroup;
    }

    // 表格中的删除 
    handleDelete = async (key) => {
        let res = await this.props.manageStore.deleteGroup_ogp({"gid":key});
        if(res && res.code === 200){
            message.info("删除成功！")
            await this.props.manageStore.getGroupList_ogp();
            let list = toJS(this.openDefenseGroup.group_list);
            this.toParent(list)
        }else {
            message.info("删除失败！")
        }
        // await this.props.manageStore.getGroupList_ogp();
    };

    // 给父组件传值
    toParent = (msg) => {
        // let msg = { checklist_info: toJS(this.state.checklist_info), auditCount: toJS(this.state.auditCount) }
        // console.log(msg.auditCount);
        this.props.parent.getChildrenMsg(this, msg)
    }

    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '组长',
                dataIndex: 'leader',
                key: 'leader',
                ...this.getColumnSearchProps('leader'),
            },
            {
                title: '组员',
                dataIndex: 'members',
                key: 'members',
                ...this.getColumnSearchProps('members'),
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
                    this.props.group_list.length >= 1 ? (
                        <Popconfirm title="是否删除该小组？" onConfirm={() => this.handleDelete(record.gid)}>
                            <a>删除</a>
                        </Popconfirm>
                    ) : null,
            },
        ];

        const topic_columns = [
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
                // ...this.getColumnSearchProps('topic'),
            },
            {
                title: '学生姓名',
                dataIndex: 'sName',
                key: 'sName',
                ...this.getColumnSearchProps('sName'),
            },
            {
                title: '班级',
                dataIndex: 'class',
                key: 'class',
                ...this.getColumnSearchProps('class'),
            },
            {
                title: '指导老师',
                dataIndex: 'tName',
                key: 'tName',
                ...this.getColumnSearchProps('tName'),
            },
        ];

        return (
            <div>
                <div className="dividedetail">
                    <Table pagination={paginationProps} dataSource={this.props.group_list} columns={columns} />
                </div>

                <div className="dd_modal">
                    <Modal
                        title="答辩课题详情"
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        footer={false}
                        width={800}
                    >
                        <div className="topicdetail">
                            <Table pagination={topic_paginationProps} dataSource={this.state.topic_data} columns={topic_columns} size="small" />
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}