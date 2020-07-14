import { Component } from 'preact'
import { inject, observer } from 'mobx-react'
import { Form, Button, Input, List, Comment, Select, Typography, Space, Popconfirm, message, Modal, Empty } from 'antd'
import moment from 'moment'
import './index.scss'
import { computed, toJS } from 'mobx'

const { Title } = Typography;

const SEL_PLACE = [
    { value: "学校", key: "学校" },
    { value: "网络", key: "网络" }
]
const { TextArea } = Input;
const { Option } = Select;

const focusInputField = input => {
    if (input) {
        setTimeout(() => { input.focus() }, 100);
    }
};

const Editor = ({ onChange, onSubmit, submitting, value, defaultValue }) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} defaultValue={defaultValue} value={value} placeholder="请输入今日的指导日志..." ref={focusInputField} />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                提交
        </Button>
        </Form.Item>
    </>
);

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
        }
    }
    @computed
    get insLog() {
        return toJS(this.props.studentStore.insLog);
    }

    componentDidMount = () => {
        this.setState({
            comments: this.insLog,
        }, () => {
            let { comments } = this.state
            if (comments[0].time === moment().format('YYYY年MM月DD日'))
                this.setState({
                    sel: comments[0].way,
                    value: comments[0].opinion
                })
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
            if (comments[0] && comments[0].time === moment().format('YYYY年MM月DD日')) { // 如果当前日期与最近一条日志日期相等，则更新最近一条
                let time = comments[0].time
                let way = this.state.sel
                comments[0] = { opinion: value, time, way }
                setTimeout(() => {
                    this.setState({
                        submitting: false,
                        value: value,
                        comments: comments,
                    });
                    // 调用后端接口update本条comment 按日期查
                }, 1000);
            } else { // 若当前日期为新（本日尚未提交过日志） 则加入一条新日志
                setTimeout(() => {
                    this.setState({
                        submitting: false,
                        value: value,
                        comments: [
                            {
                                opinion: this.state.value,
                                time: moment().format('YYYY年MM月DD日'),
                                way: this.state.sel,
                            },
                            ...this.state.comments,
                        ],
                    });
                    //调用后端接口insert本条comment
                }, 1000);
            }

        } else { // 若在编辑状态中
            if (editedItemIndex === 0 && comments[editedItemIndex].time === moment().format('YYYY年MM月DD日')) { // 编辑最新的指导日志
                setTimeout(() => {
                    let time = comments[editedItemIndex].time
                    let way = this.state.sel
                    comments[editedItemIndex] = { opinion: value, time, way }
                    this.setState({
                        submitting: false,
                        value: value,// 提交后输入框内也直接显示最新内容，方便编辑
                        isInEdit: false,
                        comments
                    })
                    // 调用后端接口update本条comment
                }, 1000)
            } else { // 编辑之前的指导日志
                setTimeout(() => {
                    let time = comments[editedItemIndex].time
                    let way = this.state.sel
                    comments[editedItemIndex] = { opinion: value, time, way }
                    this.setState({
                        submitting: false,
                        value: '', // 提交后输入框清空
                        isInEdit: false,
                        comments
                    })
                    // 调用后端接口update本条comment
                }, 1000)
            }

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
        })
        message.info({
            content: '请在输入框内编辑',
            duration: 1.2,
        })
    }

    handleDelete = (item) => {
        let comments = [...this.state.comments]
        if (comments.indexOf(item) >= 0) {
            comments.splice(comments.indexOf(item), 1)
        }
        this.setState({
            value: '',
            isInEdit: false,
            comments
        })
    }
    handleSelChange = (value) => {
    }
    handleSelect = (value, elem) => {
        this.setState({
            sel: elem.key
        })
    }

    render() {
        const { comments, submitting, value } = this.state;
        console.log('this is pid', this.props.pid);
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
                        {/* <h4  >{moment().format('YYYY年MM月DD日')}</h4> */}
                        <p type="text" className="m-pos">请选择指导地点/指导方式</p>
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
                            <Editor
                                onChange={this.handleChange}
                                onSubmit={this.handleSubmit}
                                submitting={submitting}
                                value={value}
                                defaultValue={value}
                            />
                        }
                    />
                    {
                        comments.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    }
                    {
                        comments.length > 0 && (
                            <List
                                dataSource={comments}
                                header={`${comments.length} 条记录`}
                                itemLayout="horizontal"
                                pagination={{
                                    pageSize: 2,
                                }}
                                renderItem={(item) => (
                                    <List.Item
                                        actions={[
                                            <Button type="primary" size="small" onClick={() => this.handleEdit(item)}>编辑</Button>,
                                            <Popconfirm title="删除此记录？" onConfirm={() => this.handleDelete(item)} okText="确认" cancelText="取消">
                                                <Button size="small">删除</Button>
                                            </Popconfirm>
                                        ]} >
                                        <List.Item.Meta
                                            title={<p>{item.time} {item.way}</p>}
                                        // description={<p>{item.opinion}</p>}
                                        />
                                        {item.opinion}
                                    </List.Item>
                                )}
                            />
                        )
                    }

                </Modal>
            </div>
        );
    }
}

export default LogRecord;