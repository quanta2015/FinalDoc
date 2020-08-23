import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed,toJS } from 'mobx';
import { InputNumber, Select, Button, message } from 'antd';
import "./autoAllocate.scss"
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
        await this.props.manageStore.getJudge({"ide":this.usr.uid});
        await this.props.manageStore.getTopicList({"ide":this.usr.uid});
        await this.props.manageStore.getTeaList({ "ide": this.usr.uid, "status":1});
        // if (this.distributeTopic.topic_info.length < this.state.num){
        //     this.state.num = this.distributeTopic.topic_info.length
        //     this.setState({
        //         num: this.distributeTopic.topic_info.length,
        //     })
        // }
        // let tea_num = 0
        // if(this.state.num !== 0){
        //     tea_num = Math.ceil(this.distributeTopic.topic_info.length / this.state.num);
        // }
        let tea_num = Math.ceil(this.distributeTopic.topic_info.length / this.state.num);
        
        this.setState({ teaNum: tea_num });
    }

    addSelectTeacher = (value) => {
        if (value.length > this.state.teaNum) {
            // 删除最后一项
            value.pop()
            message.info("分配"+this.props.title+"课题数量为" + this.state.num + "篇，最多只能选择" + this.state.teaNum + "位教师")
        }
        this.setState({
            select_teacher: value,
        })
    }

    // 提交自动分配
    autoDistribute = async () => {
        if (this.state.select_teacher.length === 0) {
            message.info("还未选择"+this.props.title+"老师！")
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

            // 状态通知
            /* • 系主任A分配课题审核
                始：系主任A
                终：所有被分配到的老师
                内容：您已被分配审核课题，请尽快完成   => 课题审核已分配
            */
           // 如果未审核课题数量为0，说明已将课题全部分配，审核课题老师已确定
           if(this.distributeTopic.topic_info.length === 0){
               const res = await this.props.userStore.insertMessageToMany({ "from": this.usr.uid, "to": "audTea", "context": "课题"+this.props.title+"已分配", "type": 0})
                if(res.code === 200){
                    console.log("站内信发送成功")
                }else{
                    console.log("站内信发送失败")
                }
           }

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
            <div className="g-auto">
                <div class="info">
                    共<span class="num">{this.distributeTopic.topic_info.length}</span>篇课题&nbsp;&nbsp;
                    每位<InputNumber size="small" value={this.state.num} style={{ width: 50 }} min={1} max={this.state.maxNum} onChange={this.maxNum} />篇&nbsp;&nbsp;
                    请选择<span class="num">{this.state.teaNum}</span>位&nbsp;&nbsp;
                    已选<span class="num">{this.state.select_teacher.length}</span>位
                </div>
                <div class="select_tea">
                    {(this.props.judge === 0) && 
                    <Select
                        value={this.state.select_teacher}
                        defaultActiveFirstOption={false}
                        ref={selectItem => this.selectItem = selectItem}
                        mode="multiple"
                        style={{ width: 500 }}
                        placeholder={"请选择"+this.props.title+"教师"}
                        onChange={this.addSelectTeacher}
                        optionLabelProp="label"
                        allowClear
                    >
                        
                        {
                           
                        this.distributeTopic.teacher_info.map((item, i) =>
                            <Select.Option label={item.name} key={item.tid}>{item.value}</Select.Option>
                        )}
                    </Select>
                    }
                    {(this.props.judge === 1) && 
                    <Select
                        disabled
                        style={{ width: 500 }}
                        placeholder={this.props.tip}
                    >
                    </Select>
                    }
                </div>
                <div className="m-btn">
                    <Button onClick={this.clear} className="clear">重置</Button>
                    <Button type="primary" onClick={this.autoDistribute}>提交</Button>
                </div>
            </div>
        );
    }
}
