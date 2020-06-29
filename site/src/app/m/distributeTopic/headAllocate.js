import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import headAllocate from './headAllocate.css';
import { InputNumber, Select, Button, message, Table } from 'antd';
const { Option } = Select;

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
];

const data = [];
for (let i = 0; i < 46; i++) {
    data.push({
        key: i,
        name: `Edward King ${i}`,
        age: 32,
        address: `London, Park Lane no. ${i}`,
    });
}

@inject('manageStore')
@observer
export default class HeadAllocate extends Component {
    state = {
        selectedRowKeys: [], // Check here to configure the default column
        // tid,value
        teacher_info: [],
        tea_id: "",
        tea_name: undefined,
        // 表格数据
        value: [],
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
        this.setState({ value: this.distributeTopic.topic_info, teacher_info: teaName });
    }

    onSelectChange = selectedRowKeys => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
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
        // const columns = [
        //     {
        //         title: '课题题目',
        //         dataIndex: 'topic',
        //     },
        //     {
        //         title: '出题教师',
        //         dataIndex: 'tName',
        //     },
        //     {
        //         title: '课题研究领域',
        //         dataIndex: 'areas',
        //     },
        //     {
        //         title: '详情',
        //         dataIndex: '',
        //     },
        // ];
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            selections: [
                Table.SELECTION_ALL,
                Table.SELECTION_INVERT,
            ],
        };
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
                <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
            </div>
        );
    }
}
