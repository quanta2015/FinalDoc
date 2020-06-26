import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { Steps } from 'antd';
import './index.css'

const { Step } = Steps;

@inject('studentStore')
@observer
export default class TopicPG extends Component {
    constructor(props) {
        super(props)

        this.state = {
            current: 0
        }
    }

    @computed
    get usr() {
        return this.props.studentStore.usr;
    }

    onChange = current => {
        console.log('onChange:', current);
        this.setState({ current: current });
    };

    render() {
        const { current } = this.state; 
        const link = 'https://youth.hznu.edu.cn/upload/resources/file/2020/06/24/7589612.doc'
		return (
			<div className="g-topic">
                <h3 className="bold">选题信息</h3>
                <div className="m-topicInfo">
                    <p>课题：{this.usr.topicName}</p>
                </div>
                <Steps
                    type="navigation"
                    size="small"
                    current={current}
                    onChange={this.onChange}
                    className="site-navigation-steps"
                >
                    <Step status="process" title="开课选题" />
                    <Step status="wait" title="提交相关资料" disabled/>
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
                            {
                                this.usr.isSubmit && 
                                <a href={link} download>毕业设计（论文）开题报告（学生填写）</a>
                            }
                        </div>
                    </div>
                }
                
                
			</div>
		);
	}
}
