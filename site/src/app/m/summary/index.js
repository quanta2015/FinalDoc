import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { route } from 'preact-router';
import "./style.scss"
import { Input,Button,message } from 'antd';

const { TextArea } = Input;

 

@inject('manageStore', 'userStore')
@observer
export default class Home extends Component {
    state = {
        summary: undefined,
        
    }
    

    @computed
    get usr() {
        return this.props.userStore.usr;
    }

    componentDidMount() {
        if (!this.usr.id) {
            route('/')
        }
    }
    handleTextareaChange(e) {
        console.log(e.target.value,"eee")
        this.setState({
            summary: e.target.value
        })
    }

    handsummary = async () => {
        if (this.state.summary === undefined) {
            message.info("内容不能为空")
            return;
        }
        let temp = { 'summary': this.state.summary }
        console.log(temp, "提交")
        this.setState({
            summary: undefined,

        })

    }

    render() {
        

        return (
            <div className="g-m-cnt">
                 
                <div className="g-m g-rp">
                    <div class="m-title">杭州师范大学本科生毕业设计（论文）质量评析与总结表</div>
                 

                    <table  width='800' cellspacing="0" cellpadding="0" style="border-collapse: collapse" class='t2'>
                        
                        <tbody>
                        <tr  >
                                <th colspan="2" width="860">毕业生人数</th>
                            <td colspan="2" width="860">0000</td>
                                <th colspan="2" width="860">论文总篇数</th>
                            <td colspan="2" width="860">0000</td>
                        </tr>
                            <tr  >
                                <th colspan="2" >论文答辩人数</th>
                                <td colspan="6">0000</td>
                                 
                            </tr>
                        <tr>
                            <th colspan="2" rowspan="2">论文类型</th>
                            <td colspan="6" rowspan="2" class="t2-text-left">
                                1．毕业论文篇数：<br/>
                                2．毕业设计篇数：<br />
                                3．毕业创作篇数：<br />
                                4．调查报告篇数：<br />
                            </td>
                               
                                
                        </tr>
                             
                            <tr>
                            </tr>
                        <tr>
                                <th colspan="2" rowspan="5">指导教师情况</th>
                                <th colspan="1">职称</th>
                                <th colspan="1">人数</th>
                                <th colspan="1">各职称占总指导人数的百分比</th>
                                <th colspan="1">指导学生篇数</th>
                                <th colspan="2">指导篇数占本专业总篇数百分比</th>
                               
                           
                        </tr>
                            <tr>
                                <td colspan="1">正高</td>
                                <td colspan="1">0000</td>
                                <td colspan="1">0000</td>
                                <td colspan="1">0000</td>
                                <td colspan="2">0000</td>
                            </tr>
                            <tr>
                                <td colspan="1">副高</td>
                                <td colspan="1">0000</td>
                                <td colspan="1">0000</td>
                                <td colspan="1">0000</td>
                                <td colspan="2">0000</td>
                            </tr>
                            <tr>
                                <td colspan="1">中级</td>
                                <td colspan="1">0000</td>
                                <td colspan="1">0000</td>
                                <td colspan="1">0000</td>
                                <td colspan="2">0000</td>
                            </tr>
                            <tr>
                                <td colspan="1">总计</td>
                                <td colspan="1">0000</td>
                                <td colspan="1">0000</td>
                                <td colspan="1">0000</td>
                                <td colspan="2">0000</td>
                            </tr>
                          
                            <tr>
                                <th colspan="2" rowspan="3">论文成绩评定结果</th>
                                <th colspan="1">等级</th>
                                <th colspan="1">优</th>
                                <th colspan="1">良</th>
                                <th colspan="1">中</th>
                                <th colspan="1">及格</th>
                                <th colspan="1">不及格</th>
                               


                            </tr>
                            <tr>
                                 
                                <th colspan="1">人数</th>
                                <td colspan="1">0000</td>
                                <td colspan="1">0000</td>
                                <td colspan="1">0000</td>
                                <td colspan="1">0000</td>
                                <td colspan="1">0000</td>


                            </tr>
                            <tr>
                                
                                <th colspan="1">百分比</th>
                                <td colspan="1">0000</td>
                                <td colspan="1">0000</td>
                                <td colspan="1">0000</td>
                                <td colspan="1">0000</td>
                                <td colspan="1">0000</td>
                                 

                            </tr>
                        </tbody>
                    </table>

                    <div class="m-sum-con"><span class="m-sum-exp">毕业论文质量评析与总结</span>（含①毕业论文撰写整体水平〈选题与研究方法、知识的掌握与运用、科研素质与创造性思维、语言与文字能力等〉；②开题、教师指导与中期检查情况；③如何提高学生毕业论文质量的意见与措施等）。</div>
                    <TextArea rows={6} 
                        value={this.state.summary}
                        onChange={this.handleTextareaChange.bind(this) }/>
                    <div className="btn-sbm"><Button  type="primary" onClick={this.handsummary}> 提交</Button></div>

                    <br>
                    </br><br></br>
                    {/* <div className='trrdd'>
                        <Row>
                            <Col span={6}>毕业生人数</Col>
                            <Col span={6}>col</Col>
                            <Col span={6}>论文总篇数</Col>
                            <Col span={6}>col</Col>
                            
                        </Row>
                        <Row>
                            <Col span={6} >论文答辩人数</Col>
                            <Col span={18}>col-12</Col>
                        </Row>
                        <Row>
                            <Col span={6} className='t11'>论文答辩人数</Col>
                            <Col span={18} className='t11'>
                                <Row>
                                    <Col span={24} >论文答辩人数</Col>
                                    <Col span={24}>col-12</Col>
                                    <Col span={24} >论文答辩人数</Col>
                                    <Col span={24}>col-12</Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                            <Col span={6}>col-6</Col>
                        </Row>
                    </div> */}
                 
                  
                </div>
            </div>
        );
    }
}
