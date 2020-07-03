import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';


import { InputNumber, Select, Button, message, Form } from 'antd';




@inject('manageStore')
@observer
export default class AutoAllocate extends Component {
    state = {
        num: 10,


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

        let temp = { "leader_id": this.props.select_leader.split(" ")[0], "teacher_id": this.props.select_member, "number": this.state.num }
        console.log(temp)

        let res = await this.props.manageStore.autoAllocateTopic_ogp(temp);
        if (res && res.code === 200) {
            message.info("成功添加答辩小组！")
            
             
            let teacher=await this.props.manageStore.getTeacherList_ogp();
             
            // 获取到教师列表
           

            this.setState({
                teacher_info: teacher
            }, () => { this.toParent });

            
             
             
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
    toParent = () => {
        // console.log(this.props.parent.getChildrenMsg.bind(this, this.state.msg))
        this.props.parent.getChildrenMsg(this, this.state.teacher_info)
    }


    render() {
        return (
            <div class="auto-allocate">
                <div class="select-group">
                    <div class="lable">分配数量</div>
                    <div class="choose">

                        <InputNumber size="small" style={{ width: 50 }} min={1} value={this.state.num} onChange={this.setNum} />

                    </div>
                </div>
                <div>
                    <Button onClick={this.clear}>重置</Button>
                    <Button type="primary" onClick={this.autoDistribute}> 提交</Button>
                </div>



            </div>
        );
    }
}

