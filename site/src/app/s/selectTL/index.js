import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { Tag, Button, Table, Modal, Descriptions, Tooltip } from 'antd';
import { STU_ST_STATUS } from '../../../constant/data';
import 'antd/dist/antd.css';
import './index.css';
import { computed, toJS } from 'mobx';

var num = []
var del = []
var cha = []
var tmp = []
var areas = []
var color = []
var rec = []
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
        isBack: false,
    }
    @computed
    get usr() {
        return this.props.userStore.usr;
    }
    @computed
    get topicList() {
        return toJS(this.props.studentStore.topicList);
    }

    componentDidMount() {
        this.props.studentStore.isDurAudit({ uid: this.usr.uid })
            .then(r => {
                if (r) {
                    r.map((item) => {
                        areas.push(item.areas.split(","))
                        color.push(item.color.split(","))

                        tmp.push({
                            key: item.key, id: item.id, instructor: item.instructor, topic: item.topic, content: item.content,
                            phone: item.phone, status: item.status, status_: item.status_, category: item.category, sid: item.sid,
                            areas: item.areas.split(","),
                            color: item.color.split(",")
                        })
                    })

                    this.setState({
                        topicList: tmp,
                        isAudi: true,
                    }, () => {
                        console.log("in audit");
                        r.map((item) => {
                            areas.push(item.areas.split(","))
                            color.push(item.color.split(","))
                        })
                    })
                } else {
                    this.props.studentStore.getTopicList()
                        .then(r => {
                            let topic = []
                            if (r.length) {
                                r.map((item) => {
                                    areas.push(item.areas.split(","))
                                    color.push(item.color.split(","))
                                    tmp.push({
                                        key: item.key, id: item.id, instructor: item.instructor, topic: item.topic, content: item.content,
                                        phone: item.phone, status: item.status, status_: item.status_, category: item.category, sid: item.sid,
                                        areas: item.areas.split(","),
                                        color: item.color.split(",")
                                    })
                                })
                                this.setState({
                                    topicList: tmp,
                                }, () => {
                                    console.log('not audit')
                                    r.map((item) => {
                                        areas.push(item.areas.split(","))
                                        color.push(item.color.split(","))
                                    })
                                })
                            }
                        })
                }
            })
    }

    showModal = (record) => {
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
        const selectedRowKeys = [...this.state.selectedRowKeys];
        let { topicList, isAudi, tmpList } = this.state;
        if (!isAudi) {
            if (selectedRowKeys.indexOf(0) >= 0) { // 点击取消后
                selectedRowKeys.splice(selectedRowKeys.indexOf(0), 1);
                topicList[record.key].status = '——';
                for (let i = 0; i < num.length; i++) {
                    num[i] = false
                    cha[i] = "选定"
                    del[i] = "primary"
                }
                this.setState({
                    topicList: [...tmp, ...rec]
                }, () => {
                    console.log('this is length', this.state.topicList.length, 'this is key status', topicList[0].status, 'this is key', record.key);

                })
                this.props.studentStore.delStuTopicList({ uid: this.usr.uid, cid: this.state.topicList[0].id })

                console.log('del');
                console.log('sel', selectedRowKeys)
            } else { // 点击选定后
                selectedRowKeys.push(0);
                for (let i = 0; i < num.length; i++) {
                    cha[i] = "取消"
                    del[i] = "text"
                }
                topicList[record.key].status = 1
                this.setState({
                    tmpList: this.topicList,
                    topicList: [topicList[record.key]] // 选中后表格中只显示此项
                }, () => {
                    console.log('this is length', this.state.topicList.length, 'this is key status', topicList[record.key].status, 'this is key', record.key);
                })
                this.props.studentStore.upStuTopicList({ uid: this.usr.uid, cid: this.state.topicList[record.key].id })
                console.log('up');
                console.log('sel', selectedRowKeys)
            }
        } else {
            this.setState({
                isAudi: false,
            })

            cha[0] = "选定"
            del[0] = "primary"
            topicList[0].status = '——';
            console.log('this is tpls', this.state.topicList);
            this.props.studentStore.getTopicList()
                .then(r => {
                    tmp[0].status = '——';
                    r.map((item) => {
                        rec.push({
                            key: item.key, id: item.id, instructor: item.instructor, topic: item.topic, content: item.content,
                            phone: item.phone, status: item.status, status_: item.status_, category: item.category, sid: item.sid,
                            areas: item.areas.split(","),
                            color: item.color.split(",")
                        })
                    })
                    this.setState({
                        topicList: [...tmp, ...rec]
                    }, () => {
                        console.log('t topicl', tmp)
                        topicList[0].status = '——';
                    })
                })
            this.props.studentStore.delStuTopicList({ uid: this.usr.uid, cid: this.state.topicList[0].id })
        }
        this.setState({ selectedRowKeys });
    }

    render() {

        let { selectedRowKeys, topicList, rowDetail, isAudi } = this.state;
        console.log('this is new', topicList)
        let tea = []
        let tmp = []
        let field = []
        let _field = []
        let area = []
        if (!isAudi) {
            for (let i = 0; i < topicList.length; i++) {
                topicList[i].key = i;
                num.push(false);
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
                num.push(false);
                del.push("text")
                cha.push("取消")
                topicList[i].status = 1
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
            showSizeChanger: false,
            pageSize: 6,
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
                onFilter: (value, record) => record.areas.indexOf(value) === 0,
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
                    <a style={{ paddingLeft: 20 }} onClick={() => this.showModal(record)}>查看</a>
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
            <div className="g-table">
                <h3 className="m-title">课题列表</h3>
                <Table
                    // tableLayout="fixed"
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
                <Modal
                    title="课题详情"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleOk}
                    footer={[
                        <Button key="submit" type="primary" onClick={this.handleOk}>确定</Button>
                    ]}
                >
                    <Descriptions
                        bordered
                    >
                        <Descriptions.Item label="课题名称" span={3}>{rowDetail.topic}</Descriptions.Item>
                        <Descriptions.Item label="联系方式" span={2}>{rowDetail.phone}</Descriptions.Item>
                        <Descriptions.Item label="指导教师" >{rowDetail.instructor}</Descriptions.Item>
                        <Descriptions.Item label="论文类型" span={2}>{rowDetail.category}</Descriptions.Item>
                        <Descriptions.Item label="研究领域" >{rowDetail.areas}</Descriptions.Item>
                        <Descriptions.Item label="课题简介" span={3}><p style={{ letterSpacing: 1, textIndent: 30 }}>{rowDetail.content}</p></Descriptions.Item>
                    </Descriptions>
                </Modal>
            </div>
        )
    }
}

