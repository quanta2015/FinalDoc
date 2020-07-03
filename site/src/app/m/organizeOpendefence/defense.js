import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { Radio, Form, Button, message, Select ,InputNumber} from 'antd';
import "./defense.css"
import ManualAllocate from "./manualAllocate.js"
import AutoAllocate from './autoAllocate.js';


 
 


const onFinish = values => {
    console.log('Success:', values);

};

const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);

};


@inject('manageStore')
@observer
export default class Defense extends Component {
    state = {

        // id,tid,topic

        select_leader: " ",
        select_member: [],
        new_arr: [],
        teacher_info: [],
        value:1,
    }
    @computed
    get distributeTopic() {
        return this.props.manageStore.distributeTopic;
    }


    async componentDidMount() {
        await this.props.manageStore.getTeaList();
        let tea = this.distributeTopic.teacher_info;
        console.log(this.state.tea)

        let teaName = []
        tea.map((item) =>
            teaName.push({ tid: item.uid, value: item.Tname })
        )
        // console.log(topic)
        this.setState({ teacher_info: teaName }, () => { message.info("ok") });

    }

    addSelectTeacher = (value) => {
        console.log(`selected ${value}`);
        this.setState({
            select_leader: value
        }, () => { console.log(this.state.select_leader) })

    }

    handleChange = (value) => {
        //console.log(`selected ${value}`);
        this.setState({
            select_member: value
        }, () => { console.log(this.state.select_member, 888) })
    }

    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };
    
    render() {
        this.state.new_arr = [];
        for (let i of this.state.teacher_info) {
            if (this.state.select_member.indexOf(i.value) == -1) {
                this.state.new_arr.push(i.value);

            }
        }
        return (
            <div  >
                <div>1111</div>
                
                    <Form

                        
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                         
                    >
                    
                        <Form.Item
                            label="组长"
                            name="leader"
                            rules={[{ required: true, message: '请选择组长' }]}
                        >
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="请选择教师"
                                optionFilterProp="children"
                                onChange={this.addSelectTeacher}
                                 
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0


                                }
                            >
                                {
                                    this.state.new_arr.map((item, i) =>
                                        <Select.Option key={item}>{item}</Select.Option>

                                    )}

                            </Select>
                        </Form.Item>
                       

                        <Form.Item
                            label="组员"
                            colon="false"
                            name="member"
                            rules={[{ required: true, message: '请选择组员' }]}
                        >

                            <Select
                                mode="multiple"
                                style={{ width:200 }}
                                placeholder="请选择教师"

                                onChange={this.handleChange}
                            >
                                {this.state.teacher_info.map((item, i) =>
                                    
                                    (item.value !== this.state.select_leader) && <Select.Option key={item.value}>{item.value}</Select.Option>

                                )}
                            </Select>


                        </Form.Item>
                       
                        <Radio.Group onChange={this.onChange} value={this.state.value}>
                            <Radio value={1}>自动分配</Radio>
                            <Radio value={2}>手动分配</Radio>
                        </Radio.Group>
                       
                        {(this.state.value === 1) &&
                         <div>
                        <Form.Item
                            label="数量"
                            colon="false"
                            name="num"
                        >
                            <InputNumber size="small" style={{ width: 50 }} min={1} />
                        </Form.Item>

                        
                            <Form.Item 
                            >
                        
                                <Button type="primary" htmlType="submit">
                                    提交
                             </Button>

                            </Form.Item>
                        </div>
                        }
                        {(this.state.value === 2) &&
                        <div>
                        <div>{this.props.children}</div>  
                        <Form.Item
                            label="id"
                            colon="false"
                            name="tpoicid"
                        >

                            
                        
                        <ManualAllocate /> 
                        </Form.Item>
                            <Form.Item>
                            
                            <Button type="primary" htmlType="submit">
                                提交
                             </Button>


                            </Form.Item>
                        </div>
                             
                        }

                         



                         
                    </Form>
                
            </div>
        );
    }
}
