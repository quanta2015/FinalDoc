import { Component } from 'preact';
import { inject } from 'mobx-react';
import style from './style';
import { Radio, InputNumber, Select, AutoComplete, Button, message } from 'antd';
const { Option } = Select;

@inject('manageStore')
export default class Home extends Component {
    // constructor(props) {
    //     super(props)

    state = {
        value: 1,
        // uid,value
        tea_name_2: [],
        // id,tid,topic
        topic_name: [],
        // 手动的老师id
        one_tea_name: "123",
        //已选择的老师
        select_teacher: [],
        //已选择的课题
        select_topic: [],
        // 最大可分配课题数目
        maxNum: 10,
        // 分配数目
        num: 0,
    }
    // }

    async componentDidMount() {
        let tea = await this.props.manageStore.getTeaList()
        // console.log(this.state)
        let topic = await this.props.manageStore.getTopicList()
        let teaName = []
        tea.data.map((item) =>
            teaName.push({ tid: item.uid, value: item.uid + " " + item.name })
        )
        // console.log(topic)
        this.setState({ tea_name_2: teaName, topic_name: topic.data }, () => { message.info("ok") });
    }

    // 切换自动手动单选框
    onChange = e => {
        this.setState({
            value: e.target.value,
            select_teacher: [],
            select_topic: [],
            one_tea_name: undefined,
            num: 0
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

    // 提交自动分配
    autoDistribute = () => {
        let result = []
        if (this.state.select_teacher.length === 0) {
            message.info("还未选择审核老师！")
            return;
        }
        let tea_id = []
        this.state.select_teacher.map((item) =>
            tea_id.push(item.split(" ")[0])
        )

        // this.forceUpdate()
    }

    // 提交手动分配
    handDistribute = async () => {
        if (this.state.select_topic.length === 0) {
            message.info("还未选择课题！")
            return;
        }
        let topic_id = []
        this.state.select_topic.map((item) =>
            topic_id.push(parseInt(item.split(" ")[0]))
        )
        let temp = [{"teacher_id":this.state.one_tea_name, "topic_id":topic_id}]
        console.log(temp)
        let res = await this.props.manageStore.allocateTopic(temp);
        if (res && res.code === 200) {
            message.info("分配成功！")
            let topic = await this.props.manageStore.getTopicList()
            this.setState({
                topic_name: topic.data,
            })
        }
        // this.forceUpdate()
        this.setState({
            one_tea_name: "",
            select_topic: [],
        })
    }

    selectOnlyTea = (value) => {
        // console.log(this.name.inputValue)
        let id
        if (value !== "" && value !== undefined) {
            id = value.split(" ")[0];
        } else {
            id = value
        }
        this.setState({
            one_tea_name: id
        }, () => { console.log(this.state.one_tea_name) })

        console.log(this.tea_name)
        // console.log("2"+this.state.one_tea_name)
        console.log("*"+document.getElementsByClassName(".ant-select-selection-item"))
        document.getElementsByClassName(".ant-select-selection-item").innerText = "123"
        console.log("*"+document.getElementsByClassName(".ant-select-selection-item").innerHTML)
    }

    maxNum = (value) => {
        var allSelectTea = this.state.select_teacher.length;
        var allTopic = this.state.topic_name.length;
        var max_num = parseInt(allTopic / allSelectTea);
        this.setState({
            maxNum: max_num,
            num: value
        })
        if (value === max_num) {
            message.info("已到达最大分配数量")
        }
    }

    render() {
        return (
            <div className="main">
                <div className="head">
                    <div className="topicNum">还有<span>{this.state.topic_name.length}篇</span>课题未分配审核</div>
                    <div className="detail"><Button type="primary" href="./m_distributeTopic_detail">审核详情</Button></div>
                </div>
                <div className="choose">
                    <div class="title">分配方式</div>
                    <Radio.Group onChange={this.onChange} value={this.state.value}>
                        <Radio value={1}>自动分配</Radio>
                        <Radio value={2}>手动分配</Radio>
                    </Radio.Group>
                </div>
                {(this.state.value === 1) &&
                    <div>
                        <div>
                            <div class="checkTeacher">
                                <div class="title">审核教师</div>
                                <div class="item">
                                    <Select
                                        mode="multiple"
                                        style={{ width: 320 }}
                                        placeholder="请选择审核教师"
                                        onChange={this.addSelectTeacher}
                                        allowClear
                                    >
                                        {this.state.tea_name_2.map((item, i) =>
                                            <Select.Option key={item.value}>{item.value}</Select.Option>
                                        )}
                                    </Select>
                                    {(this.state.select_teacher.length !== 0) && 
                                        <div class="num">已选{this.state.select_teacher.length}项</div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="checknum">
                            <div className="title">课题数量</div>
                            <InputNumber style={{ width: 320 }} min={1} max={this.state.maxNum} defaultValue={1} onChange={this.maxNum} />
                        </div>
                        <div className="btn">
                            <Button type="primary" onClick={this.autoDistribute}>提交</Button>
                        </div>
                    </div>
                }
                {(this.state.value === 2) &&
                    <div>
                        <div>
                            <div class="checkTeacher">
                                <div class="title">审核教师</div>
                                <Select
                                    allowClear
                                    showSearch
                                    defaultValue={this.state.one_tea_name}
                                    ref={tea_name => this.tea_name = tea_name}
                                    style={{ width: 320 }}
                                    placeholder="请选择审核教师"
                                    optionFilterProp="children"
                                    onChange={this.selectOnlyTea}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {this.state.tea_name_2.map((item, i) =>
                                        <Select.Option key={item.value}>{item.value}</Select.Option>
                                    )}
                                </Select>
                            </div>
                            <div class="checkTopic">
                                <div class="title">审核课题</div>
                                <div class="item">
                                    {(this.state.one_tea_name !== "" && this.state.one_tea_name !== undefined) &&
                                        <Select
                                            mode="multiple"
                                            style={{ width: 320 }}
                                            placeholder="请选择要审核的课题"
                                            allowClear
                                            onChange={this.addSelectTopic}
                                        >
                                            {/* 该老师的课题不能出现在其需要审核的课题中 */}
                                            {this.state.topic_name.map((item, i) =>
                                                // <Select.Option key={item.id + " " + item.topic}>{item.topic}</Select.Option>
                                                (item.tid.toString() !== this.state.one_tea_name) && <Select.Option key={item.id + " " + item.topic}>{item.topic}</Select.Option>
                                            )}
                                        </Select>
                                    }
                                    {/* 还未选择审核教师 */}
                                    {(this.state.one_tea_name === "" || this.state.one_tea_name === undefined) &&
                                        <Select
                                            mode="multiple"
                                            style={{ width: 320 }}
                                            placeholder="请先选择审核老师"
                                            disabled
                                        >
                                        </Select>
                                    }
                                    {(this.state.one_tea_name!== undefined && this.state.select_topic.length !== 0) &&
                                        <div class="num">已选{this.state.select_topic.length}项</div>
                                    }
                                </div>
                            </div>
                            <div className="btn">
                                <Button type="primary" onClick={this.handDistribute}>提交</Button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
