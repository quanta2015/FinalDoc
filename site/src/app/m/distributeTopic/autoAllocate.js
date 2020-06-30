import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import autoAllocate from './AutoAllocate.css';
import { InputNumber, Select, Button, message } from 'antd';
const { Option } = Select;

@inject('manageStore')
@observer
export default class AutoAllocate extends Component {
    state = {
        // uid,maj,name,area
        teacher_info: [],
        //已选择的老师
        select_teacher: [],
        // 最大可分配课题数目
        maxNum: 10,
        // 需要选择的老师数量
        teaNum: 0,
        // 分配数目
        num: 8,
    }

    @computed
    get distributeTopic() {
        return this.props.manageStore.distributeTopic;
    }

    async componentDidMount() {
        await this.props.manageStore.getTopicList();
        await this.props.manageStore.getTeaList();
        // 获取到教师列表
        let tea = this.distributeTopic.teacher_info;
        
        let teaName = []
        tea.map((item) =>
            teaName.push({ tid: item.uid + " " + item.maj + "-" + item.Tname + "-" + item.areas, name: item.Tname ,value: item.maj + "-" + item.Tname + "-" + item.areas })
        )
        teaName.sort(function (a, b) {
            if (a.value < b.value) {
                return 1;
            } else if (a.value > b.value) {
                return -1;
            }
            return 0;
        })
        
        let tea_num = Math.ceil(this.distributeTopic.topic_info.length / this.state.num);
        // console.log(tea_num)


        this.setState({ teacher_info: teaName, teaNum:  tea_num});
    }

    addSelectTeacher = (value) => {
        let topic_num = this.state.num
        let tea_num = this.state.teaNum
        if(value.length > this.state.teaNum){
            topic_num = parseInt(this.distributeTopic.topic_info.length / value.length)
            tea_num = value.length
        }
        this.setState({
            select_teacher: value,
            num: topic_num,
            teaNum: tea_num
        }, () => { console.log(this.state.select_teacher) })
    }

    // 提交自动分配
    autoDistribute = async () => {
        if (this.state.select_teacher.length === 0) {
            message.info("还未选择审核老师！")
            return;
        }
        let tea_id = [this.state.num]
        this.state.select_teacher.map((item) =>
            tea_id.push(item.split(" ")[0])
        )
        console.log(tea_id)
        // let res = await this.props.manageStore.autoAllocateTopic(tea_id);
        // if (res && res.code === 200) {
        //     message.info("分配成功！")
        //     let topic = await this.props.manageStore.getTopicList()
        //     this.setState({
        //         topic_name: topic.data,
        //     })
        // } else {
        //     message.info("分配失败！请重试")
        // }
        // 清空已选教师列表
        this.setState({
            select_teacher: [],
            num: 8
        })
        await this.props.manageStore.getTopicList()
    }

    maxNum = (value) => {
        console.log(value)
        var allSelectTea = this.state.select_teacher.length;
        var allTopic = this.distributeTopic.topic_info.length;
        var max_num = parseInt(allTopic / allSelectTea);
        var tea_num = Math.ceil(allTopic / value)
        if(value === null || value === ""){
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
                <div className="checknum">
                    <div className="title">课题数量</div>
                    <InputNumber value={this.state.num} style={{ width: 400 }} min={1} max={this.state.maxNum} onChange={this.maxNum} />
                </div>
                <div class="checkTeacher">
                    <div class="title">审核教师</div>
                    <div class="item">
                        <Select
                            value={this.state.select_teacher}
                            defaultActiveFirstOption={false}
                            ref={selectItem => this.selectItem = selectItem}
                            mode="multiple"
                            style={{ width: 400 }}
                            placeholder="请选择审核教师"
                            onChange={this.addSelectTeacher}
                            optionLabelProp="label"
                            allowClear
                        >
                            {this.state.teacher_info.map((item, i) =>
                                <Select.Option label={item.name} key={item.tid}>{item.value}</Select.Option>
                            )}
                        </Select>
                        {/* {(this.state.select_teacher.length !== 0) &&
                            <div class="num">已选{this.state.select_teacher.length}项</div>
                        } */}
                        <div class="num">选择{this.state.teaNum}位教师，将{this.distributeTopic.topic_info.length}篇课题分配完，已选{this.state.select_teacher.length}位</div>
                    </div>
                </div>

                <div className="btn">
                    <Button onClick={this.clear} id="clear">重置</Button>
                    <Button type="primary" onClick={this.autoDistribute}>提交</Button>
                </div>
            </div>
        );
    }
}
