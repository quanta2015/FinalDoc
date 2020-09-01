import { Component, options } from 'preact';
import { route } from 'preact-router';

import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';

import { InputNumber,
         Button,
         Input,
         Form,
         message,
         Select,
} from 'antd';

const { Option } = Select;
const { TextArea } = Input;

import './style.scss';

const tea_form = [
    {
        title: '工作表现',
        content: [
            '①工作努力，具良好的学习与工作态度。',
            '②独立、自主获取相关数据等材料。',
            '③无抄袭他人研究成果和伪造相关数据等行为',
        ],
    },
    {
        title: '选题质量',
        content: [
            '①选题符合专业培养目标，体现专业特点和综合训练的基本要求。',
            '②选题贴切，有较强科学性，工作量适当，难易度适中。',
            '③符合本学科的发展，结合生产、科研和实验室建设任务等实际问题，具有一定的理论研究意义和实际应用价值。',
        ],
    },
    {
        title: '能力水平',
        content: [
            '①能独立查阅相关文献或调研；能较好地理解课题任务并提出课题实施计划；有收集、加工各种信息及获取新知识的能力。',
            '②设计方案合理可行，数据正确可靠，论证充分，理论分析与计算正确；能运用所学知识和技能去发现与解决实际问题。',
            '③能运用软、硬件平台进行资料搜集、加工、处理和辅助设计等。',
            '④能按学校有关设计（论文）规定阅读、翻译一定量的本专业外文资料，翻译准确、通顺、文字流畅，有外文摘要和外文书目。',
        ],
    },
    {
        title: '成果质量',
        content: [
            '①设计说明（论文）较完整地回答了题目所设定的有关问题。',
            '②综述简练完整，有见解；立论正确，论述充分，结论严谨合理；实验正确，分析处理科学。',
            '③文字通顺，技术用语准确，符号统一，编号齐全，图表完备整洁、规范正确；用语格式、图表、数据、各种资料的运用与引用规范。篇幅符合本专业规定要求。',
        ],
    },
    {
        title: '创新性',
        content: [
            '①对前人工作有改进或突破，或有独特见解，有一定的应用价值。',
        ],
    },
];

const pyr_form = [
    {
        title: '选题质量',
        content: [
            '①选题符合专业培养目标，体现专业特点和综合训练的基本要求。',
            '②选题贴切，有较强科学性，工作量适当，难易度适中。',
            '③符合本学科的发展，结合生产、科研和实验室建设任务等实际问题，具有一定的理论研究意义和实际应用价值。',
        ],
    },
    {
        title: '实际能力设计水平',
        content: [
            '①能独立查阅相关文献或调研；能较好地理解课题任务并提出课题实施计划；有收集、加工各种信息及获取新知识的能力。',
            '②设计方案合理可行，数据正确可靠，论证充分，理论分析与计算正确；能运用所学知识和技能去发现与解决实际问题。',
            '③能运用软、硬件平台进行资料搜集、加工、处理和辅助设计等。',
            '④能按学校有关设计（论文）规定阅读、翻译一定量的本专业外文资料，翻译准确、通顺、文字流畅，有外文摘要和外文书目。',
        ],
    },
    {
        title: '成果质量',
        content: [
            '①设计说明（论文）较完整地回答了题目所设定的有关问题。',
            '②综述简练完整，有见解；立论正确，论述充分，结论严谨合理；实验正确，分析处理科学。',
            '③文字通顺，技术用语准确，符号统一，编号齐全，图表完备整洁、规范正确；用语格式、图表、数据、各种资料的运用与引用规范。篇幅符合本专业规定要求。',
        ],
    },
    {
        title:"设计作品（实物）验收",
        content:[
            '①设计作品与选题任务书一致，有作品设计说明书',
            '②技术指标、功能符合任务书要求，圆满完成任务'
        ]
    },
    {
        title: '创新性',
        content: [
            '①对前人工作有改进或突破，或有独特见解，有一定的应用价值。',
        ],
    },
]; 

