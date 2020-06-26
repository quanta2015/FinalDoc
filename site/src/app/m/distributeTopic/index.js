import { Component } from 'preact';
import style from './style';
import { Radio, InputNumber, Select, AutoComplete, Button } from 'antd';

export default class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: 1,
            tea_name: [
                // { id:'0401', value: '张三' },
                { id: '0402', value: '张三' },
                { id: '0403', value: '李四' },
                { id: '0404', value: '王五' },
                { id: '0405', value: '李老师' },
                { id: '0406', value: '王老师' },
                { id: '0407', value: '胡老师' },
                { id: '0408', value: '杨老师' },
                // { value: '0401 张三' },
                // { value: '0402 张三' },
                // { value: '0403 张三' },
                // { value: '0404 张三' },
                // { value: '0405 张三' },
                // { value: '0406 张三' }
            ],
            topic_name: [
                { id: '0001', value: '论文课题1' },
                { id: '0002', value: '论文课题2' },
                { id: '0003', value: '论文课题3' },
                { id: '0004', value: '论文课题4' },
                { id: '0005', value: '论文课题5' },
                { id: '0006', value: '论文课题6' },
                { id: '0007', value: '论文课题7' },
            ],
            select_teacher: [],
            select_topic: [],
        }
    }

    Option = Select;

    onChange = e => {
        this.setState({
            value: e.target.value,
            select_teacher: [],
            select_topic: []
        });
    };

    addSelectTeacher = (value) => {
        console.log(`selected ${value}`);
        this.setState({
            select_teacher: value
        }, () => { console.log(this.state.select_teacher) })
    }

    addSelectTopic = (value) => {
        console.log(`selected ${value}`);
        this.setState({
            select_topic: value
        }, () => { console.log(this.state.select_topic) })
    }

    render() {
        return (
            <div className="main">
                <div><Button type="primary">查看审核详情</Button></div>
                <div className="choose">
                    <Radio.Group onChange={this.onChange} value={this.state.value}>
                        <Radio value={1}>自动分配</Radio>
                        <Radio value={2}>手动分配</Radio>
                    </Radio.Group>
                </div>
                {(this.state.value === 1) &&
                    <div>
                        <div class="checkTeacher">
                            <div class="title">选择审核教师</div>
                            <div class="item">
                                <Select
                                    mode="multiple"
                                    style={{ width: 300 }}
                                    placeholder="请选择审核教师"
                                    onChange={this.addSelectTeacher}
                                    allowClear
                                >
                                    {this.state.tea_name.map((item, i) =>
                                        <Select.Option key={item.id + " " + item.value}>{item.id + "  " + item.value}</Select.Option>
                                    )}
                                </Select>
                                <div class="num">已选{this.state.select_teacher.length}项</div>
                            </div>
                        </div>
                        <div className="checknum">
                            <div className="title">自动分配审核课题数量</div>
                            <InputNumber min={1} max={10} defaultValue={1} />
                        </div>
                        <div>
                            <Button type="primary">提交</Button>
                        </div>
                    </div>
                }
                {(this.state.value === 2) &&
                    <div>
                        <div>
                            <div class="checkTeacher">
                                <div class="title">选择审核教师</div>
                                <AutoComplete
                                    style={{ width: 300 }}
                                    options={this.state.tea_name}
                                    // value={this.state.tea_name.value}
                                    placeholder="请选择审核教师"
                                    allowClear
                                    filterOption={(inputValue, option) =>
                                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                />
                            </div>
                            <div class="checkTopic">
                                <div class="title">选择分配审核课题</div>
                                <div class="item">
                                    <Select
                                        mode="multiple"
                                        style={{ width: 300 }}
                                        placeholder="请选择要审核的课题"
                                        allowClear
                                        onChange={this.addSelectTopic}
                                    >
                                        {this.state.topic_name.map((item, i) =>
                                            <Select.Option key={item.id +" "+ item.value}>{item.id+ " " + item.value}</Select.Option>
                                        )}
                                    </Select>
                                    <div class="num">已选{this.state.select_topic.length}项</div>
                                </div>
                            </div>
                            <div>
                                <Button type="primary">提交</Button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
