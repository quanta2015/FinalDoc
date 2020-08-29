import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';
import { Button, message, Tooltip, Skeleton } from 'antd'
import { PlusOutlined, EditOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import FileUpload from '../../../component/FileUpload';
import { FILE_UPLOAD_TYPE } from '../../../constant/data'
import './index.scss'
import LogRecord from '../../../component/LogRecord';
import DeferReply from '../../../component/DeferReply'

@inject('studentStore', 'userStore')
@observer
export default class TopicPG extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            selectItem: null,
            showLog: false,
            showDefer: false,    // 控制modal是否可见
            canDefer: false,     // 控制是否显示按钮
            showProcess: false,  // 控制modal显示输入框还是时间轴
            type: null,          // 延缓答辩类型
            loading: true        // 时间轴加载
        }
    }

    @computed
    get usr() {
        return toJS(this.props.userStore.usr);
    }

    @computed
    get selectTpInfo() {
        return toJS(this.props.studentStore.selectTpInfo);
    }

    @computed
    get timeList() {
        return toJS(this.props.studentStore.timeList);
    }

    @computed
    get opScore() {
        return toJS(this.props.studentStore.opScore);
    }

    @computed
    get currState() {
        return toJS(this.props.studentStore.currState);
    }

    //判断该组件是否已挂载 需要更新 state
    _isMounted = false;

    async componentDidMount() {
        this._isMounted = true;
        if (!this.usr.uid) {
            route('/')
        }
        if (!this.selectTpInfo) {
            route('/s_selectTL')
        }
        // 导航切换
        if (!!this.timeList.length && this._isMounted) {
            this.setState({
                loading: false
            })
        }
        // 首次加载
        if (this.usr.uid && !this.timeList.length) {
            this.props.studentStore.getOpenScore({ uid: this.usr.uid })
            await this.props.studentStore.getCurrentState({ uid: this.usr.uid })
            const r = await this.props.studentStore.getAllStates({ uid: this.usr.uid })
            if (r && this._isMounted) {
                this.setState({
                    loading: false
                })
            }
        }
        // 延缓答辩
        const canDeferFromTime = await this.props.studentStore.getShowDefer({ uid: this.usr.uid })
        const canDeferFromAction = await this.props.studentStore.getDeferAppliProgs({ sid: this.usr.uid, type: canDeferFromTime[0].type })

        // 存在未结束的申请
        const showProgress = !!canDeferFromAction.length && !canDeferFromAction[0].pass
        // 不含已通过的申请
        const unfinishDefer = !!canDeferFromAction.length && canDeferFromAction[0].pass < 1
        // 时间上可申请 且未成功申请
        const canDefer = canDeferFromTime[0].flag && (!canDeferFromAction.length || unfinishDefer)

        if (this._isMounted) {
            this.setState({
                canDefer: canDefer,
                showProcess: showProgress,
                type: canDeferFromTime[0].type
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    downloadFile = (item) => {
        let params = { file: this.selectTpInfo[item.type], id: this.selectTpInfo.sid, name: item.title };
        this.props.userStore.downloadFile(params)
            .then(r => {
                if (!r) {
                    message.error('网络错误');
                }
            })
    }

    showLog = () => {
        this.setState({
            showLog: true,
        })
    }

    showDefer = () => {
        this.setState({
            showDefer: true,
        })
    }

    onCloseLog = () => {
        this.setState({
            showLog: false,
        })
    }

    onCloseDefer = () => {
        this.setState({
            showDefer: false,
        })
    }

    onSubmitDefer = () => {
        this.props.userStore.insertMessageToOne({ from: this.usr.uid, to: this.selectTpInfo.tid, context: "学生申请延缓答辩", type: 2 })
        this.setState({
            showProcess: true
        })
    }

    render() {
        const TASK_FINISH = 6;
        const GRADE_FINISH = 20;
        const status = this.selectTpInfo.status
        const f_task = this.selectTpInfo.f_task
        const f_score_check = this.selectTpInfo.f_score_check
        const text = '该进度仅表示整体流程进度，与您的实际上交情况无关'
        return (
            <div className="g-stu-prog">
                <div className="m-hd">
                    <div className="u-type">{this.selectTpInfo.type}</div>
                    <h2 className="u-topic">{this.selectTpInfo.topic}</h2>
                    <div className="u-name">{this.selectTpInfo.name}</div>
                </div>
                <div className="m-cont">
                    <h2 className="u-title">
                        论文进度
                        <Tooltip placement="right" title={text}>
                            <QuestionCircleOutlined style={{ fontSize: 16, color: '#999', paddingLeft: 5 }} />
                        </Tooltip>
                    </h2>
                    <Skeleton loading={this.state.loading} active title={false}>
                        <ul className="m-time-line">
                            {
                                this.timeList.map((item) =>
                                    <li className={!!this.currState.length && item.time <= this.currState[0].time ? this.currState[0].time === item.time ? "u-time-stamp z-focus" : "u-time-stamp z-active" : "u-time-stamp"}>
                                        <div>
                                            {item.time && item.time !== '0000-00-00' && <h3>{item.time}</h3>}
                                            {
                                                ((item.title === '任务书' && status >= TASK_FINISH && f_task) || (item.title === '成绩审定' && status >= GRADE_FINISH && f_score_check)) ?
                                                    <p className="u-link-file" onClick={() => this.downloadFile(item)}>{item.title}</p> :
                                                    <p>{item.title}</p>
                                            }
                                        </div>
                                    </li>
                                )
                            }
                        </ul>
                    </Skeleton>
                </div>
                <div className="m-cont">
                    <div className="m-title-wp">
                        <h2 className="u-title">材料递交</h2>
                        <div className="m-btn-wp">
                            {this.state.canDefer && <Button className="u-btn" onClick={this.showDefer} size="small"><EditOutlined />申请延缓</Button>}
                            <Button className="u-btn" type="primary" onClick={this.showLog} size="small"><PlusOutlined />指导日志</Button>
                        </div>
                    </div>
                    <LogRecord
                        showLog={this.state.showLog}
                        onCancel={this.onCloseLog}
                        sid={this.usr.uid}
                    />
                    <DeferReply
                        showDefer={this.state.showDefer}
                        showProcess={this.state.showProcess}
                        afterSubmit={this.onSubmitDefer}
                        onCancel={this.onCloseDefer}
                        sid={this.usr.uid}
                        type={this.state.type}
                    />
                    <div className="m-topic-info">
                        {FILE_UPLOAD_TYPE.map((item, id) =>
                            <div className="m-stage">
                                <h3 className="u-title"><span>0{id + 1} / </span>{item.stage}</h3>
                                <div className="m-file-wp">
                                    {item.file.map((item) =>
                                        <div className="m-upload">
                                            <FileUpload
                                                type={item}
                                                tpInfo={this.selectTpInfo ? this.selectTpInfo : {}}
                                                afterUpdate={() => this.props.studentStore.getSelectTopic({ uid: this.usr.uid })}
                                                delFile={() => this.props.studentStore.deleteFile({ type: item.type, tid: this.selectTpInfo.tid, sid: this.selectTpInfo.sid })}
                                            />
                                        </div>
                                    )}
                                </div>
                                {
                                    this.opScore.length > 0 && id === 0 &&
                                    < div className="m-op-score">
                                        <div className="m-nm-lst">
                                            <div className="u-nm-itm">
                                                <span>指导老师评分</span>
                                                {this.opScore[0].t_reply_score ?
                                                    <span className="score">
                                                        {this.opScore[0].t_reply_score}
                                                    </span> :
                                                    <span className="z-none">
                                                        尚未录入
                                    </span>
                                                }
                                            </div>
                                            <div className="u-nm-itm">
                                                <span>开题答辩评分</span>
                                                {this.opScore[0].g_reply_score ?
                                                    <span className="score">
                                                        {this.opScore[0].g_reply_score}
                                                    </span> :
                                                    <span className="z-none">
                                                        尚未录入
                                    </span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        )}
                    </div>
                </div>

            </div >
        );
    }
}
