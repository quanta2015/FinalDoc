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
        // uid,name
        // tea_name: [],
        // uid,value
        tea_name_2: [],
        // id,tid,topic
        topic_name: [],
        // 手动的老师id
        one_tea_name: "",
        select_teacher: [],
        select_topic: [],
        // 最大可分配课题数目
        maxNum: 10,
        // 分配数目
        num: 0,
        flag:true,
        temp:0,
        allTopic:[]
    }
    // }

    async componentDidMount() {
        let tea = await this.props.manageStore.getTeaList()
        console.log(this.state)
        let topic = await this.props.manageStore.getTopicList()
        let teaName = []
        tea.data.map((item) =>
            teaName.push({ tid: item.uid, value: item.uid + " " + item.name })
        )
        // console.log(topic)
        this.setState({ tea_name_2: teaName, topic_name: topic.data }, () => { message.info("ok") });
    }

    // Option = Select;

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
        // console.log(this.ref.topic)
    }

    // 提交自动分配
    autoDistribute = () => {
        let result = []
        if (this.state.select_teacher.length === 0) {
            message.info("还未选择审核老师！")
            return;
        }
        let tea_id = []
        this.state.select_teacher.map((item)=>
            tea_id.push(item.split(" ")[0])
        )
        console.log("***"+this.state.topic_name)
        for(let i=0;i<tea_id.length;i++){
            let item = {"tea_id":tea_id[i],"topic_id":this.distributeTopic(tea_id,this.state.num)}
            result.push(item)
        }
        console.log(result)
    }

    distributeTopic = (teaid,num) => {
        let topic = [];
        let newAllTopic = this.state.select_topic;
        let i = 0;
        while(topic.length <= num){
            if(newAllTopic[i].tid !== teaid){
                topic.push(parseInt(newAllTopic[i].id))
                newAllTopic.splice(i);
            }
            i++;
        }
        return topic;
    }

    // 提交手动分配
    handDistribute = async () => {
        if(this.state.select_topic.length === 0){
            message.info("还未选择课题！")
            return;
        }
        let topic_id = []
        this.state.select_topic.map((item)=>
            topic_id.push(parseInt(item.split(" ")[0]))
        )
        // let temp = [{"teacher_id":this.state.one_tea_name, "topic_id":topic_id}]
        let temp = [{"teacher_id":this.state.one_tea_name, "topic_id":topic_id[0]}]
        
        let res = await this.props.manageStore.allocateTopic(temp);
        if (res && res.code === 200) {
            this.message.info("分配成功！")
            let topic = await this.props.manageStore.getTopicList()
            this.setState({
                topic_name: topic.data,
                
            })
        }

        this.setState({
            one_tea_name: "",
            select_topic: [],
        })
        // console.log(this.ref.topic)
        this.forceUpdate()
    } 

    selectOnlyTea = (value) => {
        let id
        if (value !== "" && value !== undefined) {
            id = value.split(" ")[0];
        } else {
            id = value
        }
        this.setState({
            one_tea_name: id
        }, () => { console.log(this.state.one_tea_name) })
        console.log(this.name)
    }

    maxNum = (value) => {
        var allSelectTea = this.state.select_teacher.length;
        var allTopic = this.state.topic_name.length;
        var max_num = parseInt(allTopic / allSelectTea);
        this.setState({
            maxNum: max_num,
            num: value
        })
        if(value === max_num){
            message.info("已到达最大分配数量")
        }
    }

    render() {
        return (
            <div className="main">
                <div className="topicNum">还有<span>{this.state.topic_name.length}篇</span>课题未分配审核</div>
                <div className="detail"><Button type="primary">查看审核详情</Button></div>
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
                                <div class="title">选择审核教师</div>
                                <div class="item">
                                    <Select
                                        mode="multiple"
                                        style={{ width: 300 }}
                                        placeholder="请选择审核教师"
                                        onChange={this.addSelectTeacher}
                                        allowClear
                                    >
                                        {this.state.tea_name_2.map((item, i) =>
                                            <Select.Option key={item.value}>{item.value}</Select.Option>
                                        )}
                                    </Select>
                                    <div class="num">已选{this.state.select_teacher.length}项</div>
                                </div>
                            </div>
                        </div>
                        <div className="checknum">
                            <div className="title">自动分配审核课题数量</div>
                            <InputNumber style={{ width: 300 }} min={1} max={this.state.maxNum} defaultValue={1} onChange={this.maxNum} />
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
                                <div class="title">选择审核教师</div>
                                <AutoComplete
                                    // ref="name"
                                    ref={name => this.name = name}
                                    style={{ width: 300 }}
                                    options={this.state.tea_name_2}
                                    placeholder="请选择审核教师"
                                    allowClear
                                    filterOption={(inputValue, option) =>
                                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }
                                    onChange={this.selectOnlyTea}
                                />
                            </div>
                            <div class="checkTopic">
                                <div class="title">选择分配审核课题</div>
                                <div class="item">
                                    {(this.state.one_tea_name !== "" && this.state.one_tea_name !== undefined) &&
                                        <Select
                                            
                                            mode="multiple"
                                            style={{ width: 300 }}
                                            placeholder="请选择要审核的课题"
                                            allowClear
                                            onChange={this.addSelectTopic}
                                        >
                                            {/* 该老师的课题不能出现在其需要审核的课题中 */}
                                            {this.state.topic_name.map((item, i) => 
                                                // <Select.Option key={item.id + " " + item.topic}>{item.topic}</Select.Option>
                                                (item.tid.toString() !== this.state.one_tea_name) && <Select.Option key={item.id +  " " + item.topic}>{item.topic}</Select.Option>
                                            )}
                                        </Select>
                                    }
                                    {/* 还未选择审核教师 */}
                                    {(this.state.one_tea_name === "" || this.state.one_tea_name === undefined) &&
                                        <Select
                                            mode="multiple"
                                            style={{ width: 300 }}
                                            placeholder="请先选择审核老师"
                                            disabled
                                        >
                                        </Select>
                                    }
                                    <div class="num">已选{this.state.select_topic.length}项</div>
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
