import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { Steps, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './index.css'

const { Step } = Steps;

const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败`);
        }
    },
};

const calPrcIndex = (data) => {
    let count = 0;
    for (let key in data) {
        if (data[key]) {
            count++;
        } else {
            break;
        }
    }
    return count;
}

@inject('studentStore')
@observer
export default class TopicPG extends Component {
    constructor(props) {
        super(props)

        this.state = {
            current: 0,
            submitStatus: {},
            processStatus: []
        }
    }
    @computed
    get topInfo() {
        return this.props.studentStore.topInfo;
    }
    componentDidMount() {
        //获得学生完成各文件的状态
        const r = {
            startTopic: true,
            translation: true,
            literature: false,
            paper: false,
            duplicate: false,
            replyMaterial: false
        };
        let prcIndex = calPrcIndex(r);
        let current = 2;
        let prcStatus = [];
        if (prcIndex < 1) { //第一阶段
            prcStatus = ["process", "wait", "wait"];
            current = 0;
        } else if (prcIndex < 3) {
            prcStatus = ["finish", "process", "wait"];
            current = 1;
        } else if (prcIndex < 6) {
            prcStatus = ["finish", "finish", "process"];
        } else {
            prcStatus = ["finish", "finish", "finish"];
        }
        this.setState({
            submitStatus: r,
            processStatus: prcStatus,
            current: current
        })
    }
    onChange = current => {
        console.log('onChange:', current);
        this.setState({ current: current });
    };
    //提交开题报告
    handleSumbitST = () => {
        console.log('submit');
    }

    render() {
        const { current, processStatus } = this.state;
        const link = 'https://youth.hznu.edu.cn/upload/resources/file/2020/06/24/7589612.doc'
        return (
            <div className="g-topic">
                <h3 className="bold">选题信息</h3>
                <div className="m-topicInfo">
                    <p>课题：{this.topInfo.topicName}</p>
                </div>
                <Steps
                    type="navigation"
                    size="small"
                    current={current}
                    onChange={this.onChange}
                    className="site-navigation-steps"
                >
                    <Step status={processStatus[0]} title="开课选题" />
                    {processStatus && processStatus[1] === "wait" ?
                        <Step status={processStatus[1]} title="提交相关资料" disabled /> :
                        <Step status={processStatus[1]} title="提交相关资料" />
                    }
                    {processStatus && processStatus[2] === "wait" ?
                        <Step status={processStatus[2]} title="提交论文定稿" disabled /> :
                        <Step status={processStatus[2]} title="提交论文定稿" />
                    }
                </Steps>
                {current === 0 &&
                    <div className="m-card">
                        <div className="m-cardItem">
                            <h3>报告模板</h3>
                            <a href={link} download>毕业设计（论文）开题报告（学生填写）</a>
                        </div>
                        <div className="m-cardItem">
                            <h3>我的报告</h3>
                            {
                                this.submitStatus && this.submitStatus.startTopic ?
                                    <a href={link} download>111_aaa_开题报告.doc</a> :
                                    <div className="m-line">
                                        <Upload {...props}>
                                            <Button>
                                                <UploadOutlined /> 点击上传文件
                                        </Button>
                                        </Upload>
                                        <Button
                                            type="primary"
                                            className="linespace"
                                            onClick={() => this.handleSumbitST()}
                                        >
                                            提交
                                    </Button>
                                    </div>
                            }
                        </div>
                    </div>
                }

                {current === 1 &&
                    <div className="m-card">
                        <div className="m-cardItem">
                            <h3>文件模板</h3>
                            <a href={link} download>毕业设计（论文）外文文献翻译参考格式</a><br />
                            <a href={link} download>毕业设计（论文）文献综述参考格式</a><br />
                        </div>
                    </div>
                }
                {current === 2 &&
                    <div className="m-card">
                        <div className="m-cardItem">
                            <h3>文件模板</h3>
                            <a href={link} download>毕业设计（论文）正文参考格式</a><br />
                            <a href={link} download>毕业设计（论文）替代申请表</a><br />
                            <a href={link} download>毕业设计（设计）成绩评审表（答辩组用）</a><br />
                        </div>
                    </div>
                }
            </div>
        );
    }
}
