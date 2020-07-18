import { Component } from 'preact';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import { route } from 'preact-router';
import { Button, Empty } from 'antd'
import moment from 'moment'
import './index.scss'


const data = [
    {
        time: moment().format('YYYY-MM-DD'),
        context: '课题《这是一个课题名称》双选成功',
        check_flag: 0,

    },
    {
        time: '2020-07-14',
        context: '课题《这还是一个课题名称》双选未成功，请重选课题',
        check_flag: 0,
    },
    {
        time: '2020-07-12',
        context: '课题《这也是一个课题名称》已解除和老师的双选关系',
        check_flag: 0
    },
    {
        time: '2020-07-10',
        context: '您所在系课题已发布，请尽快选定课题',
        check_flag: 1
    }
]
@inject('userStore')
@observer
export default class Message extends Component {
    state = {
        msg: [],
        hasUnread: false,
    }
    @computed
    get usr() {
        return this.props.userStore.usr;
    }

    componentDidMount() {
        if (!this.usr.uid) {
            route('/')
        }
        this.setState({
            msg: data
        }, () => {
            this.state.msg.map((item) => {
                if (item.check_flag === 0) {
                    this.setState({
                        hasUnread: true
                    })
                }
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
            msg[i].check_flag = 1
        }
        setTimeout(() => {
            this.setState({
                msg: msg,
                hasUnread: false
            })
        }, 100)
    }

    render() {
        const TODAY = '今天'
        const { msg, hasUnread } = this.state
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
                            <Button size="small" onClick={this.handleClick} disabled={!hasUnread}>全部已读</Button>
                        </div>
                        <div className="m-list">
                            {msg.map((item) =>
                                <>
                                    <h3 className={item.time === moment().format('YYYY-MM-DD') ? "date z-char" : "date"}>{item.time === moment().format('YYYY-MM-DD') ? TODAY : item.time}</h3>

                                    <section className={item.check_flag === 0 ? "list-item" : "list-item z-viewed"} >{item.context}</section>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        );
    }
}
