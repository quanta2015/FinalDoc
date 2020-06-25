import { Component } from 'preact'
import { inject } from 'mobx-react'

import style from './style.scss';
import { message,Select } from 'antd'
const { Option } = Select;

@inject('userStore')
export default class Home extends Component {
  state = {
    proj: [],
  }

  async componentDidMount() {
    let r = await this.props.userStore.getProjList()
    let p = r.filter((item,i)=>{ return item&&(i<10) })
    this.setState({ proj: p },()=>{ message.info("ok") });
  }

	render(_,{ proj }) {
		return (
			<div className="g-home">
        <div className="m-menu">
          <Select
            mode="multiple"
            placeholder = "please select..."
            style= {{'min-width': '100px'}}
            defaultValue={['a10', 'c12']}
          >
            <Option key="1">a10</Option>
            <Option key="2">a11</Option>
            <Option key="3">a12</Option>
          </Select>
        </div>
        <div className="m-list">
          {proj.map((item,i)=>
            <span key={i}>{item.pname}</span>
          )}
        </div>
			</div>
		);
	}
}
