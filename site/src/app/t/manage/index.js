import { Component } from 'preact'
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import CheckBlock from '../../../component/ContentT/CheckFirst';
import CheckBlock2 from '../../../component/ContentT/CheckSecond';
import { Drawer, Modal, Button } from 'antd';
import { route } from 'preact-router';
import * as urls from '../../../constant/urls'
import BaseActions from '../../../component/BaseActions';
import PublishBlock from '../../../component/ContentT/Publish'
import ReviewBlock from '../../../component/ContentT/Review'
import AllTopicList from '../../../component/ContentT/AllTpoicList'
import UploadImg from '../../../component/ImgUpload'

import style from './style.scss';

//将收到的topic数据映射为可以展示的列表
const filter = (t) => {
  t = { id: t.id, name: t.topic, status: (t.pass == 2 ? 100 : t.pass), sid: t.sid }
  return t;
}
//按照通过状态排序topic列表
const sorter = (x, y) => {
  let y1 = y.status;
  if(y1==3)y1 = 10;
  let x1 = x.status;
  if(x1==3)x1 = 10;
  return y1-x1;
}

@inject('userStore')
@observer
export default class Home extends BaseActions {

  @computed
  get usr() {
    return this.props.userStore.usr;
  }

  constructor(props) {
    super(props)
  }
  state = {
    //发布课题抽屉可见性
    visible: false,
    //抽屉位置  
    placement: 'right',
    //当前选中的课题id
    tid: null,
    //课题列表
    toplist: [],
    //审核列表
    checkList: [],
    //发布课题的抽屉是否修改过
    pbChanged: false,
    judgeTopic: true,
    //默认是checkblock1，如果有双选成功的则变成2
    checkBlockState: 0
  }

  componentWillMount(){
    if (!this.usr.id) {
      route('/')
    }
  }

  componentDidMount() {
    this.getTopicList();
  }

  /**
   * 获取自己的课题列表
   */
  getTopicList = async () => {
    await this.setState({checkBlockState: 0});
    let tdata = await this.post(urls.API_SYS_GET_TOPIC_BY_TEACHER_ID, { tea_id: this.usr.uid })
    console.log(tdata);
    tdata = tdata.data.map(filter);
    tdata.sort(sorter);
    this.setState({ toplist: tdata });
    //获取申请列表
    let data = await this.post(urls.API_SYS_GET_TOPIC_CHECK_STUDNET, { tea_id: this.usr.uid })
    data = data.data;
    await this.setState({
      checkList: data
    });
    let x = await this.post(urls.API_TEACHER_GET_SEL,{tid:this.usr.uid});
    let sel = x.data;
    if(tdata.length==0){sel = false;}
    if(sel){
      tdata.forEach(x=>!x.sid?sel=false:1)
    }
    if(sel){
      this.setState({ checkBlockState: 2 })
    }else{
      this.setState({ checkBlockState: 1 })
    }
    
  }

  /**
   * 显示右侧抽屉，并根据ID自动赋值
   * @param {int} id 课题ID
   */
  showDrawer = (id) => {
    this.setState({
      tid: id,
      visible: true
    }, () => { this.child.setBlocks(); });

  };

  justOpenDrawer = () => {
    this.setState({ visible: true })
  }

  /**
   * 关闭右侧抽屉，并刷新课题列表
   */
  onClose = () => {
    this.setState({
      visible: false
    });
    this.getTopicList();
  };

  showTopics = () => {
    this.setState({ modal_visiable: true })
  }

  render() {
    const { placement, visible, tid } = this.state;
    return (
      <div className="manage-home" data-component="t-manage-home">
        {
          this.state.checkBlockState == 1 &&
          <CheckBlock
            change={this.showDrawer}
            checkList={this.state.checkList}
            toplist={this.state.toplist}
            close={this.onClose}
            freshList={this.getTopicList}
            pbChanged={this.state.pbChanged}
            justOpenDrawer={this.justOpenDrawer}
            showAllTopic={this.showTopics}
          />
        }
        {
          this.state.checkBlockState == 2 &&
          <CheckBlock2
            freshList={this.getTopicList}
            checkList={this.state.checkList}
            toplist={this.state.toplist}
            change={this.showDrawer}
            close={this.onClose}
            pbChanged={this.state.pbChanged}
            justOpenDrawer={this.justOpenDrawer}
            showAllTopic={this.showTopics}
          />
        }


        <Drawer
          forceRender={true}
          width={720}
          title={<b>课题发布</b>}
          placement={placement}
          closable={false}
          onClose={this.onClose}
          visible={visible}
          key={placement}
        >
          <PublishBlock tid={tid} close={this.onClose} ref={c => this.child = c} needGoon={(x) => { this.setState({ pbChanged: x }) }} />
        </Drawer>

        <Modal
          title="课题列表"
          visible={this.state.modal_visiable}
          onCancel={() => { this.setState({ modal_visiable: false }) }}
          footer={null}
          width={1200}
        >
          <AllTopicList uid={this.usr.uid} />
        </Modal>






      </div>


    );
  }
}
