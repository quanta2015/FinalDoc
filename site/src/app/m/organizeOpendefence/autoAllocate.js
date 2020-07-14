import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { InputNumber, Select, Button, message, Form } from 'antd';
import "./autoAllocate.scss"

@inject('manageStore', 'userStore')
@observer
export default class AutoAllocate extends Component {
    state = {
        num: 10,
        sug_topic:[],
        topic_info:[],
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
       // await this.props.manageStore.getTopicList_ogp({ "ide": this.usr.uid });
        // await this.props.manageStore.getTeacherList_ogp({ "ide": this.usr.uid });
        // let stu_num = 0;
        // if (this.openDefenseGroup.teacher_info.length !== 0) {
        //     stu_num = Math.ceil(this.openDefenseGroup.topic_info.length / parseInt(this.openDefenseGroup.teacher_info.length / 3));
        // }
        // this.setState({
        //     num: stu_num,
        // })
         
            //await this.props.manageStore.getTopicList_ogp({"ide":this.usr.uid});
            
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

        let temp = { "ide": this.usr.uid, "leader_id": this.props.select_leader.split(" ")[0], "teacher_id": member_x, "number": this.state.num }
        console.log(temp)
        let res = await this.props.manageStore.autoAllocateTopic_ogp(temp);
        if (res && res.code === 200) {
            if(res.data[0].err === 1){
                message.error("新增答辩小组失败！请重试")
            } else if (res.data[0].err === 0 && res.data[0].cnt !== this.state.num){
                message.info("仅为该小组选择" + res.data[0].cnt + "位参与答辩学生")
            } else if (res.data[0].err === 0 && res.data[0].cnt === this.state.num) {
                message.success("成功添加答辩小组！")
            }
            await this.props.manageStore.getTopicList_ogp({ "ide": this.usr.uid });
            await this.props.manageStore.getTeacherList_ogp({ "ide": this.usr.uid });
            await this.props.manageStore.getGroupList_ogp({ "ide": this.usr.uid });

            let stu_num = 0;
            if (this.openDefenseGroup.teacher_info.length !== 0) {
                stu_num = Math.ceil(this.openDefenseGroup.topic_info.length / parseInt(this.openDefenseGroup.teacher_info.length / 3));
            }
            this.setState({
                num: stu_num,
            })
        } else {
            message.error("新增答辩小组失败！请重试")
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
        let stu_num = 0;
        if (this.openDefenseGroup.teacher_info.length !== 0) {
            stu_num = Math.ceil(this.openDefenseGroup.topic_info.length / parseInt(this.openDefenseGroup.teacher_info.length / 3));
        }
        this.setState({
            num: stu_num,
        })
    }

    render() {
         
         
       
        return (
            <div class="g-ogp-al">
                <div class="m-select-gp">
                    {/* <div class="choose-num">
                        还有<span class="stu-num">{this.openDefenseGroup.topic_info.length}</span>位学生未被选择 为该组选择
                        <InputNumber
                            style={{ width: 50 }}
                            min={1}
                            max={this.openDefenseGroup.topic_info.length}
                            value={this.state.num}
                            onChange={this.setNum}
                        />
                    位
                    </div> */}

                    
                </div>
                <div className="m-btn-gp">
                    <Button onClick={this.clear}>重置</Button>
                    <Button className="btn-sbm" type="primary" onClick={this.autoDistribute}> 提交</Button>
                </div>
            </div>
        );
    }
}

