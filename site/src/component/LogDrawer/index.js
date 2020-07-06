import { Component } from 'preact'
import { inject, observer } from 'mobx-react'
import { Drawer, Form, Button, Input, List, Comment, Select } from 'antd'
import moment from 'moment'
import './index.css'

const data = [
    {
        content: 'Ant Design Title 1',
        datetime: '2020年07月07日',
        place: '网络'
    },
    {
        content: 'Ant Design Title 2',
        datetime: '2020年07月03日',
        place: '学校'
    },
    {
        content: 'Ant Design Title 3',
        datetime: '2020年07月02日',
        place: '网络'
    },
    {
        content: 'Ant Design Title 4',
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

const Editor = ({ onChange, onSubmit, submitting, value, defaultValue }) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} defaultValue={defaultValue} value={value} placeholder="请输入今日的指导日志..." />
        </Form.Item>
        <Form.Item>
            <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                提交
        </Button>
        </Form.Item>
    </>
);

// var hasPost = false
@inject('userStore')
@observer
class LogDrawer extends Component {
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
            <div className="g-log">
                <Drawer
                    title="指导日志"
                    width={720}
                    onClose={this.props.onClose}
                    visible={this.props.showDrawer}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={this.props.onClose} style={{ marginRight: 8 }}>
                                取消
                            </Button>
                            <Button onClick={this.props.onClose} type="primary">
                                确定
                            </Button>
                        </div>
                    }
                >
                    <Select
                        defaultValue={this.state.sel}
                        style={{ width: 120 }}
                        onChange={this.handleSelChange}
                        onSelect={this.handleSelect}
                        value={this.state.sel}
                    >
                        {
                            SEL_PLACE.map((elem) => {
                                return <Option value={elem.value} key={elem.key}>{elem.value}</Option>
                            })
                        }
                    </Select>
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
                                renderItem={(item) => (
                                    <List.Item
                                        actions={[<Button onClick={() => this.handleEdit(item)}>编辑</Button>,
                                        <Button onClick={() => this.handleDelete(item)}>删除</Button>]} >
                                        <List.Item.Meta
                                            title={<p>{item.datetime} {item.place}</p>}
                                            description={<p>{item.content}</p>}
                                        />
                                        {item.content}
                                    </List.Item>
                                )}
                            />
                        )
                    }
                </Drawer>
            </div>
        );
    }
}

export default LogDrawer;