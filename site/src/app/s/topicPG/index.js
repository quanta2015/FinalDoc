import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';
import { Tag, Button, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import FileUpload from '../../../component/FileUpload';
import { FILE_UPLOAD_TYPE } from '../../../constant/data'
import './index.css'

@inject('studentStore')
@observer
export default class TopicPG extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            selectItem: null
        }
    }

    @computed
    get selectTpInfo() {
        return toJS(this.props.studentStore.selectTpInfo);
    }

    componentDidMount() {
        if(!this.selectTpInfo) {
            route('/s_selectTL')
        }
    }

    showModal = (item) => {
        this.setState({
            showModal: true,
            selectItem: item
        })
    }

    handleOk = (e) => {
        this.setState({
            showModal: false
        })
    }

    handleCancel = (e) => {
        this.setState({
            showModal: false
        })
    }

    render() {
        const { selectItem, showModal } = this.state;
        const link = 'https://youth.hznu.edu.cn/upload/resources/file/2020/06/24/7589612.doc'
        return (
            <div className="g-topic">
                <div>
                    <h2 className="m-title bold">选题信息</h2>
                    <div className="m-topicInfo">
                        <p>论文课题：{this.selectTpInfo.topic}</p>
                        <div className="m-line">
                            <span className="m-paperInfo">指导老师：{this.selectTpInfo.name}</span>
                            <span className="m-paperInfo">论文类型：{this.selectTpInfo.type}</span>
                        </div>
                    </div>
                </div>
                <div className="interval">
                    <h2 className="m-title bold">相关材料</h2>
                    <p className="left-right">当前进度：开题中期</p>
                    <div className="m-topicInfo">
                        <div className="m-line">
                            <span className="m-statusItem">任务下达：<a href={link} download>任务书</a></span>
                            <span className="m-statusItem">开题中期：<Tag color="green" onClick={() => this.showModal({title: '开题中期', id: 0})}>已通过</Tag></span>
                            <span className="m-statusItem">论文审核：<Tag color="red" onClick={() => this.showModal({ title: '论文审核', id: 1 })}>待修改</Tag></span>
                            <span className="m-statusItem">论文答辩：<Tag onClick={() => this.showModal({ title: '论文答辩', id: 2 })}>未提交</Tag></span>
                            <span className="m-statusItem">成绩审定：暂未发布</span>
                        </div>
                    </div>
                </div>
                <div className="interval">
                    <h2 className="m-title bold">材料递交</h2>
                    <Button type="primary" size="small" className="left-right"><PlusOutlined />指导日志</Button>
                    <div className="m-topicInfo m-line">
                        {FILE_UPLOAD_TYPE.map((item)=>
                            <div className="m-stage">
                                <h3 className="bold">{item.stage}</h3>
                                <div>
                                    {item.file.map((item) =>
                                        <div className="m-file right-interval bottom-interval floatLeft"><FileUpload type={item} tpInfo={this.selectTpInfo ? this.selectTpInfo: {}} /></div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <Modal
                    title={selectItem ? selectItem.title : ''}
                    visible={showModal}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <p>timeline</p>
                </Modal>
            </div>
        );
    }
}
