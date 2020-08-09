import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { Table, Space, Popconfirm, Modal, Button, Tooltip, Input, message, Tag } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import "./teaTopicNum.scss"

const paginationProps = {
    showTotal: ((total) => {
        return `共 ${total} 条`;
    }),
}

@inject('manageStore', 'userStore')
@observer
export default class TeaTopicNum extends Component {
    state = {
        searchText: '',
        searchedColumn: '',
    }

    async componentDidMount() {
        await this.props.manageStore.teaTopicNum({ "ide": this.usr.uid });
    }

    @computed
    get usr() {
        return this.props.userStore.usr;
    }

    @computed
    get summary() {
        return this.props.manageStore.summary;
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={"请输入关键字"}
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
                        查找
              </Button>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        重置
              </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
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

    columns = [
        {
            title: '教师姓名',
            dataIndex: 'name',
            key: 'name',
            ...this.getColumnSearchProps('name'),
        },
        {
            title: '出题数量',
            dataIndex: 'all',
            key: 'all',
            sorter: {
                compare: (a, b) => a.all - b.all,
                multiple: 2,
            },
        },
        {
            title: '被选数量',
            dataIndex: 'selected',
            key: 'selected',
            sorter: {
                compare: (a, b) => a.selected - b.selected,
                multiple: 1,
            },
        },
    ];

    render() {
        return (
            <div>
                <div class="g-ttn-tbl">
                    <Table pagination={paginationProps} columns={this.columns} dataSource={toJS(this.summary.tea_topic_num)} />
                </div>
            </div>
        );
    }
}
