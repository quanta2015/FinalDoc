import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS, autorun } from 'mobx';
import { Radio, Form, Button, message, Select, InputNumber } from 'antd';
import "./defense.scss"
import ManualAllocate from "./manualAllocate.js"
import AutoAllocate from './autoAllocate.js';

@inject('manageStore', 'userStore')
@observer
export default class Defense extends Component {
    state = {
        select_leader: undefined,
        select_member: [],
        new_arr: [],
        value: 1,
        sug_topic: [],
        topic_info: [],
        select_topic: [],
        sug_select: [],
        sug_topic_id:[],
    }

    @computed
    get openDefenseGroup() {
        return this.props.manageStore.openDefenseGroup;
    }

    @computed
    get usr() {
        return this.props.userStore.usr;
    }

    async componentDidMount() {
        await this.props.manageStore.getTeacherList_ogp({ "ide": this.usr.uid });
        await this.props.manageStore.getTopicList_ogp({ "ide": this.usr.uid });

        // this.setState({
        //     sug_select: toJS(this.openDefenseGroup.sug_topic_id)
        // })

    }
    addSelectTeacher = async (value) => {
        console.log(`selected ${value}`);
        this.setState({
            select_leader: value
        })
        if (value===undefined) {
            this.setState({
                sug_topic_id: []
            })
        }
        if (this.state.select_member.length >=2 &&
            value !== undefined
        ) {

            let member_x = []
            this.state.select_member.map((item) => member_x.push(item.split(" ")[0]))
            member_x.push(value.split(" ")[0])

            let temp = { "ide": this.usr.uid, "teacher_id": member_x }
            // console.log(temp, "hello")
            await this.props.manageStore.getSugTopicList_ogp(temp);
            this.setState({
                sug_topic_id: this.openDefenseGroup.sug_topic_id
            })
            //console.log(this.state.sug_topic_id.length,"leng")
            if (this.openDefenseGroup.sug_topic_id.length > 0) {
                message.info("已自动选择课题，可手动修改")
            }
            else if(this.openDefenseGroup.sug_topic_id.length === 0) {
                message.info("未找到可分配课题，可手动添加")
            }
        }

    }

    handleChange = async (value) => {
        //console.log(`selected ${value}`);
        // if (this.state.select_leader === undefined) {
        //     value.pop()
        //     message.info("请先选择组长！")
        // }
        this.setState({
            select_member: value
        })
        if (value.length > 3) {
            value.pop()
            message.info("答辩小组组员不能超过三位！")
        }
        if (value.length < 2) {
            this.setState({
                sug_topic_id: []
            })
        }
        this.setState({
            select_member: value
        })
        //选中后自动选题
        if (this.state.select_leader!==undefined&&
            value.length >= 2
        ) {

            let member_x = []
            value.map((item) => member_x.push(item.split(" ")[0]))
            member_x.push(this.state.select_leader.split(" ")[0])

            let temp = { "ide": this.usr.uid, "teacher_id": member_x }
            // console.log(temp, "hello")
            await this.props.manageStore.getSugTopicList_ogp(temp);
            this.setState({
                sug_topic_id: this.openDefenseGroup.sug_topic_id
            })
            
            if (this.openDefenseGroup.sug_topic_id.length > 0) {
                message.info("已自动选择课题，可手动修改")
            }
            else if (this.openDefenseGroup.sug_topic_id.length === 0) {
                message.info("未找到非本组教师课题，可手动添加")
            }
            
        }
    }

    // handleChangeTopic = (value) => {
    //     //console.log(`selected ${value}`);
    //     if (this.state.select_leader === undefined ||
    //         this.state.select_member.length < 2
    //     ) {
    //         value.pop()
    //         message.info("请至少选择一位组长和两位组员！")
    //     }
    //     this.openDefenseGroup.sug_topic_id = value
    // }

    handleChangeTopic = (value) => {
        console.log(`selected ${value}`);
        if (this.state.select_leader === undefined ||
            this.state.select_member.length < 2
        ) {
            value.pop()
            message.info("请至少选择一位组长和两位组员！")
        }

        this.setState({
            sug_topic_id :value
        })
         
    }

    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    //提交
    totalDistribute = async () => {
        if (this.state.select_leader === undefined ||
            this.state.select_member.length < 2) {
            message.info("请选择一位组长和两位组员")
            return;
        }
        if (this.state.sug_topic_id.length === 0) {
            message.info("请选择课题")
            return;
        }
        let member_x = []
        this.state.select_member.map((item) => member_x.push(item.split(" ")[0]))

        let temp = { "ide": this.usr.uid, "leader_id": this.state.select_leader.split(" ")[0], "teacher_id": member_x, "topic_id": toJS(this.state.sug_topic_id) }
        console.log(temp,"提交")
        let res = await this.props.manageStore.manualAllocateTopic_ogp(temp);
        if (res && res.code === 200) {
            if (res.data[0].err === 0) {
                message.success("成功添加答辩小组！")
            } else {
                message.error("添加答辩小组失败！请重试")
            }

            await this.props.manageStore.getTopicList_ogp({ "ide": this.usr.uid });
            await this.props.manageStore.getTeacherList_ogp({ "ide": this.usr.uid });
            await this.props.manageStore.getGroupList_ogp({ "ide": this.usr.uid });
        } else {
            message.error("添加答辩小组失败！请重试")
        }
        this.clear()
    }


