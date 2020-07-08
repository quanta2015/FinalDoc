import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';
import { Tag, Button, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import FileUpload from '../../../component/FileUpload';
import { FILE_UPLOAD_TYPE, STU_FU_STATUS } from '../../../constant/data'
import './index.scss'
import LogDrawer from '../../../component/LogDrawer';

//传入列表，返回当前所处阶段
let getStage = (status, info) => {
    let tmp = Math.abs(status) - 4;
    if (tmp < 0 && !info) {
        return -1; 
    } else if (tmp < 0 && info){ 
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
            showDrawer: false,
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

    showDrawer = () => {
        this.setState({
            showDrawer: true,
        })
    }

    onClose = () => {
        this.setState({
            showDrawer: false,
        })
    }
    render() {
        const currStage = getStage(this.selectTpInfo.status, this.selectTpInfo.f_task);
        console.log(currStage);
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
                                                        {   id === currStage && this.selectTpInfo.status < 0 &&
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
                    <Button className="u-log" type="primary" onClick={this.showDrawer} size="small"><PlusOutlined />指导日志</Button>
                    <LogDrawer
                        showDrawer={this.state.showDrawer}
                        onClose={this.onClose}
                    />
                    <div className="m-topic-info">
                        {FILE_UPLOAD_TYPE.map((item) =>
                            <div className="m-stage">
                                <h3 className="u-title">{item.stage}</h3>
                                <div>
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
            </div>
        );
    }
}
