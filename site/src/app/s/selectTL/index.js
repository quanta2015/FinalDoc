import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { Router, route } from 'preact-router';
import { Tag, Button, Table, Modal, Descriptions, Tooltip, Input, Space, Spin, ConfigProvider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { SmileOutlined } from '@ant-design/icons';
import { STU_ST_STATUS } from '../../../constant/data';
import 'antd/dist/antd.css';
import './index.scss'
import { computed, toJS } from 'mobx';

var del = []
var cha = []
var tmp = []
var rec = []
var click = 0

const customizeRenderEmpty = () => (
    <div style={{ textAlign: 'center', marginLeft: 300, width: 300 }}>
        <SmileOutlined type="smile" style={{ fontSize: 30, }} />
        <br />
        <p style={{ fontSize: 20 }}>课题尚未发布</p>
    </div>
);
@inject('studentStore', 'userStore')
@observer
export default class TopicList extends Component {
    state = {
        filteredInfo: null,
        visible: false,
        selectedRowKeys: [],
        topicList: [],
        tmpList: [],
        rowDetail: [],
        isAudi: false,
        searchText: '',
        searchedColumn: '',
        loading: false,
    }

    @computed
    get usr() {
        return toJS(this.props.userStore.usr);
    }

    @computed
    get topicList() {
        return toJS(this.props.studentStore.topicList);
    }

    componentDidMount() {
        if (!this.usr.uid) {
            route('/')
        }
        this.props.studentStore.isDurAudit({ uid: this.usr.uid })
            .then(r => {
                if (r && r.length > 0) {
                    tmp = r
                    this.setState({
                        topicList: tmp,
                        isAudi: true,
                    })
                } else {
                    this.props.studentStore.getTopicList({ uid: this.usr.uid })
                        .then(r => {
                            if (r.length) {
                                tmp = r
                                rec = r
                                this.setState({
                                    topicList: tmp,
                                })
                            }
                        })
                }
            })
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`请输入课题名称`}
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
        render: text =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                    text
                ),
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

    showModal = () => {
        click++;
        this.setState({
            visible: true,
        });

    };
    handleOk = e => {
        click++;
        this.setState({
            visible: false,
        });
    };
    handleClick = (record) => {
        const selectedRowKeys = [...this.state.selectedRowKeys];
        let { topicList, isAudi } = this.state;
        if (!isAudi) {
            if (selectedRowKeys.indexOf(0) >= 0) { // 点击取消后
                selectedRowKeys.splice(selectedRowKeys.indexOf(0), 1);
                topicList[record.key].status = '——';
                for (let i = 0; i < del.length; i++) {
                    cha[i] = "选定"
                    del[i] = "primary"
                }
                this.setState({
                    loading: true,
                })
                setTimeout(() => {
                    // 防止数据更改快慢不一
                    let res = rec
                    let flag = false
                    for (let i = 0; i < res.length; i++) {
                        if (tmp[0].instructor === res[i].instructor && tmp[0].topic === res[i].topic) {
                            flag = true
                        }
                    }
                    this.setState({
                        loading: false,
                        topicList: flag ? rec : [...tmp, ...rec]
                    })
                }, 200)
                this.props.studentStore.delStuTopicList({ uid: this.usr.uid, cid: this.state.topicList[0].id })
            } else { // 点击选定后
                selectedRowKeys.push(0);
                for (let i = 0; i < del.length; i++) {
                    cha[i] = "取消"
                    del[i] = "text"
                }
                topicList[record.key].status = 1
                this.setState({
                    tmpList: this.topicList,
                    topicList: [topicList[record.key]] // 选中后表格中只显示此项
                })
                this.props.studentStore.upStuTopicList({ uid: this.usr.uid, cid: this.state.topicList[record.key].id })
            }
        } else {
            this.setState({
                isAudi: false,
            })
            cha[0] = "选定"
            del[0] = "primary"
            topicList[0].status = '——';
            this.props.studentStore.getTopicList({ uid: this.usr.uid })
                .then(r => {
                    tmp[0].status = '——';
                    rec = r;
                    this.setState({
                        loading: true,
                    })

                    setTimeout(() => {
                        // 防止数据更改快慢不一
                        let res = rec
                        let flag = false
                        let item;
                        for (let i = 0; i < res.length; i++) {
                            if (tmp[0].instructor === res[i].instructor && tmp[0].topic === res[i].topic) {
                                flag = true
                                item = res[i]
                            }
                        }
                        if (flag) {
                            rec.splice(rec.indexOf(item), 1)
                        }
                        this.setState({
                            loading: false,
                            topicList: [...tmp, ...rec]
                        })
                    }, 300)

                })
            this.props.studentStore.delStuTopicList({ uid: this.usr.uid, cid: this.state.topicList[0].id })
        }
        this.setState({ selectedRowKeys });
    }

    render() {
        let { topicList, rowDetail, isAudi } = this.state;
        let tea = []
        let tmp = []
        let field = []
        let _field = []
        let area = []
        if (!isAudi) {
            for (let i = 0; i < topicList.length; i++) {
                topicList[i].key = i;
                del.push("primary")
                cha.push("选定")
                if (!tea.includes(topicList[i].instructor)) {
                    tea.push(topicList[i].instructor)
                }
                if (!field.includes(topicList[i].areas)) {
                    field.push(topicList[i].areas)
                }
            }

        } else {
            if (!click) {
                for (let i = 0; i < topicList.length; i++) {
                    topicList[i].key = i;
                    topicList[i].status = 1
                    del.push("text")
                    cha.push("取消")
                    if (!tea.includes(topicList[i].instructor)) {
                        tea.push(topicList[i].instructor)
                    }
                    if (!field.includes(topicList[i].areas)) {
                        field.push(topicList[i].areas)
                    }

                }
            }
        }

        for (let i = 0; i < field.length; i++) {
            for (let j = 0; j < field[i].length; j++) {
                if (!area.includes(field[i][j])) {
                    area.push(field[i][j])
                }
            }
        }
        for (let i = 0; i < tea.length; i++) {
            tmp[i] = { text: tea[i], value: tea[i] }
        }
        for (let i = 0; i < area.length; i++) {
            _field[i] = { text: area[i], value: area[i] }
        }

        const paginationProps = {
            showSizeChanger: false,
            pageSize: 8,
        }
        const columns = [
            {
                title: '指导教师',
                dataIndex: 'instructor',
                key: 'instructor',
                filters: tmp,
                onFilter: (value, record) => record.instructor.indexOf(value) === 0,
            },
            {
                title: '课题名称',
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
                title: '领域',
                dataIndex: 'areas',
                key: 'areas',
                filters: _field,
                onFilter: (value, record) => record.areas.includes(value),
                render: (areas, record) => (
                    <>
                        {
                            areas.map((tag, i) => {
                                return (
                                    <Tag color={record.color[i]}>
                                        {tag}
                                    </Tag>
                                );
                            })}
                    </>
                ),
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: d => <span style={{ paddingLeft: 25 }}>
                    {
                        typeof (d) === "string" ?
                            <span >{d}</span> :
                            <Tag color={STU_ST_STATUS[d] && STU_ST_STATUS[d].color}>{STU_ST_STATUS[d] && STU_ST_STATUS[d].name}</Tag>
                    }
                </span>
            },
            {
                title: '详情',
                dataIndex: 'detail',
                key: 'detail',

                render: (record) =>
                    <a style={{ paddingLeft: 20 }} onClick={() => this.showModal()}>查看</a>
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: (text, record) =>
                    <Button size="small" type={del[record.key]} onClick={() => this.handleClick(record)} >{cha[record.key]}</Button>
            }
        ]
        return (
            <div className="g-stu-sel">
                <h3 className="u-title">课题列表</h3>
                <Spin spinning={this.state.loading}>
                    <ConfigProvider renderEmpty={customizeRenderEmpty}>
                        <Table
                            className="g-stu-table"
                            columns={columns}
                            dataSource={this.state.topicList}
                            rowKey={item => item.id}
                            pagination={paginationProps}
                            onRow={record => {
                                return {
                                    onMouseEnter: e => {
                                        this.state.rowDetail = record
                                    }
                                }
                            }
                            }
                        />
                    </ConfigProvider>
                </Spin>
                <Modal
                    className="g-stu-modal"
                    title="课题详情"
                    visible={this.state.visible}
                    onCancel={this.handleOk}
                    footer={[]}
                    width={900}
                >
                    <Descriptions
                        bordered
                    >
                        <Descriptions.Item label="课题名称" span={3}>{rowDetail.topic}</Descriptions.Item>
                        <Descriptions.Item label="联系方式" span={2}>{rowDetail.phone}</Descriptions.Item>
                        <Descriptions.Item label="指导教师" >{rowDetail.instructor}</Descriptions.Item>
                        <Descriptions.Item label="论文类型" span={2}>{rowDetail.category}</Descriptions.Item>
                        <Descriptions.Item label="研究领域" >{rowDetail.areas && rowDetail.areas.join(',')}</Descriptions.Item>
                        <Descriptions.Item label="课题简介" span={3}><p style={{ letterSpacing: 1, textIndent: 30 }}>{rowDetail.content}</p></Descriptions.Item>
                    </Descriptions>
                </Modal>
            </div>
        )
    }
}

