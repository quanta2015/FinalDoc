import { Component } from 'preact'
import { inject, observer } from 'mobx-react'
import { Drawer, Form, Button, Input, List, Comment, Select } from 'antd'
import moment from 'moment'
import './index.css'

const data = [
    {
        content: 'Ant Design Title 1',
        datetime: moment().format('YYYY年MM月DD日 HH:MM:SS'),
        place: '网络'
    },
    {
        content: 'Ant Design Title 2',
        datetime: moment().format('YYYY年MM月DD日 HH:MM:SS'),
        place: '学校'
    },
    {
        content: 'Ant Design Title 3',
        datetime: moment().format('YYYY年MM月DD日 HH:MM:SS'),
        place: '网络'
    },
    {
        content: 'Ant Design Title 4',
        datetime: moment().format('YYYY年MM月DD日 HH:MM:SS'),
        place: '学校'
    },
];

const { TextArea } = Input;
const { Option } = Select;

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} placeholder="请输入今日的指导日志..." />
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
            setTimeout(() => {
                this.setState({
                    submitting: false,
                    value: '',
                    comments: [
                        {
                            // author: 'Han Solo',
                            // avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                            content: this.state.value,
                            datetime: moment().format('YYYY年MM月DD日 HH:MM:SS'),
                        },
                        ...this.state.comments,
                    ],
                });
            }, 1000);
        } else {
            setTimeout(() => {
                let datetime = comments[editedItemIndex].datetime
                comments[editedItemIndex] = { content: value, datetime }
                this.setState({
                    submitting: false,
                    value: '',
                    isInEdit: false,
                    comments
                })
                console.log('this is edit', comments)
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
            value: item.content,
            editedItemIndex: comments.indexOf(item),
            sel: item.place,
            isInEdit: true,
        }, () => {
            console.log('edit', comments);
        })
    }

    handleDelete = (item) => {
        let comments = [...this.state.comments]
        if (comments.indexOf(item) >= 0) {
            comments.splice(comments.indexOf(item), 1)
        }
        this.setState({ comments })
        console.log(comments)
    }
    handleSelChange = (value) => {
        // console.log(`selected ${value}`);
    }
    handleSelect = (value, elem) => {
        console.log(elem.key, elem.value)
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
                    // ref={selectItem => this.selectItem = selectItem}
                    >
                        <Option value="学校" key="学校">学校</Option>
                        <Option value="网络" key="网络">网络</Option>
                    </Select>
                    <Comment
                        // avatar={
                        //     <Avatar
                        //         src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                        //         alt="Han Solo"
                        //     />
                        // }
                        content={
                            <Editor
                                onChange={this.handleChange}
                                onSubmit={this.handleSubmit}
                                submitting={submitting}
                                value={value}
                            />
                        }
                    />
                    {/* {comments.length > 0 && <CommentList comments={comments} />} */}
                    {
                        comments.length > 0 && (
                            <List
                                dataSource={comments}
                                // header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
                                header={`${comments.length} 条记录`}
                                itemLayout="horizontal"
                                // renderItem={props => <Comment {...props} />}
                                renderItem={(item) => (
                                    <List.Item
                                        actions={[<Button onClick={() => this.handleEdit(item)}>编辑</Button>,
                                        <Button onClick={() => this.handleDelete(item)}>删除</Button>]} >
                                        <List.Item.Meta
                                            title={<p>{item.datetime} {item.place}</p>}
                                            description={<p>{item.content}</p>}
                                        />
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