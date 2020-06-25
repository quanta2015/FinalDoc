import { Component, h } from 'preact'
import { inject } from 'mobx-react'

import style from './style.scss';
import { message,Select } from 'antd'
import NavBar from '../../../component/NavBar';
import PublishBlock from '../../../component/NavT/Publish';
const { Option } = Select;

import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

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
        <NavBar/>
        <PublishBlock/>
			</div>
		);
	}
}
