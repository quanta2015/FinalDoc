import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';
import { Tag, Button, Modal, message, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import FileUpload from '../../../component/FileUpload';
import { FILE_UPLOAD_TYPE, STU_FU_STATUS, STU_OP_SCORE } from '../../../constant/data'
import './index.scss'
import LogRecord from '../../../component/LogRecord';
import { QuestionCircleOutlined } from '@ant-design/icons'

//传入列表，返回当前所处阶段
let getStage = (status, info) => {
    let tmp = Math.abs(status) - 7;
    if (tmp < 0 && !info) {
        return -1;
    } else if (tmp < 0 && info) {
        return 0;
    } else if (tmp < 2 && info) {
        return tmp + 1;
    } else if (tmp < 5 && info) {
        return tmp;
    } else if (tmp === 5 && info) {
        return tmp - 1;
    }
}

@inject('studentStore', 'userStore')
@observer
export default class TopicPG extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            selectItem: null,
            showLog: false,
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


    componentDidMount() {
        //todo: 后端获取3个阶段显示的时间点列表 更新store中的值
        if (!this.usr.uid) {
            route('/')
        }
        if (!this.selectTpInfo) {
            route('/s_selectTL')
        }
        if (this.usr.uid) {
            this.props.studentStore.getAllStates({ uid: this.usr.uid })
            this.props.studentStore.getCurrentState({ uid: this.usr.uid })
            this.props.studentStore.getOpenScore({ uid: this.usr.uid })
        }


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

    onClose = () => {
        this.setState({
            showLog: false,
        })
    }

    render() {
        const currStage = getStage(this.selectTpInfo.status, this.selectTpInfo.f_task);
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
                {this.timeList && this.timeList.length !== 0 && this.currState[0] &&
                    < div className="m-cont">
                        <h2 className="u-title">
                            论文进度
                        <Tooltip placement="right" title={text}>
                                <QuestionCircleOutlined style={{ fontSize: 16, color: '#999', paddingLeft: 5 }} />
                            </Tooltip>
                        </h2>
                        <div>
                            <ul className="m-time-line">
                                {
                                    this.currState[0] &&
                                    this.timeList.map((item) =>
                                        <li className={item.time <= this.currState[0].time ? this.currState[0].time === item.time ? "u-time-stamp z-focus" : "u-time-stamp z-active" : "u-time-stamp"}>
                                            <div>
                                                <h3>{item.time}</h3>
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
                        </div>
                    </div>
                }
                <div className="m-cont">
                    <h2 className="u-title">材料递交</h2>
                    <Button className="u-log" type="primary" onClick={this.showLog} size="small"><PlusOutlined />指导日志</Button>
                    <LogRecord
                        showLog={this.state.showLog}
                        onCancel={this.onClose}
                        sid={this.usr.uid}
                    />
                    <div className="m-topic-info">
                        {FILE_UPLOAD_TYPE.map((item, id) =>
                            <div className="m-stage">
                                <h3 className="u-title"><span>0{id + 1} / </span>{item.stage}</h3>
                                <div className="m-filewp">
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
                            </div>
                        )}
                    </div>
                </div>
                {
                    this.opScore.length > 0 &&
                    <div className="m-op-score">
                        <div className="m-nm-lst">
                            {STU_OP_SCORE.map((item) =>
                                <div className="u-nm-itm">
                                    {item.name}
                                </div>
                            )}
                        </div>
                        <div className="m-sc-lst">
                            <div className="u-sc-itm">
                                {this.opScore[0].t_reply_score ?
                                    <span className="score">
                                        {this.opScore[0].t_reply_score}
                                    </span> :
                                    <span className="z-none">
                                        尚未录入
                                    </span>
                                }
                            </div>

                            <div className="u-sc-itm">
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

            </div >
        );
    }
}
