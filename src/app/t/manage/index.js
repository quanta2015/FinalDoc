import { Component } from 'preact'

import CheckBlock from '../../../component/ContentT/Check';
import { Drawer } from 'antd';
import * as urls from '../../../constant/urls'
import BaseActions from '../../../component/BaseActions';
import PublishBlock from '../../../component/ContentT/Publish'

import style from './style.scss';

let me = {
  tea_id : '20020732'
}

const filter = (t)=>{
  return {id:t.id,name:t.topic,status:(t.status==2?4:t.status)}
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
  }

  componentDidMount(){
    this.getTopicList();
  }

  getTopicList = async ()=>{
    let data = await this.post(urls.API_SYS_GET_TOPIC_BY_TEACHER_ID,{tea_id:me.tea_id})
    data = data.data.map(filter);
    data.sort(sorter);
    this.setState({toplist:data})
  }

  showDrawer = (id) => {
    this.setState({
      tid:id,
      visible: true
    },()=>{this.child.setBlocks();});
    
  };

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

        <CheckBlock change={this.showDrawer} toplist={this.state.toplist}  close={this.onClose}/>
        <Drawer
          forceRender={true}
          width={520}
          title="课题发布"
          placement={placement}
          closable={false}
          onClose={this.onClose}
          visible={visible}
          key={placement}
        >
          <PublishBlock tid={tid} close={this.onClose} ref={c=>this.child = c}/>
        </Drawer>
      </div>
		);
	}
}
