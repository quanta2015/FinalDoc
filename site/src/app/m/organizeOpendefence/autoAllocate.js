import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { InputNumber, Select, Button, message, Form } from 'antd';

@inject('manageStore','userStore')
@observer
export default class AutoAllocate extends Component {
    state = {
        num: 10,
        topic_num: 0,
        teacher_info:[],
        group_info:[]
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
        await this.props.manageStore.getTopicList_ogp({"ide":this.usr.uid});
        this.setState({
            topic_num: toJS(this.openDefenseGroup.topic_info).length,
        })
    }

    // 提交自动分配
    autoDistribute = async () => {
        if (this.props.select_leader.length === 0 ||
            this.props.select_member.length < 2) {
            message.info("选择数量不够")
            return;
        }
        let member_x = []
        this.props.select_member.map((item) => member_x.push(item.split(" ")[0]))
        console.log(member_x,"memeber_x")

        let temp = {"ide":this.usr.uid ,"leader_id": this.props.select_leader.split(" ")[0], "teacher_id": member_x, "number": this.state.num }
        console.log(temp)

        let res = await this.props.manageStore.autoAllocateTopic_ogp(temp);
        if (res && res.code === 200) {
            message.info("成功添加答辩小组！")
            await this.props.manageStore.getTeacherList_ogp({"ide":this.usr.uid});
            this.setState({
                teacher_info: toJS(this.openDefenseGroup.teacher_info),
            }, () => { this.toParent() });

        } else {
            message.info("分配失败！请重试")
        }
        this.clear()
    }

    setNum = (value) => {
        this.setState({
            num: value,
        })
    }

    clear = () => {
        this.props.clear()
        this.setState({
            num: 10,
        })
    }

    //手动分配传值到父组件
    toParent = (msg) => {
         
        this.props.parent.getChildrenMsg(this, msg)
    }


    render() {
        return (
            <div class="auto-allocate">
                <div class="select-group">
                    {/* <div class="lable">学生数量</div>
                    <div class="choose">
                        <InputNumber style={{ width: 50 }} min={1} max={this.state.topic_num} value={this.state.num} onChange={this.setNum} />
                    </div> */}
                    <div class="choose_num">还有<span class="stu_num">{this.state.topic_num}</span>位学生未被选择 为该组选择
                        <InputNumber style={{ width: 50 }} min={1} max={this.state.topic_num} value={this.state.num} onChange={this.setNum} />
                    位</div>
                </div>
                <div class="btn">
                    <Button className="reset" onClick={this.clear}>重置</Button>
                    <Button type="primary" onClick={this.autoDistribute}> 提交</Button>
                </div>
            </div>
        );
    }
}

