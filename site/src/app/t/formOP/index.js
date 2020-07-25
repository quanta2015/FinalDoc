import { Component } from 'preact';
import { route } from 'preact-router';

import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';

import { Divider,
         InputNumber,
         List,
         Button,
         Input,
         Collapse,
         Form,
         message,
} from 'antd';

import { DownloadOutlined } from '@ant-design/icons';
const { TextArea } = Input;
const { Panel } = Collapse;

import './style.scss';

@inject('teacherStore', 'userStore')
@observer
export default class Home extends Component {
	constructor(props) {
		super(props)
		this.state = {
            score: [null, null, null, null, null, null],
            translation: null,
            summary: null,
            report: null,
            reply: null,
            replyScore: null,
		}
	}

	@computed
	get usr() {
		return this.props.userStore.usr;
    }
    
    @computed
    get selectedTopic() {
        return toJS(this.props.teacherStore.selectedTopic);
    }

    @computed
    get isTutor() {
        return toJS(this.props.teacherStore.auditOP_isTutor);
    }

    @computed
    get isTeamLeader() {
        return toJS(this.props.teacherStore.auditOP_isTeamLeader);
    }

    //提交表单
    handleFormSubmit(form){
        let translation = form.getFieldValue("translation");
        let summary = form.getFieldValue("summary");
        let report = form.getFieldValue("report");
        let reply = form.getFieldValue("reply");
        let replyScore = form.getFieldValue("replyScore");
        let score = [form.getFieldValue("score0"), 
                    form.getFieldValue("score1"), 
                    form.getFieldValue("score2"),
                    form.getFieldValue("score3"),
                    form.getFieldValue("score4"),
                    form.getFieldValue("score5")]

        let flag = 0;
        if(this.isTutor)
        {
            if(translation === undefined || translation === "")
                flag = 1;
            if(summary === undefined || summary === "")
                flag = 1;
            if(report === undefined || report === "")
                flag = 1;
        }
        
        if(reply === undefined || reply === "")
            flag = 1;
        if(replyScore === undefined || replyScore === "")
            flag = 1;
        score.map((item) => {
            if(item === undefined || item === "")
                flag = 1;
        })

        if(flag)
            message.error("表单未完善");
        else{
            if(this.isTutor)
                this.props.teacherStore.AuditOp_submitTutorForm({"topicId":this.selectedTopic.id,
                                                                "translation":translation,
                                                                "summary":summary,
                                                                "report":report,
                                                                "reply":reply,
                                                                "replyScore":replyScore,
                                                                "score":score})
                .then(()=>{route("/t_auditOP")});
            else
                this.props.teacherStore.AuditOp_submitTeamForm({"topicId":this.selectedTopic.id,
                                                                "reply":reply,
                                                                "replyScore":replyScore,
                                                                "score":score})
                .then(()=>{route("/t_auditOP")});
        }
    }

