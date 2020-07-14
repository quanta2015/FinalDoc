import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';
import { Tag, Button, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import FileUpload from '../../../component/FileUpload';
import { FILE_UPLOAD_TYPE, STU_FU_STATUS, STU_OP_SCORE } from '../../../constant/data'
import './index.scss'
import LogRecord from '../../../component/LogRecord';

//传入列表，返回当前所处阶段
let getStage = (status, info) => {
    let tmp = Math.abs(status) - 4;
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

    componentDidMount() {
        //todo: 后端获取3个阶段显示的时间点列表 更新store中的值
        if (!this.usr.uid) {
            route('/')
        }
        if (!this.selectTpInfo) {
            route('/s_selectTL')
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
        return (
            <div className="g-stu-prog">
                <div className="m-hd">
                    <div className="u-type">{this.selectTpInfo.type}</div>
                    <h2 className="u-topic">{this.selectTpInfo.topic}</h2>
                    <div className="u-name">{this.selectTpInfo.name}</div>
                </div>
                <div className="m-cont">
                    <h2 className="u-title">论文进度</h2>
                    <div>
                        <ul className="m-time-line">
                            {
                                this.timeList.map((item, id) =>
                                    <li className={id <= currStage ? currStage === id ? "u-time-stamp z-focus" : "u-time-stamp z-active" : "u-time-stamp"}>
                                        <div>
                                            <h3>{item.time}</h3>
                                            {
                                                (item.title === '任务书' || item.title === '成绩审定') && (id <= currStage) ?
                                                    <p className="u-link-file" onClick={() => this.downloadFile(item)}>{item.title}</p> :
                                                    <div>
                                                        <p>
                                                            {item.title}
                                                            {id === currStage && this.selectTpInfo.status < 0 &&
                                                                <span className="u-status">未通过</span>
                                                            }
                                                        </p>
                                                    </div>
                                            }
                                        </div>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
                <div className="m-cont">
                    <h2 className="u-title">材料递交</h2>
                    <Button className="u-log" type="primary" onClick={this.showLog} size="small"><PlusOutlined />指导日志</Button>
                    <LogRecord
                        showLog={this.state.showLog}
                        onCancel={this.onClose}
                        pid={this.selectTpInfo.id}
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
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="m-op-score">
                    <div className="m-nm-lst">
                        {STU_OP_SCORE.map((item) =>
                            <div className="u-nm-itm">
                                {item.name}
                            </div>
                        )}
                    </div>
                    <div className="m-sc-lst">
                        {this.opScore.map((item) =>
                            <div className="u-sc-itm">
                                <span className="score">
                                    {item.score}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
