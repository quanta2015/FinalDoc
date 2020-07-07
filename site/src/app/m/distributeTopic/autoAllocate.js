import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed,toJS } from 'mobx';
import { InputNumber, Select, Button, message } from 'antd';
import "./autoAllocate.css"
const { Option } = Select;

@inject('manageStore','userStore')
@observer
export default class AutoAllocate extends Component {
    state = {
        //已选择的老师
        select_teacher: [],
        // 最大可分配课题数目
        maxNum: 10,
        // 需要选择的老师数量
        teaNum: 0,
        // 分配数目
        num: 8,
        // 已分配情况数量,unAudit未分配,unPassed未通过,Passed已通过
        auditCount: {},
    }

    @computed
    get distributeTopic() {
        return this.props.manageStore.distributeTopic;
    }

    @computed
    get usr() {
        return this.props.userStore.usr;
    }

    async componentDidMount() {
        await this.props.manageStore.getTopicList({"ide":this.usr.uid});
        await this.props.manageStore.getTeaList({"ide":this.usr.uid});
        let tea_num = Math.ceil(this.distributeTopic.topic_info.length / this.state.num);
        this.setState({ teaNum: tea_num });
    }

    addSelectTeacher = (value) => {
        if (value.length > this.state.teaNum) {
            // 删除最后一项
            value.pop()
            message.info("分配审核课题数量为" + this.state.num + "篇，最多只能选择" + this.state.teaNum + "位教师")
        }
        this.setState({
            select_teacher: value,
        })
    }

    // 提交自动分配
    autoDistribute = async () => {
        if (this.state.select_teacher.length === 0) {
            message.info("还未选择审核老师！")
            return;
        }
        let tea_id = []
        this.state.select_teacher.map((item) =>
            tea_id.push(item.split(" ")[0])
        )

        let param = {"ide":this.usr.uid,"number":this.state.num,"teacher_id":tea_id}
        // console.log(param)
        let res = await this.props.manageStore.autoAllocateTopic(param);
        console.log(res)
        if (res && res.code === 200) {
            console.log(res.data[0].result)
            let flag = 1
            let tname = ""
            res.data.map((item)=>{
                if(item.result !== 1){
                    flag = 0
                    tname = item.tName + "," + tname
                }
            })
            if(flag === 0){
                message.info("部分分配成功！但符合"+tname+"老师研究领域的课题不足，可手动分配")
            }else{
                message.info("分配成功！")
            }
            await this.props.manageStore.getTopicList({"ide":this.usr.uid})
            await this.props.manageStore.getCheckList({"ide":this.usr.uid})
            await this.props.manageStore.getAuditCount({"ide":this.usr.uid})
        } else {
            message.info("分配失败！请重试")
        }
        // 清空已选教师列表
        this.setState({
            select_teacher: [],
            num: 8,
            teaNum: Math.ceil(this.distributeTopic.topic_info.length / 8),
        })
        /**************************/
        // await this.props.manageStore.getTopicList({"ide":this.usr.uid})
        /**************************/
    }

    maxNum = (value) => {
        console.log(value)
        var allSelectTea = this.state.select_teacher.length;
        var allTopic = this.distributeTopic.topic_info.length;
        var max_num = parseInt(allTopic / allSelectTea);
        var tea_num = Math.ceil(allTopic / value)
        if (value === null || value === "") {
            tea_num = "*"
        }
        this.setState({
            maxNum: max_num,
            num: value,
            teaNum: tea_num,
        }, () => {

        })
        if (value === max_num) {
            message.info("已到达最大分配数量")
        }
    }

    clear = () => {
        this.setState({
            num: 8,
            teaNum: Math.ceil(this.distributeTopic.topic_info.length / 8),
            select_teacher: []
        })
    }

    render() {
        return (
            <div>
                <div class="info">
                    共<span class="num">{this.distributeTopic.topic_info.length}</span>篇课题&nbsp;&nbsp;
                    每位<InputNumber size="small" value={this.state.num} style={{ width: 50 }} min={1} max={this.state.maxNum} onChange={this.maxNum} />篇&nbsp;&nbsp;
                    请选择<span class="num">{this.state.teaNum}</span>位&nbsp;&nbsp;
                    已选<span class="num">{this.state.select_teacher.length}</span>位
                </div>
                <div class="select_tea">
                    <Select
                        value={this.state.select_teacher}
                        defaultActiveFirstOption={false}
                        ref={selectItem => this.selectItem = selectItem}
                        mode="multiple"
                        style={{ width: 500 }}
                        placeholder="请选择审核教师"
                        onChange={this.addSelectTeacher}
                        optionLabelProp="label"
                        allowClear
                    >
                        {this.distributeTopic.teacher_info.map((item, i) =>
                            <Select.Option label={item.name} key={item.tid}>{item.value}</Select.Option>
                        )}
                    </Select>
                </div>
                <div className="btn">
                    <Button onClick={this.clear} id="clear">重置</Button>
                    <Button type="primary" onClick={this.autoDistribute}>提交</Button>
                </div>
            </div>
        );
    }
}
