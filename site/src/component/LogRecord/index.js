import { Component } from 'preact'
import { inject, observer } from 'mobx-react'
import { Form, Button, Input, List, Comment, Select, Typography, Space, Popconfirm, message, Modal } from 'antd'
import moment from 'moment'
import './index.scss'
import { computed } from 'mobx'

const { Title } = Typography;

const data = [
    {
        content: '解接是假人是怎么回事呢？解接相信大家都很熟悉，但是解接是假人是怎么回事呢，下面就让小编带大家一起了解吧。解接是假人，其实就是姐姐是仿生人，大家可能会很惊讶解接怎么会是假人呢？但事实就是这样，小编也感到非常惊讶。这就是关于解接是假人的事情了，大家有什么想法呢，欢迎在评论区告诉小编一起讨论哦！',
        datetime: '2020年07月07日',
        place: '网络'
    },
    {
        content: '解接是假人是怎么回事呢？解接相信大家都很熟悉，但是解接是假人是怎么回事呢，下面就让小编带大家一起了解吧。解接是假人，其实就是姐姐是仿生人，大家可能会很惊讶解接怎么会是假人呢？但事实就是这样，小编也感到非常惊讶。这就是关于解接是假人的事情了，大家有什么想法呢，欢迎在评论区告诉小编一起讨论哦！',
        datetime: '2020年07月03日',
        place: '学校'
    },
    {
        content: 'This is content asdasdasdasd asdasdsd ',
        datetime: '2020年07月02日',
        place: '网络'
    },
    {
        content: 'Ant Design Title 4asdasd',
        datetime: '2020年07月01日',
        place: '学校'
    },
];

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

@inject('userStore')
@observer
class LogRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: data,
            submitting: false,
            editedItemIndex: null,
            value: '',
            isInEdit: false,
            sel: '学校',
        }
    }
    @computed
    get insLog() {
        return this.props.studentStore.insLog;
    }
    componentDidMount = () => {
        const { comments } = this.state;

        if (comments[0].datetime === moment().format('YYYY年MM月DD日'))
            this.setState({
                sel: comments[0].place,
                value: comments[0].content
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
        if (!this.state.isInEdit) {
            if (comments[0].datetime === moment().format('YYYY年MM月DD日')) {
                let datetime = comments[0].datetime
                let place = this.state.sel
                comments[0] = { content: value, datetime, place }
                setTimeout(() => {
                    this.setState({
                        submitting: false,
                        value: value,
                        comments: comments,
                    });
                    // 调用后端接口update本条comment 按日期查
                }, 1000);
            } else {
                setTimeout(() => {
                    this.setState({
                        submitting: false,
                        value: value,
                        comments: [
                            {
                                content: this.state.value,
                                datetime: moment().format('YYYY年MM月DD日'),
                                place: this.state.sel,
                            },
                            ...this.state.comments,
                        ],
                    });
                    //调用后端接口insert本条comment
                }, 1000);
            }

        } else {
            if (editedItemIndex === 0 && comments[editedItemIndex].datetime === moment().format('YYYY年MM月DD日')) {
                setTimeout(() => {
                    let datetime = comments[editedItemIndex].datetime
                    let place = this.state.sel
                    comments[editedItemIndex] = { content: value, datetime, place }
                    this.setState({
                        submitting: false,
                        value: value,
                        isInEdit: false,
                        comments
                    })
                    // 调用后端接口update本条comment
                }, 1000)
            } else {
                setTimeout(() => {
                    let datetime = comments[editedItemIndex].datetime
                    let place = this.state.sel
                    comments[editedItemIndex] = { content: value, datetime, place }
                    this.setState({
                        submitting: false,
                        value: '',
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
            value: item.content,
            editedItemIndex: comments.indexOf(item),
            sel: item.place,
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
                                        actions={[<Button type="primary" size="small" onClick={() => this.handleEdit(item)}>编辑</Button>,
                                        <Popconfirm title="删除此记录？" onConfirm={() => this.handleDelete(item)} okText="确认" cancelText="取消">
                                            <Button size="small">删除</Button>
                                        </Popconfirm>
                                        ]} >
                                        <List.Item.Meta
                                            title={<p>{item.datetime} {item.place}</p>}
                                        // description={<p>{item.content}</p>}
                                        />
                                        {item.content}
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