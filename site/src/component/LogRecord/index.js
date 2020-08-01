import { Component } from 'preact'
import { inject, observer } from 'mobx-react'
import {
    Form,
    Button,
    Input,
    List,
    Comment,
    Select,
    Typography,
    Space,
    Popconfirm,
    message,
    Modal,
    Spin,
    DatePicker
} from 'antd'
import moment from 'moment'
import './index.scss'
import { computed, toJS } from 'mobx'
import PropTypes from 'prop-types'

const { Title } = Typography;

const SEL_PLACE = [
    { value: "学校", key: "学校" },
    { value: "网络", key: "网络" }
]
const { TextArea } = Input;
const { Option } = Select;

@inject('userStore', 'studentStore')
@observer
class LogRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            submitting: false,
            editedItemIndex: null,
            value: '',
            isInEdit: false,
            sel: '学校',
            date: moment().format('YYYY-MM-DD'),
        }
    }
    @computed
    get insLog() {
        return toJS(this.props.studentStore.insLog);
    }
    @computed
    get selectTpInfo() {
        return toJS(this.props.studentStore.selectTpInfo)
    }

    componentDidMount = () => {
        this.props.studentStore.getGuidance({ sid: this.props.sid })
            .then(r => {
                if (r && r.length) {
                    this.setState({
                        comments: this.insLog,
                    })
                }
            })
    }

    handleSubmit = () => {
        let comments = [...this.state.comments]
        const { editedItemIndex, value } = this.state
        if (!this.state.value) {
            return;
        }

        this.setState({
            submitting: true,
        });
        if (!this.state.isInEdit) { // 若不在编辑状态中 提交后输入框内显示的内容为本日日志内容（方便编辑）
            setTimeout(() => {
                this.setState({
                    submitting: false,
                    value: '',
                    // comments: [
                    //     {
                    //         opinion: this.state.value,
                    //         // time: moment().format('YYYY-MM-DD'),
                    //         time: this.state.date,
                    //         way: this.state.sel,
                    //     },
                    //     ...this.state.comments,
                    // ],
                });
                //调用后端接口insert本条comment
                this.props.studentStore.insertGuidance({
                    pid: this.selectTpInfo.id,
                    time: this.state.date,
                    way: this.state.sel,
                    opinion: this.state.value
                }).then(() => {
                    message.success('提交成功')

                    this.props.studentStore.getGuidance({ sid: this.props.sid })
                        .then(() => {
                            this.setState({
                                comments: this.insLog,
                            })
                        })
                })
            }, 1000);

        } else { // 若在编辑状态中
            setTimeout(() => {
                // let time = comments[editedItemIndex].time
                let time = this.state.date
                let way = this.state.sel
                let id = comments[editedItemIndex].id
                comments[editedItemIndex] = { opinion: value, time, way }
                this.setState({
                    submitting: false,
                    value: '', // 提交后输入框清空
                    isInEdit: false,
                    // comments
                })
                // 调用后端接口update本条comment
                this.props.studentStore.updateGuidance({ id, time: this.state.date, way, opinion: value })
                    .then(() => {
                        message.success('编辑成功')
                        this.props.studentStore.getGuidance({ sid: this.props.sid })
                            .then(() => {
                                this.setState({
                                    comments: this.insLog,
                                })
                            })

                    })
            }, 1000)
        }

    };

    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    }
    handleEdit = (item) => {
        let comments = [...this.state.comments]
        let { editedItemIndex } = this.state
        this.setState({
            value: item.opinion,
            editedItemIndex: comments.indexOf(item),
            sel: item.way,
            isInEdit: true,
            date: item.time,
        })
        message.info({
            content: '请在输入框内编辑',
            duration: 1.2,
        })
    }

    handleDelete = (item) => {
        let comments = [...this.state.comments]
        this.props.studentStore.delGuidance({ id: item.id })
        // console.log('this is del_id', item.id)
        if (comments.indexOf(item) >= 0) {
            comments.splice(comments.indexOf(item), 1)
        }
        this.setState({
            value: '',
            isInEdit: false,
            comments
        })
    }

    handleSelect = (value, elem) => {
        this.setState({
            sel: elem.key
        })
    }
    handleDateChange = (data, dataString) => {
        this.setState({
            date: dataString
        })

    }
    render() {
        const { comments, submitting, value } = this.state;
        return (
            <div className="g-stu-log">
                <Modal
                    className="g-stu-mdl-dt"
                    visible={this.props.showLog}
                    onCancel={this.props.onCancel}
                    title={<Title level={4}>指导日志</Title>}
                    width={720}
                    style={{ top: 0 }}
                    footer={[]}
                >
                    <Space align="baseline">
                        <p>指导日期</p>
                        <DatePicker onChange={this.handleDateChange} defaultValue={moment(this.state.date, 'YYYY-MM-DD')} value={moment(this.state.date, 'YYYY-MM-DD')} />
                        <p type="text" className="m-pos">指导地点/方式</p>
                        <Select
                            className="m-pos"
                            defaultValue={this.state.sel}
                            style={{ width: 80 }}
                            onChange={this.handleSelChange}
                            onSelect={this.handleSelect}
                            value={this.state.sel}
                            bordered={false}
                            size="small"
                        >
                            {
                                SEL_PLACE.map((elem) => {
                                    return <Option value={elem.value} key={elem.key}>{elem.value}</Option>
                                })
                            }
                        </Select>

                    </Space>
                    <Comment
                        content={

                            <>
                                <Form.Item>
                                    <TextArea rows={4} onChange={this.handleChange} defaultValue={value} value={value} placeholder="请输入指导日志..."
                                        ref={input => {
                                            if (input) {
                                                setTimeout(() => {
                                                    input.focus()
                                                }, 100);
                                            }
                                        }}
                                        onFocus={function (e) {
                                            var val = e.target.value;
                                            e.target.value = '';
                                            e.target.value = val;
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button htmlType="submit" loading={submitting} onClick={this.handleSubmit} type="primary">
                                        提交
        </Button>
                                </Form.Item>
                            </>
                        }
                    />

                    {
                        comments.length > 0 && (
                            <Spin spinning={this.state.submitting}>
                                <List
                                    dataSource={comments}
                                    header={`${comments.length} 条记录`}
                                    itemLayout="horizontal"
                                    // pagination={{
                                    //     pageSize: 3,
                                    // }}
                                    renderItem={(item) => (
                                        <List.Item
                                            actions={[
                                                <Button type="primary" size="small" onClick={() => this.handleEdit(item)}>编辑</Button>,
                                                <Popconfirm title="删除此记录？" onConfirm={() => this.handleDelete(item)} okText="确认" cancelText="取消">
                                                    <Button size="small">删除</Button>
                                                </Popconfirm>
                                            ]} >
                                            <List.Item.Meta
                                                title={(<><span className="u-time">{item.time} </span><span>{item.way}</span></>)}
                                            // description={<p>{item.opinion}</p>}
                                            />
                                            {item.opinion}
                                        </List.Item>
                                    )}
                                />
                            </Spin>
                        )
                    }

                </Modal>
            </div>
        );
    }
}

LogRecord.propTypes = {
    showLog: PropTypes.bool,
    onCancel: PropTypes.func,
    sid: PropTypes.string
}

export default LogRecord;