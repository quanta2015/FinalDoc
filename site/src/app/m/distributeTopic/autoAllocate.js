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
        // 分配数目
        num: 1,
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
        // console.log(tea)
        let teaName = []
        tea.map((item) =>
            teaName.push({ tid: item.uid + " " + item.maj + "-" + item.Tname + "-" + item.areas, value: item.maj + "-" + item.Tname + "-" + item.areas })
        )
        teaName.sort(function(a,b){
            if (a.value < b.value) {
				return 1;
			} else if (a.value > b.value) {
				return -1;
			}
			return 0;
        })
        // console.log(topic)
        this.setState({ teacher_info: teaName });
    }

    addSelectTeacher = (value) => {
        this.setState({
            select_teacher: value
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
            num: 1
        })
        await this.props.manageStore.getTopicList()
    }

    maxNum = (value) => {
        var allSelectTea = this.state.select_teacher.length;
        var allTopic = this.distributeTopic.topic_info.length;
        var max_num = parseInt(allTopic / allSelectTea);
        this.setState({
            maxNum: max_num,
            num: value
        })
        if (value === max_num) {
            message.info("已到达最大分配数量")
        }
    }

    clear = () => {
        this.setState({
            num: 1,
            select_teacher: []
        })
    }

    render() {
        return (
            <div>
                <div>
                    <div class="checkTeacher">
                        <div class="title">审核教师</div>
                        <div class="item">
                            <Select
                                value={this.state.select_teacher}
                                defaultActiveFirstOption={false}
                                ref={selectItem => this.selectItem = selectItem}
                                mode="multiple"
                                style={{ width: 350 }}
                                placeholder="请选择审核教师"
                                onChange={this.addSelectTeacher}
                                allowClear
                            >
                                {this.state.teacher_info.map((item, i) =>
                                    <Select.Option key={item.tid}>{item.value}</Select.Option>
                                )}
                            </Select>
                            {(this.state.select_teacher.length !== 0) &&
                                <div class="num">已选{this.state.select_teacher.length}项</div>
                            }
                        </div>
                    </div>
                </div>
                <div className="checknum">
                    <div className="title">课题数量</div>
                    <InputNumber value={this.state.num} style={{ width: 350 }} min={1} max={this.state.maxNum} onChange={this.maxNum} />
                </div>
                <div className="btn">
                    <Button onClick={this.clear} id="clear">重置</Button>
                    <Button type="primary" onClick={this.autoDistribute}>提交</Button>
                </div>
            </div>
        );
    }
}
