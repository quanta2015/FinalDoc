import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import style from './style';
import { InputNumber, Select, Button, message } from 'antd';
const { Option } = Select;

@inject('manageStore')
@observer
export default class HeadAllocate extends Component {
    state = {
        // uid,value
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
        // 将教师列表值变为id+name
        let teaName = []
        tea.map((item) =>
            teaName.push({ tid: item.uid, value: item.uid + " " + item.name })
        )
        // console.log(topic)
        this.setState({ teacher_info: teaName });
    }

    render() {
        return (
            <div>
                手动分配
            </div>
        );
    }
}
