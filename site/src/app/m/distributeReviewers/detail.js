import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import './detail.scss';
import { Table, Tag, Space, message, Modal, Button, Descriptions, Input, Tooltip, Popconfirm } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

import { SearchOutlined, CloseCircleTwoTone } from '@ant-design/icons';


const paginationProps = {
    showTotal: ((total) => {
        return `共 ${total} 条`;
    }),
}



@inject('manageStore', 'userStore')
@observer
export default class Detail extends Component {
    state = {
        filteredInfo: null,
        // value: [],
        visible: false,
        check_visible: false,
        own: [],
    }

    @computed
    get distributeTopic() {
        return this.props.manageStore.distributeTopic;
    }



    @computed
    get usr() {
        return this.props.userStore.usr;
    }

    async componentDidMount() {
        await this.props.manageStore.getCheckList({ "ide": this.usr.uid });
        await this.props.manageStore.getAuditCount({ "ide": this.usr.uid });
        await this.props.manageStore.getJudge({ "ide": this.usr.uid });
        await this.props.manageStore.getJudgeFdDef({ "ide": this.usr.uid });
        

    }

    handleChange = (filters) => {//筛选
        this.setState({
            filteredInfo: filters,
        })
    }
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`输入教师姓名`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        重置
          			</Button>
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        搜索
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
        render: text =>

            text

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

    showModal = (record) => {
        this.setState({
            visible: true,
            own: record,
        });
    };

    showCheckModal = () => {
        this.setState({
            check_visible: true,
        });
    };

    handleCheckCancel = e => {
        this.setState({
            check_visible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

  

    render() {
        let { filteredInfo } = this.state;
        filteredInfo = filteredInfo || {}
        const columns = [
            {
                title: '审核教师',
                dataIndex: 'checkTeacher',
                key: 'checkTeacher',
                ...this.getColumnSearchProps('checkTeacher'),
            },
            {
                title: '课题题目',
                dataIndex: 'topicTOPIC',
                key: 'topicTOPIC',
                ellipsis: {
                    showTitle: false,
                },
                ...this.getColumnSearchProps('topicTOPIC'),
                render: topicTOPIC => (
                    <Tooltip placement="topLeft" title={topicTOPIC}>
                        {topicTOPIC}
                    </Tooltip>
                ),

            },


            {
                title: '审核状态',
                key: 'result',
                dataIndex: 'result',

                filters: [
                    { text: '未通过', value: 0 },
                    { text: '通过', value: 1 },
                    { text: '待审核', value: 2 },
                    { text: '通过', value: 3 },
                    { text: '通过', value: 4 },
                ],

                filterMultiple: false,
                //filteredValue: filteredInfo.result || null,
                onFilter: (value, record) => record.result === value,


                render: result => {
                    // console.log(result);
                    let color = "";
                    let tag = "";
                    if (result === 2) {
                        tag = "待审核";
                        color = "blue"
                    }
                    else if (result === 1) {
                        tag = "通过";
                        color = "green";
                    }
                    else if (result === 0) {
                        tag = "未通过";
                        color = "red"
                    } else if (result === 3) {
                        tag = "通过";
                        color = "green"
                    } else if (result === 4) {
                        tag = "通过";
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
                title: '操作',
                key: 'result',
                dataIndex: 'result',

                render: (text, record) => (
                    <Space size="middle">
                        <a onClick={() => this.showModal(record)}>详情</a>

                    </Space>

                ),
            },
        ]

        let color = "";
        let tag = "";
        if (this.state.own.result === 2) {
            tag = "待审核";
            color = "blue";

        }
        else if (this.state.own.result === 1) {
            tag = "通过";
            color = "green";
        }
        else if (this.state.own.result === 0) {
            tag = "未通过";
            color = "red"
        }
        else if (this.state.own.result === 3) {
            tag = "待学生选择";
            color = "blue"
        }
        else if (this.state.own.result === 4) {
            tag = "有学生选择";
            color = "green"
        }

        return (
            <div className="g-detail">
                <div className="detail_table">
                    <Table columns={columns} dataSource={this.distributeTopic.checklist_info} tableLayout='fixed'
                        onRow={(record) => {
                            return {
                                onClick: () => {
                                    this.state.own = record
                                }
                            }
                        }}
                        onChange={this.handleChange}
                        pagination={paginationProps}
                    />
                </div>
                <Modal
                    title={null}
                    // closeIcon={< CloseCircleTwoTone twoToneColor="#999" style={{
                    // 	fontSize: '28px',
                    // }} />}
                    closable={false}
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    // footer={null}
                    footer={[<Button onClick={this.handleCancel}>关闭</Button>]}
                    width={900}
                    className="g-mod-close"
                >
                    <div class="m-dtl-mod">
                        <div class="m-title">
                            <div class="u-type">{this.state.own.type}</div>
                            <Tooltip title={this.state.own.topicTOPIC}>
                                <div class="u-topic">{this.state.own.topicTOPIC}</div>
                            </Tooltip>
                            <div class="u-tea-name">{this.state.own.teaName}</div>
                        </div>
                        <div class="m-cont">
                            <div class="dtl"><span class="expln">审核状态:</span>
                                {(this.state.own.result === 1) && <Tag color={"green"} >通过</Tag>}
                                {(this.state.own.result === 0) && <Tag color={"red"} >未通过</Tag>}
                                {(this.state.own.result === 2) && <Tag color={"blue"} >待审核</Tag>}
                                {(this.state.own.result === 3) && <Tag color={"blue"} >待学生选择</Tag>}
                                {(this.state.own.result === 4) && <Tag color={"green"} >有学生选择</Tag>}
                            </div>
                            <div class="dtl"><span class="expln">审核建议:</span>
                                {(this.state.own.sugg === null) && <span>无</span>}
                                {(this.state.own.sugg !== null) && <span>{this.state.own.sugg}</span>}
                            </div>
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


