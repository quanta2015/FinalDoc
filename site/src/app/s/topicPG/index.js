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
let getStage = (list) => {
    for(let i = 0;i < list.length;i ++){
        let curr = list[i].status;
        let next = list[i + 1].status;
        if (( curr !== 0 && next === 0) || (i === list.length - 1 && curr !== 0)) {
            return i;
        }
    }
    return -1;
}

@inject('studentStore', 'userStore')
@observer
export default class TopicPG extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            selectItem: null,
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
        let params = { file: item.info, id: this.selectTpInfo.sid, name: item.title };
        this.props.userStore.downloadFile(params)
        .then(r => {
            if (!r) {
                message.error('网络错误');
            }
        })
    }

    showModal = (item) => {
        this.setState({
            showModal: true,
            selectItem: item
        })
    }

    handleCancel = (e) => {
        this.setState({
            showModal: false
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
        const { selectItem, showModal } = this.state;
        const currStage = getStage(this.timeList);
        return (
            <div className="g-topic">
                <div className="m-line space-bwt">
                    <div className="m-pType">{this.selectTpInfo.type}</div>
                    <h2 className="m-pTopic bold">{this.selectTpInfo.topic}</h2>
                    <div className="m-pname bold">{this.selectTpInfo.name}</div>
                </div>
                <div className="interval">
                    <h2 className="m-title bold">论文进度</h2>
                    <div>
                        <ul className="m-time-line">
                            {
                                this.timeList.map((item, id) => 
                                    <li className={item.status > 0 ? currStage === id ? "m-time-stamp focus": "m-time-stamp active" : "m-time-stamp"}>
                                        <div className="m-status-item">
                                            <h3>{item.time}</h3>
                                            {
                                                ((item.title === '任务书') || item.title === '成绩审定') ?
                                                item.status ?
                                                <p className="download" onClick={() => this.downloadFile(item)}>{item.title}</p>:
                                                <p>{item.title}</p>:
                                                <Tag 
                                                    onClick={() => this.showModal(item)} 
                                                    color={STU_FU_STATUS[item.status].color}
                                                >
                                                    {item.title}
                                                </Tag>
                                            }
                                        </div>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
                <div className="interval">
                    <h2 className="m-title bold">材料递交</h2>
                    <Button className="left-right" type="primary" onClick={this.showDrawer} size="small"><PlusOutlined />指导日志</Button>
                    <LogDrawer
                        showDrawer={this.state.showDrawer} 
                        onClose={this.onClose}
                    />
                    <div className="m-topic-info m-line space-bwt">
                        {FILE_UPLOAD_TYPE.map((item) =>
                            <div className="m-stage">
                                <h3 className="bold">{item.stage}</h3>
                                <div>
                                    {item.file.map((item) =>
                                        <div className="m-file right-interval float-left">
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
                <Modal
                    title={selectItem ? selectItem.title : ''}
                    visible={showModal}
                    onCancel={this.handleCancel}
                    footer={[]}
                >
                    {
                        selectItem && selectItem.info.map((item)=>
                        <p>
                            <span>{item.name}:  </span>
                            {   item.grade === 0 ?
                                <Tag>暂未通过</Tag>:
                                <span>{item.grade}</span>
                            }
                        </p>
                    )}
                </Modal>
            </div>
        );
    }
}
