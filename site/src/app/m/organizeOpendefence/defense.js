import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS, autorun } from 'mobx';
import { Radio, Form, Button, message, Select, InputNumber } from 'antd';
import "./defense.scss"
import ManualAllocate from "./manualAllocate.js"
import AutoAllocate from './autoAllocate.js';

@inject('manageStore','userStore')
@observer
export default class Defense extends Component {
    state = {
        select_leader: undefined,
        select_member: [],
        new_arr: [],
        value: 1,
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

    }
    addSelectTeacher = (value) => {
        console.log(`selected ${value}`);
        this.setState({
            select_leader: value
        }, () => { console.log(this.state.select_leader) })

    }

    handleChange = (value) => {
        //console.log(`selected ${value}`);
        if(value.length > 5){
            value.pop()
            message.info("答辩小组成员不能超过五位！")
        }
        this.setState({
            select_member: value
        }, () => { console.log(this.state.select_member) })
    }

    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };
 

    clear = () => {
        this.setState({
            select_leader: undefined,
            select_member: [],
        })
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
                        <div class="title">请选择开题答辩小组成员：</div>
                        <div class="m-select">
                            <div class="lable">组&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长</div>
                            <div>
                                <Select
                                    value={this.state.select_leader}
                                    showSearch
                                    style={{ width: 500 }}
                                    placeholder="请选择教师"
                                    optionFilterProp="children"
                                    defaultActiveFirstOption={false}
                                    onChange={this.addSelectTeacher}
                                    allowClear
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    optionLabelProp="label"
                                >
                                    {this.state.new_arr.map((item, i) =>
                                        <Select.Option
                                            label={item.name} key={item.tid}>{item.value}</Select.Option>
                                    )}
                                </Select>
                            </div>
                        </div>
                        <div class="m-select">
                        <div class="lable">组&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;员</div>
                        <div>
                            <Select
                                mode="multiple"
                                style={{ width: 500 }}
                                placeholder="请选择教师"
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
                    <div class="m-group">
                    <div class="title">请选择参加该组答辩的学生：</div>
                    <div class="m-select">
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
                    }
                </div>
            </div>
                
         </div>
        );
    }
}
