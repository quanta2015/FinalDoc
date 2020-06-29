import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import headAllocate from './headAllocate.css';
import {  Table,Modal, Select, Descriptions } from 'antd';
const { Option } = Select;

 

@inject('manageStore')
@observer
export default class HeadAllocate extends Component {
    state = {
        selectedRowKeys: [],// Check here to configure the default column
        // tid,value
        teacher_info: [],
        topic_info:[],
        tea_id: "",
        tea_name: undefined,
        visible: false,
        
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
        this.setState({ teacher_info: teaName,
            topic_info: topic });
    }

    

    onSelectChange = (selectedRowKeys) => {
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

    

    render( ) {
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
            },
            {
                title: '出题教师',
                dataIndex: 'tName',
                key: 'tName',
            },
            {
                title: '研究领域',
                dataIndex: 'areas',
                key: 'areas',
            },
            {
                title: '操作',
                dataIndex: '',
                key: 'topic',

                
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
                    
                      />

                 
            </div>
        );
    }
}
