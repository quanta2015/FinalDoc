import { Component } from 'preact';
import { Steps } from 'antd';
import './index.css'

const { Step } = Steps;

export default class TopicPG extends Component {
    constructor(props) {
        super(props)

        this.state = {
            usrInfo: {
                topicName: '基于快速区域卷积神经网络胰腺癌增强CT自动识别系统的建立及临床测试'
            },
            current: 0
        }
    }

    onChange = current => {
        console.log('onChange:', current);
        this.setState({ current: current });
    };

    render(_, { usrInfo, current }) {
        const link = 'https://youth.hznu.edu.cn/upload/resources/file/2020/06/24/7589612.doc'
		return (
			<div className="g-topic">
                <h3 className="bold">选题信息</h3>
                <div className="m-topicInfo">
                    <p>课题：{usrInfo.topicName}</p>
                </div>
                <Steps
                    type="navigation"
                    size="small"
                    current={current}
                    onChange={this.onChange}
                    className="site-navigation-steps"
                >
                    <Step status="process" title="开课选题" />
                    <Step status="wait" title="提交相关资料"/>
                    <Step status="wait" title="提交论文定稿" disabled/>
                </Steps>
                {current === 0 &&
                    <div className="m-card">
                        <div className="m-cardItem">
                            <h3>报告模板</h3>
                            <a href={link} download>毕业设计（论文）开题报告（学生填写）</a>
                        </div>
                        <div className="m-cardItem">
                            <h3>我的报告</h3>
                            <a href={link} download>毕业设计（论文）开题报告（学生填写）</a>
                        </div>
                    </div>
                }
                
                
			</div>
		);
	}
}