	render() {
        const [form] = Form.useForm();

        const standards = [
            '评分标准1：选题符合专业培养目标，体现专业特点和综合训练的基本要求。选题贴切，有较强科学性，工作量适当，难易度适中。符合本学科的发展，结合生产、科研和实验室建设任务等实际问题，具有一定的理论研究意义和实际应用价值。',
            '评分标准2：能独立查阅相关文献或调研；能较好地理解课题任务并提出课题实施计划；有收集、加工各种信息及获取新知识的能力。设计方案合理可行，数据正确可靠，论证充分，理论分析与计算正确；能运用所学知识和技能去发现与解决实际问题。能运用软、硬件平台进行资料搜集、加工、处理和辅助设计等。能按学校有关设计（论文）规定阅读、翻译一定量的本专业外文资料，翻译准确、通顺、文字流畅，有外文摘要和外文书目。',
            '评分标准3：设计说明（论文）较完整地回答了题目所设定的有关问题综述简练完整，有见解；立论正确，论述充分，结论严谨合理；实验正确，分析处理科学文字通顺，技术用语准确，符号统一，编号齐全，图表完备整洁、规范正确；用语格式、图表、数据、各种资料的运用与引用规范。篇幅符合本专业规定要求',
            '评分标准4：......',
            '评分标准5：......',
            '评分标准6：......',
        ];

		return (
			<div className="g-content" data-component="t-formOP">
                <Form
                    name="basic"
                    form={form}
                >
                <div class="m-title">
                </div>
                <div class="m-header-audit">
                    <Divider orientation="left" plain>
                        基础评分
                    </Divider>
                    <List
                        bordered
                        dataSource={standards}
                        renderItem={ (item,index) => (
                            <List.Item>
  
                            {this.isTeamLeader && 
                            <div class="u-item-describe">
                                {item}
                            </div>
                            }

                            {!this.isTeamLeader && 
                            <div>
                                {item}
                            </div>
                            }

                            {this.isTeamLeader && 
                            <Form.Item name={"score"+index} rules={[{ required: true, message: '请输入分数' }]}>
                                <InputNumber min={0} max={100} placeholder="分数"/>
                            </Form.Item>}
                            </List.Item>
                        )}
                    />
                </div>

                { this.isTutor &&
                <div class="m-main-audit">
                    <Divider orientation="left" plain>
                        文件审核
                    </Divider>
                    <Collapse
                        defaultActiveKey={['1','2','3']}
                    >
                        <Panel header="外文翻译" key="1" extra={<DownloadOutlined />}>
                            <div class="u-intro">
                                <h3>译文文本要求</h3>
                                <p>1．外文译文不少于3000汉字；</p>
                                <p>2．外文译文本文格式参照论文正文规范（标题、字体、字号、图表、原文信息等）；</p>
                                <p>3．外文原文资料信息列文末，对应于论文正文的参考文献部分，标题用“外文原文资料信息”，内容包括：</p>
                                <ul>
                                    <li>1）外文原文作者；</li>
                                    <li>2）书名或论文题目；</li>
                                    <li>3）外文原文来源：1、出版社或刊物名称、出版时间或刊号、译文部分所在页码。2、网页地址；</li>
                                </ul>
                                <h3>外文原文资料（电子文本或数字化后的图片）</h3>
                                <p>1．外文原文不少于10000印刷字符（图表等除外）；</p>
                                <p>2．外文原文若是纸质的请数字化（图片）后粘贴于译文后的原文资料处，但装订时请用纸质原文复印件附于译文后。</p>
                            </div>
                            <Form.Item name="translation" rules={[{ required: true, message: '请输入你的导师评语' }]}>
                                <TextArea rows={3} placeholder="外文翻译-导师评语"/>
                            </Form.Item>
                        </Panel>
                        <Panel header="文献综述" key="2" extra={<DownloadOutlined />}>
                            <div class="u-intro">
                                <h3>文献综述</h3>
                                <p>含本选题国内外研究现状、研究主要成果、发展趋势、存在问题等内容，字数不少于3000字，力求内容切题，具综合归纳性</p>
                                <h3>查阅中外文献资料目录</h3>
                                <p>所查阅的中外文献资料不得少于15篇（其中至少2篇外文文献），含作者、书名或论文题目、出版社或刊名、出版年月或期号及页码等，未经本人查阅的文献资料目录不得列上</p>
                            </div>
                            <Form.Item name="summary" rules={[{ required: true, message: '请输入你的导师评语' }]}>
                                <TextArea rows={3} placeholder="文献综述-导师评语"/>
                            </Form.Item>
                        </Panel>
                        <Panel header="开题报告" key="3" extra={<DownloadOutlined />}>
                            <div class="u-intro">
                                <h3>选题依据</h3>
                                <p>背景与理论或实践意义、国内外研究现状与发展趋势</p>
                                <h3>研究目标与主要内容</h3>
                                <p>含论文提纲</p>
                                <h3>拟采取的研究方法、研究手段及技术路线、实验方案</h3>
                                <h3>中外文参考文献目录</h3>
                                <p>作者、书名论文题目、出版社或刊号、出版年月或出版期号</p>
                                <h3>研究的整体方案与工作进度安排</h3>
                                <p>内容、步骤、时间</p>
                                <h3>研究的预期目标及主要特点、创新点</h3>
                            </div>
                            <Form.Item name="report" rules={[{ required: true, message: '请输入你的导师评语' }]}>
                                <TextArea rows={3} placeholder="开题报告-导师评语"/>
                            </Form.Item>
                        </Panel>
                    </Collapse>
                </div>
                }

                {this.isTeamLeader && 
                <div class="m-footer-audit">
                    <Divider orientation="left" plain>
                        答辩评分
                    </Divider>
                    <Form.Item name="reply" rules={[{ required: true, message: '请输入你的导师评语' }]}>
                        <TextArea rows={3} placeholder="开题评审意见（主要包括毕业设计（论文）的设计思想、开题准备及进展情况）"/>
                    </Form.Item>
                    <div class="u-reply-score">
                        <Form.Item name="replyScore" rules={[{ required: true, message: '请输入分数' }]}>
                            <InputNumber min={0} max={100} placeholder="分数"/>
                        </Form.Item>
                    </div>
                </div>
                }
                
                {this.isTeamLeader && 
                <div class="m-footer">
                    <Button type="primary" htmlType="submit" onClick={this.handleFormSubmit.bind(this, form)}>
                        提交
                    </Button>
                </div>
                }
                </Form>
			</div>
		);
	}
}
