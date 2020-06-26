import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { Tag, Button, Table } from 'antd';
import { STU_ST_STATUS } from '../../../constant/data';
import './index.css';
import { computed, toJS } from 'mobx';

// const data = [
//     {
//         key: 0,
//         topic: '基于快速区域卷积神经网络胰腺癌增强CT自动识别系统的建立及临床测试',
//         category: '论文类',
//         instructor: '赵六',
//         status: '——', // 0被拒绝 1待审核 2已通过
//     },
//     {
//         key: 1,
//         topic: '基于快速区域卷积神经网络胰腺癌增强CT自动识别系统的建立及临床测试',
//         category: '理论研究类',
//         instructor: '赵四',
//         status: '——',
//     }, {
//         key: 2,
//         topic: '基于快速区域卷积神经网络胰腺癌增强CT自动识别系统的建立及临床测试',
//         category: '论文类',
//         instructor: '赵六',
//         status: '——',

//     }
// ];
var num = []
var del = []
var cha = []

@inject('studentStore')
@observer
export default class TopicList extends Component {
    state = {
        filteredInfo: null,
        selectedRowKeys: [],
        topicList: []
        // sortedInfo: null,
    }
    @computed
    get topicList() {
        return toJS(this.props.studentStore.topicList);
    }

    componentDidMount() {
        this.props.studentStore.getTopicList()
            .then(r => {
                if (r.length) {
                    this.setState({
                        topicList: r
                    })
                }
            })

    }

    handleChange = (pagination, filters, sorter) => {
        this.setState({
            filteredInfo: filters,
        })
    }
    handleClick = (record) => {
        const selectedRowKeys = [...this.state.selectedRowKeys];
        let { topicList } = this.state;
        if (selectedRowKeys.indexOf(record.key) >= 0) {
            selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
            topicList[record.key].status = '——';
            for (let i = 0; i < num.length; i++) {
                num[i] = false
                cha[i] = "选定"
                del[i] = "primary"
            }
            alert('取消')
        } else {
            selectedRowKeys.push(record.key);
            cha[record.key] = "取消"
            del[record.key] = "text"
            topicList[record.key].status = 1;
            for (let i = 0; i < num.length; i++) {
                if (i !== Number.parseInt(record.key)) {
                    num[i] = true
                }
            }
            alert('选定')
        }
        this.setState({ selectedRowKeys });
    }

    render() {

        let { selectedRowKeys, filteredInfo, topicList } = this.state;

        for (let i = 0; i < topicList.length; i++) {
            num.push(false);
            del.push("primary")
            cha.push("选定")
            topicList[i].status = '——';
        }
        filteredInfo = filteredInfo || {}
        const paginationProps = {
            pageSize: 6
        }
        const columns = [
            {
                title: '课题名称',
                dataIndex: 'topic',
                key: 'topic',
            },
            {
                title: '类别',
                dataIndex: 'category',
                key: 'category',
                filters: [
                    { text: '理论研究类', value: '理论研究类' },
                    { text: '论文类', value: '论文类' }
                ],
                filterMultiple: false,
                filteredValue: filteredInfo.category || null,
                onFilter: (value, record) => (record.category === value),
                // render: 
            },
            {
                title: '指导教师',
                dataIndex: 'instructor',
                key: 'instructor',
                filters: [
                    { text: '赵六', value: '赵六' },
                    { text: '赵四', value: '赵四' }
                ],
                filteredValue: filteredInfo.instructor || null,
                onFilter: (value, record) => (record.instructor === value),
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: d => <span>
                    {
                        typeof (d) === "string" ?
                            <span>{d}</span> :
                            <Tag color={STU_ST_STATUS[d].color}>{STU_ST_STATUS[d].name}</Tag>
                    }
                </span>
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: (text, record) =>
                    <Button type={del[record.key]} onClick={() => this.handleClick(record)} disabled={num[record.key]}>{cha[record.key]}</Button>

            }
        ]
        return (
            <div className="g-table">
                <h3 className="m-title">课题列表</h3>
                <Table
                    tableLayout="fixed"
                    columns={columns}
                    dataSource={this.state.topicList}
                    // dataSource={data}
                    onChange={this.handleChange}
                    rowKey={item => item.id}
                    pagination={paginationProps}
                />
            </div>
        )
    }
}

