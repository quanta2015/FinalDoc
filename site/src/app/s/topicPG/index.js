import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';
import { Tag, Button, Modal, Timeline } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import FileUpload from '../../../component/FileUpload';
import { FILE_UPLOAD_TYPE, STU_FU_STATUS } from '../../../constant/data'
import './index.css'
import LogDrawer from '../../../component/LogDrawer';

//传入列表，返回当前所处阶段
let getStage = (list) => {
    for(let i = 0;i < list.length;i ++){
        if ((list[i] !== 0 && list[i + 1] === 0) || (i === list.length - 1 && list[i] !== 0)) {
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
    get selectTpInfo() {
        return toJS(this.props.studentStore.selectTpInfo);
    }

    @computed
    get timeList() {
        return toJS(this.props.studentStore.timeList);
    }

    @computed
    get currStage() {
        return this.props.studentStore.currStage;
    }

    componentDidMount() {
        //todo: 后端获取3个阶段显示的时间点列表 更新store中的值
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
        const link = 'https://youth.hznu.edu.cn/upload/resources/file/2020/06/24/7589612.doc'
        return (
            <div className="g-topic">
                <div className="m-line">
                    <div className="m-pType">{this.selectTpInfo.type}</div>
                    <div className="m-pTopic bold">{this.selectTpInfo.topic}</div>
                    <div className="bold">{this.selectTpInfo.name}</div>
                </div>
                <div className="interval">
                    <h2 className="m-title bold">论文进度</h2>
                    <div>
                        <ul className="m-timeLine">
                            {
                                this.timeList.map((item, id) => 
                                    <li className={item.status > 0 ? this.currStage === id ? "m-timeStamp focus": "m-timeStamp active" : "m-timeStamp"}>
                                        <div className="m-statusItem">
                                            <h3>{item.time}</h3>
                                            {
                                                ((item.title === '任务书') || item.title === '成绩审定') ?
                                                item.status ?
                                                <p onClick={() => this.downloadFile(item)} style={{ textDecoration: "underline", cursor: "pointer"}}>{item.title}</p>:
                                                <p>{item.title}</p>:
                                                <Tag onClick={() => this.showModal(item)} color={STU_FU_STATUS[item.status].color}>{item.title}</Tag>
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
                    <Button type="primary" onClick={this.showDrawer} size="small" className="left-right"><PlusOutlined />指导日志</Button>
                    <LogDrawer
                        showDrawer={this.state.showDrawer} 
                        onClose={this.onClose}
                    />
                    <div className="m-topicInfo m-line">
                        {FILE_UPLOAD_TYPE.map((item) =>
                            <div className="m-stage">
                                <h3 className="bold">{item.stage}</h3>
                                <div>
                                    {item.file.map((item) =>
                                        <div className="m-file right-interval bottom-interval floatLeft"><FileUpload type={item} tpInfo={this.selectTpInfo ? this.selectTpInfo : {}} /></div>
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
                                <Tag className="m-grade">暂未通过</Tag>:
                                <span className="m-grade">{item.grade}</span>
                            }
                        </p>
                    )}
                </Modal>
            </div>
        );
    }
}
