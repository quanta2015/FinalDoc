import { Component } from 'preact';
import { computed, toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import { Button, Empty, Alert } from 'antd'
import { MSG_TYPE } from '../../constant/data'
import './index.scss'

const data = [
    {
        message: '选择命题成功',
        type: 'warning',
        check_flag: 0
    },
    {
        message: '双选成功11111111111111',
        type: 'success',
        check_flag: 0
    },
    {
        message: '双选已解绑',
        type: 'error',
        check_flag: 0
    },
    {
        message: '选择命题成功',
        type: 'warning',
        check_flag: 0
    },
    {
        message: '双选成功',
        type: 'success',
        check_flag: 0
    },
    {
        message: '双选已解绑555555555555555555555',
        type: 'warning',
        check_flag: 0
    },
    {
        message: '选择命题成功',
        type: 'warning',
        check_flag: 0
    },
    {
        message: '双选成功33333333333333333333',
        type: 'success',
        check_flag: 0
    },
    {
        message: '双选已解绑',
        type: 'warning',
        check_flag: 0
    }
];

@inject('userStore')
@observer
export default class Message extends Component {
    state = {
        totalWidth: 0,
        msg: []
    }
    @computed
    get usr() {
        return this.props.userStore.usr;
    }
    @computed
    get msgList() {
        return toJS(this.props.userStore.msgList);
    }

    //判断该组件是否已挂载 需要更新 state
    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        this.props.userStore.getAllMessages({ uid: this.usr.uid }).then(r => {
            if (this._isMounted && r && r.length) {
                this.setState({
                    msg: this.msgList
                }, () => {
                    var parent = document.querySelector('.g-msg');
                    var children = parent.children;
                    var tmpWidth = 0;
                    var index = 0;
                    var parentWidth = parent.offsetWidth;
                    if (children.length !== 0) {
                        parent.classList.add('z-notempty');
                    }

                    for (let i = 0; i < children.length; i++) {
                        if (tmpWidth < parentWidth && tmpWidth + children[i].offsetWidth + 20 > parentWidth) {
                            index = i;
                        }
                        tmpWidth += children[i].offsetWidth + 20;
                    }
                    if (index !== 0) {
                        for (let i = index; i < children.length; i++) {
                            children[i].style.display = 'none';
                        }
                    }

                    this.setState(
                        {
                            totalWidth: tmpWidth
                        },
                        () => {
                            const { totalWidth } = this.state;
                            if (totalWidth >= parentWidth) {
                                setTimeout(() => {
                                    parent.classList.add('has-overflow');
                                }, 200)

                            }
                        }
                    );
                })
            }
        })

    }

    componentWillUnmount = () => {
        this.setState = (state, callback) => {
            return;
        };
        this._isMounted = false;
    }
    // 点击后，重新计算所有子元素宽度 若超过上级宽度则隐藏
    handleClose = (item, id) => {
        let msg = [...this.state.msg]
        if (msg.indexOf(id) >= 0) {
            msg.splice(msg.indexOf(item), 1)
        }
        this.props.userStore.readMessages({ id: item.id + '' }) //已读后删除
        if (this._isMounted) {
            this.setState({
                msg: msg
            }, () => {
                var parent = document.querySelector('.g-msg');
                var children = parent.children;
                var index = 0;
                var tmpWidth = 0;
                var parentWidth = parent.offsetWidth;

                for (let i = 0; i < children.length; i++) {
                    var wid = 0;

                    if (children[i].offsetWidth === 0) {
                        children[i].style.display = ''
                        children[i].style.visibility = 'hidden'
                        wid = children[i].offsetWidth
                        children[i].style.display = 'none'
                        children[i].style.visibility = ''
                    } else {
                        wid = children[i].offsetWidth
                    }
                    if (tmpWidth < parentWidth && (tmpWidth + wid + 20 >= parentWidth)) {
                        index = i;
                    }
                    tmpWidth += wid + 20;
                }
                // 若一行可显示，则所有可显示
                if (index === 0) index = children.length;
                // 显示可完整显示的消息
                for (let i = 0; i < index; i++) {
                    if (children[i]) children[i].style.display = '';
                }

                this.setState(
                    {
                        totalWidth: tmpWidth
                    },
                    () => {
                        const { totalWidth } = this.state;
                        if (totalWidth < parentWidth) {
                            parent.classList.remove('has-overflow');
                        }
                        if (children.length === 0) {
                            parent.classList.remove('z-notempty')
                        }
                    }
                );
            })
        }
    };

    render() {
        return (
            <div className="g-msg">
                {this.state.msg.map((item, index) => (
                    <Alert
                        key={index}
                        afterClose={() => this.handleClose(item, index)}
                        message={' ' + item.msg_context + ' '}
                        type={MSG_TYPE[item.type]}
                        closable
                        showIcon
                    />
                ))}
            </div>
        );
    }
}
