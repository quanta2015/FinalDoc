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

        let temp = [{ "leader_id": this.props.select_leader.split(" ")[0], "teacher_id": this.props.select_member, "num": this.state.num }]
        console.log(temp)
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