@inject('teacherStore', 'userStore')
@observer
export default class Home extends Component {
	constructor(props) {
		super(props)
		this.state = {
            score: [null, null, null, null, null, null],
            comment: null,
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
        return toJS(this.props.teacherStore.auditFD_isTutor);
    }

    componentDidMount(){
        console.log(this.props.teacherStore.auditFD_checkedTopic)
    }

    //提交表单
    handleFormSubmit(form){
        let comment = form.getFieldValue("comment");
        let score = [form.getFieldValue("score0"), 
                    form.getFieldValue("score1"), 
                    form.getFieldValue("score2"),
                    form.getFieldValue("score3"),
                    form.getFieldValue("score4"),
                    form.getFieldValue("score5")
                ];
        let pass = form.getFieldValue("pass");
        console.log(score);

        let flag = 0;
        if(comment === undefined || comment === "")
            flag = 1;
            
        score.map((item) => {
            if(item === undefined || item === null)
                flag = 1;
        })

        if(flag === undefined || comment === "")
            flag = 1;

        if(flag)
            message.error("表单未完善");
        else{
            let post_data = {"topicId":this.props.teacherStore.auditFD_checkedTopic,"comment":comment,"score":score,"pass":pass};
            console.log(post_data);
            if(this.isTutor)
                this.props.teacherStore.AuditFd_submitTutorForm(post_data)
                .then(()=>{route("/t_manage")});
            else
                this.props.teacherStore.AuditFd_submitTeamForm(post_data)
                .then(()=>{route("/t_auditFD")});
        }
    }

    setScore(form,score,index){
        let name = "score"+index;
        form.setFieldsValue({
            [name]: score})
    }

	render() {
        const [form] = Form.useForm();
        let guidance_standards = tea_form;

        if(!this.isTutor)
            guidance_standards = pyr_form;

		return (
			<div className="g-content" data-component="t-formFD">
                <Form form={form}>
                <div className="steps-content">
                    
                        <div>
                            {guidance_standards.map( (item,index) => 
                                <div class="m-block">
                                    <div class="u-content">
                                        <p class="u-content-title">{item.title}</p>
                                        {item.content.map(e=><>{e}<br/></>)}
                                    </div>
                                    <div class="u-righter">
                                        <Form.Item className="u-input-num-item" name={"score"+index} rules={[{ required: true, message: '请输入分数' }]}>
                                            <InputNumber min={0} max={100} placeholder="分数"/>
                                        </Form.Item>
                                        <div class="u-select">
                                            <div class="u-select-block" onClick={this.setScore.bind(this,form,95,index)}>优</div>
                                            <div class="u-select-block" onClick={this.setScore.bind(this,form,85,index)}>良</div>
                                            <div class="u-select-block" onClick={this.setScore.bind(this,form,75,index)}>中</div>
                                            <div class="u-select-block" onClick={this.setScore.bind(this,form,65,index)}>差</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <Form.Item className="u-comment" name="comment" rules={[{ required: true, message: '请输入你的导师评语' }]}>
                                <TextArea rows={3} placeholder={"导师评语"}/>
                            </Form.Item>
                        </div>
                    
                </div>

                <div className="m-footer-action">
                    <Button type="primary" htmlType="submit" onClick={this.handleFormSubmit.bind(this, form)}>
                        提交
                    </Button>

                    <Form.Item name="score5" rules={[{ required: true, message: '请输入成绩' }]}>
                        <InputNumber min={0} max={100} placeholder="分数" className="u-mainsocre"/>
                    </Form.Item>
                    成绩：
                    
                    <Form.Item name="pass" rules={[{ required: true ,message: '请选择是否达到答辩要求' }]}>
                        <Select className="m-footer-action-select" style={{ width: 150}}>
                            <Option value="1">可以答辩</Option>
                            <Option value="2">不可以答辩</Option>
                            <Option value="3">修改后可以答辩</Option>
                        </Select>
                    </Form.Item>
                    是否达到答辩要求：
                </div>

                </Form>
			</div>
		);
	}
}
