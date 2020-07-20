import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { Pagination, Modal, Button, message, Empty } from 'antd';
import { computed, toJS } from 'mobx';
import "./index.scss"

const PAGE_SIZE = 5

@inject('userStore')
@observer
export default class Announcement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startRow: 0,
            endRow: PAGE_SIZE - 1,
            currentPage: 1,
            total: 1,
            visible: false,
            selectItem: null,
            pageSize: PAGE_SIZE,
            topNoticeList: [{
                ann_title: '2021届毕业设计（论文）时间安排和具体工作要求aaaa',
                ann_content: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                time: '2020-07-14'
            }, {
                ann_title: '2021届毕业设计（论文）时间安排和具体工作要求',
                ann_content: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
                time: '2020-07-15'
            }]
        }
    }

    //判断该组件是否已挂载 需要更新 state
    _isMounted = false;

    @computed
    get noticeList() {
        return toJS(this.props.userStore.noticeList);
    }

    componentDidMount() {
        this._isMounted = true;
        let noticeWrapper = document.getElementsByClassName("m-not-wp")[0];
        noticeWrapper.style.height = `${this.props.height ? this.props.height: 245}px`;
        if (this.props.pageSize) {
            this.setState({ 
                pageSize: this.props.pageSize,
                endRow: this.props.pageSize - 1
            });
        }
        this.getNoticeList();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getNoticeList = () => {
        this.props.userStore.getNoticeList()
            .then(length => {
                if (length && this._isMounted) {
                    this.setState({
                        total: length
                    })
                }
            })
    }

    //分页切换
    onChange = page => {
        let pageSize = this.state.pageSize;
        this.setState({
            currentPage: page,
            startRow: (page - 1) * pageSize,
            endRow: page * pageSize - 1,
        });
    };

    viewNotice = item => {
        this.setState({
            visible: true,
            selectItem: item
        })
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            selectItem: null
        });
    };

    //已读文件
    handleOk = () => {
        this.props.userStore.readNotice(this.state.selectItem.id)
            .then(r => {
                if (r) {
                    this.getNoticeList();
                } else {
                    message.error('网络错误');
                }
                if (this._isMounted) {
                    this.setState({
                        visible: false,
                        selectItem: null
                    });
                }
            })
    };

    render() {
        const { topNoticeList, currentPage, total, startRow, endRow, selectItem, pageSize } = this.state;
        return (
            <div className="g-notice">
                <div className="m-banner">
                    <span className="u-title">通知公告</span>
                    <ul className="m-top-list">
                        {topNoticeList.map(item =>
                            <li>
                                <div className="m-top-item">
                                    <span className="u-top-title" title={item.ann_title} onClick={() => this.viewNotice(item)}>{item.ann_title}</span>
                                    <span className="u-top-date">{item.time}</span>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="m-not-wp">
                    {
                        this.noticeList.data.length ?
                        <>
                            <ul className="m-not-list">
                                {this.noticeList.data.length && this.noticeList.data.map((item, i) => 
                                    <>
                                        {i >= startRow && i <= endRow &&
                                        <li>
                                            <div className="m-not-item">
                                                <span className="u-not-date">{item.time}</span>
                                                <span className={i <= this.noticeList.index ? "m-status z-unread" : "m-status"}>●</span>
                                                <span
                                                    className={i <= this.noticeList.index ? "u-not-title" : 'u-not-title z-read'}
                                                    title={item.ann_title}
                                                    onClick={() => this.viewNotice(item)}
                                                >
                                                    {item.ann_title}
                                                </span>
                                            </div>
                                        </li>}
                                    </>
                                )}
                            </ul>
                            <Pagination className="m-page" current={currentPage} onChange={this.onChange} pageSize={pageSize} total={total} />
                        </>:
                        <Empty
                            className="z-empty"
                            description={<span>尚未发布通知</span>}
                        />
                    }
                </div>
                {selectItem &&
                    <Modal
                        className="g-dialog"
                        title={null}
                        visible={this.state.visible}
                        closable={false}
                        onCancel={this.handleCancel}
                        width={700}
                        footer={
                            [
                                selectItem.check_flag ?
                                    <Button onClick={this.handleCancel}>关闭</Button> :
                                    <Button onClick={this.handleOk} type="primary">已读</Button>
                            ]}
                    >
                    <div className="u-title">{selectItem.ann_title}</div>
                        <div className="u-time">{selectItem.time}</div>
                        <p>{selectItem.ann_content}</p>
                    </Modal>
                }
            </div>
        );
    }
}
