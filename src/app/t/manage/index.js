import { Component } from 'preact'

import CheckBlock from '../../../component/ContentT/Check';
import { Drawer,Modal,Button   } from 'antd';
import * as urls from '../../../constant/urls'
import BaseActions from '../../../component/BaseActions';
import PublishBlock from '../../../component/ContentT/Publish'
import ReviewBlock from '../../../component/ContentT/Review'

import style from './style.scss';

let me = {
  tea_id : '20100119'
}

const filter = (t)=>{
  return {id:t.id,name:t.topic,status:(t.pass==2?4:t.pass),sid:t.sid}
}
const sorter = (x,y)=>{
  return y.status-x.status;
}

export default class Home extends BaseActions {

  constructor(props){
    super(props)
  }

  state={
    visible: false, 
    placement: 'right',
    tid:null,
    toplist:[],
    checkList:[]
  }

  componentDidMount(){
    this.getTopicList();
  }

  getTopicList = async ()=>{
    let data = await this.post(urls.API_SYS_GET_TOPIC_BY_TEACHER_ID,{tea_id:me.tea_id})
    data = data.data.map(filter);
    data.sort(sorter);
    this.setState({toplist:data});
    //获取申请列表
    data = await this.post(urls.API_SYS_GET_TOPIC_CHECK_STUDNET,{tea_id:me.tea_id})
    data = data.data;
    this.setState({
      checkList:data
    })

  }

  /**
   * 显示右侧抽屉，并根据ID自动赋值
   * @param {int} id 课题ID
   */
  showDrawer = (id) => {
    this.setState({
      tid:id,
      visible: true
    },()=>{this.child.setBlocks();});
    
  };

  /**
   * 关闭右侧抽屉，并刷新课题列表
   */
  onClose = () => {
    this.setState({
      visible: false
    });
    this.getTopicList();
  };

	render() {
    const { placement, visible,tid } = this.state;
		return (
      <div className="g-home">

        <CheckBlock 
          change={this.showDrawer} 
          checkList={this.state.checkList} 
          toplist={this.state.toplist}  
          close={this.onClose}/>
        <Drawer
          forceRender={true}
          width={720}
          title="课题发布"
          placement={placement}
          closable={false}
          onClose={this.onClose}
          visible={visible}
          key={placement}
        >
        <PublishBlock tid={tid} close={this.onClose} ref={c=>this.child = c}/>
        </Drawer>
        {/*
        <ReviewBlock freshList={this.getTopicList} list={this.state.checkList}/>
*/
        }
      </div>
		);
	}
}
