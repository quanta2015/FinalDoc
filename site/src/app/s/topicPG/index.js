import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';
import { Tag, Button, Progress } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import FileUpload from '../../../component/FileUpload';
import { FILE_UPLOAD_TYPE } from '../../../constant/data'
import './index.css'

@inject('studentStore')
@observer
export default class TopicPG extends Component {

    @computed
    get selectTpInfo() {
        return toJS(this.props.studentStore.selectTpInfo);
    }

    componentDidMount() {
        if(!this.selectTpInfo) {
            route('/s_selectTL')
        }
    }

    render() {
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
                            <span className="m-statusItem">开题中期：<Tag color="green">已通过</Tag></span>
                            <span className="m-statusItem">论文审核：<Tag color="red">待修改</Tag></span>
                            <span className="m-statusItem">论文答辩：<Tag color="">未提交</Tag></span>
                        </div>
                    </div>
                </div>
                <div className="interval">
                    <h2 className="m-title bold">材料递交</h2>
                    <Button type="primary" size="small" className="left-right"><PlusOutlined />指导日志</Button>
                    <div className="m-topicInfo">
                        <h3 className="bold">开题中期</h3>
                        <div className="m-line">
                            {FILE_UPLOAD_TYPE[0].FILE.map((item)=>
                                <div className="right-interval"><FileUpload type={item}/></div>
                            )}
                        </div>
                        <h3 className="bold interval">论文审核</h3>
                        <div className="m-line">
                            {FILE_UPLOAD_TYPE[1].FILE.map((item) =>
                                <div className="right-interval"><FileUpload type={item} /></div>
                            )}
                        </div>
                        <h3 className="bold interval">论文答辩</h3>
                        <div className="m-line">
                            {FILE_UPLOAD_TYPE[2].FILE.map((item) =>
                                <div className="right-interval"><FileUpload type={item} /></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
