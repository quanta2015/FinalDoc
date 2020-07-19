import { Component } from 'preact';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import { route } from 'preact-router';
import { Button, Empty } from 'antd'
import moment from 'moment'
import './index.scss'


// const data = [
//     [
//         {
//             time: '2020-07-18',
//             msg_context: '课题《这是一个课题名称》双选成功',
//             check_flag: 0,

//         },
//         {
//             time: '2020-07-18',
//             msg_context: '课题《这还是一个课题名称》双选未成功，请重选课题',
//             check_flag: 0,
//         }
//     ],
//     [
//         {
//             time: '2020-07-14',
//             msg_context: '课题《这也是一个课题名称》已解除和老师的双选关系',
//             check_flag: 1
//         }
//     ],
//     [
//         {
//             time: '2020-07-12',
//             msg_context: '您所在系课题已发布，请尽快选定课题',
//             check_flag: 1
//         }
//     ]
// ]
@inject('userStore')
@observer
export default class Message extends Component {
    state = {
        msg: [],
    }
    @computed
    get usr() {
        return this.props.userStore.usr;
    }

    @computed
    get msgList() {
        return this.props.userStore.msgList
    }

    @computed
    get hasUnread() {
        return this.props.userStore.hasUnread
    }

    componentDidMount() {
        if (!this.usr.uid) {
            route('/')
        }
        this.props.userStore.getAllMessages({ uid: this.usr.uid }).then(res => {
            this.setState({
                msg: res,
            })
        })
      
    }

    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
    }

    handleClick = () => {
        let msg = [...this.state.msg]
        for (let i = 0; i < msg.length; i++) {
            for (let j = 0; j < msg[i].length; j++) {
                msg[i][j].check_flag = 1
            }
        }
        setTimeout(() => {
            this.setState({
                msg: msg,
            }, () => {
                this.props.userStore.setReadStatus(false)
                this.props.userStore.readMessages({ uid: this.usr.uid })
            })
        }, 100)
    }

    render() {
        const TODAY = '今天'
        const { msg } = this.state
        return (
            <div className="g-msg">
                {msg.length === 0 &&
                    <Empty
                        className="z-empty"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={<span>尚未收到消息</span>}
                    />}
                {msg.length > 0 && (
                    <>
                        <div className="u-clear-btn">
                            <Button size="small" onClick={this.handleClick} disabled={!this.hasUnread}>全部已读</Button>
                        </div>
                        <div className="m-list">
                            {msg.map((item) =>
                                <>
                                    <h3 className={item[0].time === moment().format('YYYY-MM-DD') ? "date z-char" : "date"}>{item[0].time === moment().format('YYYY-MM-DD') ? TODAY : item[0].time}</h3>
                                    {
                                        item.map(elem => <section className={elem.check_flag === 0 ? "list-item" : "list-item z-viewed"} >{elem.msg_context}</section>
                                        )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        );
    }
}
