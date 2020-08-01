import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { route } from 'preact-router';
import { Tag, Button, Table, Tooltip, Input, Space, Spin, ConfigProvider } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { SmileOutlined } from '@ant-design/icons';
import { STU_ST_STATUS } from '../../../constant/data';
import InfoDialog from '../../../component/InfoDialog'
import 'antd/dist/antd.css';
import './index.scss'
import { computed, toJS } from 'mobx';

var del = []
var cha = []
const customizeRenderEmpty = () => (
    <div style={{ textAlign: 'center', marginLeft: 300, width: 300 }}>
        <SmileOutlined type="smile" style={{ fontSize: 30, }} />
        <br />
        <p style={{ fontSize: 20 }}>暂无可选课题</p>
    </div>
);

const formatDetailInfo = (rowDetail) => {
    let info = rowDetail;
    info.type = rowDetail.category;
    info.tag = rowDetail.areas.map((item, id) => ({
        name: item,
        color: rowDetail.color[id]
    }))
    return info;
}

@inject('studentStore', 'userStore')
@observer
export default class TopicList extends Component {
    state = {
        visible: false,
        topicList: [],
        rowDetail: null,
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
                    this.setState({
                        topicList: r,
                        isAudi: true,
                    })
                } else {
                    this.props.studentStore.getTopicList({ uid: this.usr.uid })
                        .then(r => {
                            if (r.length) {
                                this.setState({
                                    topicList: r,
                                })
                            }
                        })
                    // this.setState({
                    //     topicList: this.topicList
                    // })
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
        this.setState({
            visible: true,
        });

    };
    handleOk = e => {
        this.setState({
            visible: false,
        });
    };
    handleClick = (record) => {
        let { topicList, isAudi } = this.state;
        if (!isAudi) { // 学生不在审核状态中，此时按钮均为选定，点击后显示一条数据，按钮变为取消，进入审核状态
            for (let i = 0; i < del.length; i++) {
                cha[i] = "取消"
                del[i] = "text"
            }
            topicList[record.key].status = 1
            this.setState({
                isAudi: true,
                topicList: [topicList[record.key]] // 选中后表格中只显示此项
            })
            this.props.studentStore.upStuTopicList({ uid: this.usr.uid, cid: this.state.topicList[record.key].id })
            this.props.userStore.insertMessageToOne({ from: this.usr.uid, to: this.state.topicList[record.key].tid, context: "新学生选择您的课题", type: 2 })
        } else {
            for (let i = 0; i < del.length; i++) {
                cha[i] = "选定"
                del[i] = "primary"
            }
            this.setState({
                loading: true,
                isAudi: false,
            })
            this.props.studentStore.delStuTopicList({ uid: this.usr.uid, cid: this.state.topicList[0].id })
                .then(res => {
                    this.props.studentStore.getTopicList({ uid: this.usr.uid })
                        .then(r => {
                            this.setState({
                                loading: true,
                            })
                            setTimeout(() => {
                                this.setState({
                                    loading: false,
                                    topicList: r,
                                })
                            }, 150)

                        })
                })
            this.props.userStore.insertMessageToOne({ from: this.usr.uid, to: this.state.topicList[0].tid, context: "学生取消选定您的课题", type: 3 })
        }
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
            hideOnSinglePage: true,
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
        const aft_column = [
            {
                title: '指导教师',
                dataIndex: 'instructor',
                key: 'instructor',
            },
            {
                title: '课题名称',
                dataIndex: 'topic',
                key: 'topic',
                ellipsis: {
                    showTitle: false,
                },
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                align: 'center',
                render: d => <span style={{ paddingLeft: 25 }}>
                    <Tag color={STU_ST_STATUS[d] && STU_ST_STATUS[d].color}>{STU_ST_STATUS[d] && STU_ST_STATUS[d].name}</Tag>
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
                {isAudi ? <h3 className="u-title">已选课题</h3> : <h3 className="u-title">课题列表</h3>}
                <Spin spinning={this.state.loading}>
                    <ConfigProvider renderEmpty={customizeRenderEmpty}>
                        {isAudi ?
                            <Table
                                className="g-stu-tb-after"
                                columns={aft_column}
                                dataSource={topicList}
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
                            /> :
                            <Table
                                className="g-stu-tb"
                                columns={columns}
                                dataSource={topicList}
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
                        }
                    </ConfigProvider>
                </Spin>
                <InfoDialog
                    visible={this.state.visible}
                    topic={rowDetail ? formatDetailInfo(rowDetail) : rowDetail}
                    isAudi={isAudi}
                    handleClick={() => this.handleClick(rowDetail)}
                    afterClose={() => this.setState({ visible: false })}
                />
            </div>
        )
    }
}