    clear = () => {
        this.setState({
            select_leader: undefined,
            select_member: [],
            sug_topic_id :[]
        })
         
    }
    sugSelect = async () => {


        if (this.state.select_leader === undefined ||
            this.state.select_member.length < 2
        ) {
            message.info("请至少选择一位组长和两位组员！")
            return;
        }

        let member_x = []
        this.state.select_member.map((item) => member_x.push(item.split(" ")[0]))

        let temp = { "ide": this.usr.uid, "leader_id": this.state.select_leader.split(" ")[0], "teacher_id": member_x }
        // console.log(temp)
        await this.props.manageStore.getSugTopicList_ogp();
    }

  
    render() {

        this.state.new_arr = [];
        for (let i of this.openDefenseGroup.teacher_info) {
            if (this.state.select_member.indexOf(i.tid) == -1) {
                this.state.new_arr.push(i);
            }
        }

        return (
            <div class="g-defense">
                <div class="m-group">
                    {/* <div class="title">请选择开题答辩小组成员：</div> */}
                    <div class="m-select">
                        <div class="lable-tea">组长</div>
                        <div>
                                <Select
                                    value={this.state.select_leader}
                                    showSearch
                                    style={{ width: 530 }}
                                    placeholder="请选择教师"
                                    optionFilterProp="children"
                                    defaultActiveFirstOption={false}
                                    onChange={this.addSelectTeacher}
                                    allowClear
                                    // filterOption={(input, option) =>
                                    //     option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    // }
                                    optionLabelProp="label"
                                >
                                    {this.state.new_arr.map((item, i) =>
                                        <Select.Option
                                            label={item.name} key={item.tid}>{item.value}</Select.Option>
                                    )}
                                </Select>
                        </div>
                    </div>
                    <div class="m-select2">
                        <div class="lable-tea">组员</div>
                        <div>
                                <Select
                                    mode="multiple"
                                    style={{ width: 530 }}
                                    placeholder="请选择2-3位教师"
                                    defaultActiveFirstOption={false}
                                    value={this.state.select_member}
                                    onChange={this.handleChange}
                                    optionLabelProp="label"
                                    allowClear
                                >
                                    {this.openDefenseGroup.teacher_info.map((item, i) =>
                                        (item.tid !== this.state.select_leader) && <Select.Option label={item.name}
                                            key={item.tid}>{item.value}</Select.Option>
                                    )}
                                </Select>
                        </div>
                    </div>
                    <div class="info">待分配课题{this.openDefenseGroup.topic_info.length}篇，已选择{this.state.sug_topic_id.length}篇</div>
                    <div class="m-group">
                        {/* <div class="title">请选择参加该组答辩的学生：</div> */}
                        <div class="m-select">
                             
                                <div class="lable">选择课题</div>
                            <div>
                                 
                                <Select
                                    mode="multiple"
                                    style={{ width: 530 }}
                                    placeholder="请选择课题"
                                    defaultActiveFirstOption={false}
                                    // defaultValue={this.openDefenseGroup.sug_topic_id}
                                    value={this.state.sug_topic_id}
                                    onChange={this.handleChangeTopic}
                                    optionLabelProp="label"
                                    allowClear
                                >
                                    {this.openDefenseGroup.topic_info.map((item, i) =>
                                        <Select.Option label={item.topic}
                                            key={item.key}>{item.topic}</Select.Option>
                                    )}
                                </Select>
                            </div>
                            
                        </div>
                        <div className="m-btn-gp">
                            <Button onClick={this.clear}>重置</Button>
                            <Button className="btn-sbm" type="primary" onClick={this.totalDistribute}> 提交</Button>
                        </div>
                        {/* <div class="m-select">
                            <div class="lable">选择方式</div>
                            <div>
                                <Radio.Group onChange={this.onChange} value={this.state.value}>
                                    <Radio value={1}>自动选择</Radio>
                                    <Radio value={2}>手动选择</Radio>
                                </Radio.Group>
                            </div>
                        </div>
                        {(this.state.value === 1) &&
                            <div>
                                <AutoAllocate
                                    select_leader={this.state.select_leader}
                                    select_member={this.state.select_member}
                                    clear={this.clear}
                                />
                            </div>
                        }
                        {(this.state.value === 2) &&
                            <div>
                                <ManualAllocate
                                    select_leader={this.state.select_leader}
                                    select_member={this.state.select_member}
                                    clear={this.clear}
                                />
                            </div>
                        } */}
                    </div>
                </div>

            </div>
        );
    }
}
