import { Component } from 'preact';
import { inject } from 'mobx-react'
import { route } from 'preact-router';
import { Input } from 'antd';
import { Select } from 'antd';
import { Button } from 'antd';
const { Option } = Select;
const { TextArea } = Input;

import { Transfer } from 'antd';

import './index.css'

let s;
var users = [
  {
    uid: 1,
    name: 'A'
  }, {
    uid: 2,
    name: 'B'
  }, {
    uid: 3,
    name: 'C'
  }, {
    uid: 4,
    name: 'D'
  }, {
    uid: 5,
    name: 'E'
  }
];

users = users.map(x => { return { key: x.uid.toString(), title: x.name } })

class Publish extends Component {
  state = {
    mockData: users,
    targetKeys: ["1"],
  }

  constructor(props) {
    super(props)
  }

  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };

  clear=e=>{
    this.name.value = "";
    this.note.setState({value:""})
    this.type.base.textContent="";
    this.setState({targetKeys: []})
  }

  postInfo=()=>{
    console.log(this.name.value);
    console.log(this.state.targetKeys);
    console.log(this.note.state.value);
    console.log(this.type.base.textContent);
  }

  render() {
    return (
      <div className="publish-block">
        <form action="" method="post">
          <div className="input-line">
            <div className="input-left">课题名</div>
            <div className="input-right">
              <input 
              ref={name=>this.name=name}
              className="have-placehoder" type="text" placeholder="请输入课题名" />
            </div>
          </div>
          <div className="input-line">
            <div className="input-left">项目类别</div>
            <div className="input-right">
              <Select
                ref={type=>this.type=type}
                className="have-placehoder"
                showSearch
                style={{ width: 250 }}
                placeholder="选择项目类别"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option>
              </Select>
            </div>
          </div>
          <div className="input-line">
            <div className="input-left">简介</div>
            <div className="input-right">
              <TextArea 
              ref={note=>this.note=note}
              style={{ width: 500 }} rows={4} placeholder="输入您的简介" className="have-placehoder" />
            </div>
          </div>

          <Transfer
            ref={nameList=>this.nameList=nameList}
            id="transfer"
            dataSource={this.state.mockData}
            showSearch
            filterOption={this.filterOption}
            targetKeys={this.state.targetKeys}
            onChange={this.handleChange}
            render={item => item.title}
          />

          <div className="input-line">
            <div className="input-left"></div>
            <div className="input-left">
              <Button type="primary" onClick={this.postInfo}>提交</Button>
            </div>
            <div className="input-left">
              <Button onClick={this.clear}>清空</Button>
            </div>
          </div>
        </form>

      </div>
    )
  }
}



export default Publish;