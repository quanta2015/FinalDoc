import { Component } from 'preact'
import { inject } from 'mobx-react'
import { Form, Input, Button, Checkbox } from 'antd';
import style from './style.css';
import { message, Select } from 'antd'
const { Option } = Select;

function onChange(value) {
  console.log(`selected ${value}`);
}

function onBlur() {
  console.log('blur');
}

function onFocus() {
  console.log('focus');
}

function onSearch(val) {
  console.log('search:', val);
}

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

function handleChange(value) {
  console.log(`selected ${value}`);
}


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

 
  const onFinish = values => {
    console.log('Success:', values);
    this.form.resetFields();
  };

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
    
  };


 

@inject('manageStore')
export default class Home extends Component {
  state = {
    tea_name_2: [],
    // id,tid,topic
    topic_name: [],
    select_leader:" ",
    select_member: [],
  }

  async componentDidMount() {
    let tea = await this.props.manageStore.getTeaList()
    console.log(this.state)
    
    let teaName = []
    tea.data.map((item) =>
      teaName.push({ tid: item.uid, value: item.uid + " " + item.name })
    )
    // console.log(topic)
    this.setState({ tea_name_2: teaName}, () => { message.info("ok"),console.log(this.state.tea_name_2) });
  }

  addSelectTeacher = (value) => {
    console.log(`selected ${value}`);
    this.setState({
      select_leader: value
    }, () => { console.log(this.state.select_leader) })
  }

  // handleResetClick = e => {
  //   this.props.form.resetFields();
  //   this.props.form.setFieldsValue({
  //     match_type_v: null,
  //   })
  // };
 
  

	render() {
    
		return (
			<div className="g-home">
        <Form
        
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues=""
          
        >
          <Form.Item
            label="组长"
            name="leader"
            rules={[{ required: true, message: 'Please input 小组组长!' }]}
          >
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a person"
              optionFilterProp="children"
              onChange={this.addSelectTeacher}
              onFocus={onFocus}
              onBlur={onBlur}
              onSearch={onSearch}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0


              }
            >
              {this.state.tea_name_2.map((item, i) =>
                <Select.Option key={item.value}>{item.value}</Select.Option>
              )}


            </Select>
          </Form.Item>

          <Form.Item
            label="小组成员"
            name="member"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Please select"

              onChange={this.handleChange}
            >
              {children}
            </Select>
          </Form.Item>



          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit"
               >
              Submit
        </Button>
          </Form.Item>
        </Form>
			</div>
		);
	}
}
