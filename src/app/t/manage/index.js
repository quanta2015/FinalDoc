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
    modal_visiable:false,
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
    console.log(data);
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

  showModal = async ()=>{
    let data = await this.post(urls.API_SYS_GET_TOPIC_CHECK_STUDNET,{tea_id:me.tea_id})
    console.log(data);
    
    data = data.data;
    this.setState({
      checkList:data,modal_visiable:true
    })
    // this.setState({
    //   checkList:[{id:2,topic:'哈哈哈哈',sid:'20192106010',name:'李兆荣'}],
    //   modal_visiable:true
    // })
  }

  handleCancel=()=>{
    this.setState({modal_visiable:false})
  }

	render() {
    const { placement, visible,tid } = this.state;
		return (
      <div className="g-home">

        <CheckBlock change={this.showDrawer} toplist={this.state.toplist}  close={this.onClose} openCheckModal={this.showModal}/>
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
        <Modal
          visible={this.state.modal_visiable}
          title="申请列表"
          width={800}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              关闭
            </Button>
          ]}
        >
          {this.state.checkList.length!=0&&
          <ReviewBlock list={this.state.checkList}/>
          }
          {this.state.checkList.length==0&&
          <span>您暂时没有学生申请哦</span>
          }
          
        </Modal>
      </div>
		);
	}
}
