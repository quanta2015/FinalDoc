/*
 * @Author: your name
 * @Date: 2020-08-10 14:43:23
 * @LastEditTime: 2020-08-23 17:47:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \FinalDoc\site\src\component\ContentT\StuMethods2\index.js
 */
import BaseActions from '../../BaseActions';
import * as urls from '../../../constant/urls'
import {  Modal, Tooltip, Divider } from 'antd';
import style from './index.scss';
import TaskForm from '../TaskFormSecond';
import Delay from '../Delay';
import FileDownLoad from '../../FileDownLoad'

import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { UserOutlined, BookOutlined, DownloadOutlined, CloseCircleOutlined, CheckCircleOutlined ,ExclamationCircleOutlined} from '@ant-design/icons';

import { route } from 'preact-router';


const tabListNoTitle = [
  {
    key: 'publish',
    tab: <span><BookOutlined /><span className="tab-title">发布材料</span></span>,
  },
  {
    key: 'download',
    tab: <span><DownloadOutlined /><span className="tab-title">学生文件管理</span></span>
  }
];

const fileListOne = [
  { name: '开题报告', type: 'f_open' },
  { name: '外文翻译', type: 'f_tran' },
  { name: '文献综述', type: 'f_docs' },
  { name: '中期检查表', type: 'f_midcheck' },
]

const fileListTwo = [
  { name: '论文定稿', type: 'f_paper' },
  { name: '设计作品', type: 'f_design_opus' },
  { name: '作品说明书', type: 'f_manual' },
  { name: '查重报告', type: 'f_check' },
  { name: '承诺书', type: 'f_prom' }
]

const fileListThree = [
  { name: '答辩材料', type: 'f_reply_source' },
  { name: '答辩记录', type: 'f_reply_log' },
  { name: '答辩成绩表', type: 'f_reply_score' },
]

const uploadFiles = [
  { name: '任务书', type: 'f_task' }
]

let x = { nx: "style", sb: "fff" }

@inject('userStore', 'teacherStore')
@observer
export default class StuMethods extends BaseActions {
  constructor(props) {
    super(props)
  }

  @computed
  get usr() {
    return this.props.userStore.usr;
  }


  state = {
    pid: -1,
    name: null,
    cls: null,
    areaList: [],
    topic_data: null,
    topic_area: [],
    tab: 'publish',
    links: [],
    modal_visiable: false,
    auditOp: false,
    changeWWW:false,
    stude:null,
    stude_modal:false
  }

  getStuInfo = async () => {

    //获取学生信息
    let data = await this.post(urls.API_SYS_GET_FUUL_TOPIC_BY_ID, { pid: this.props.pid });
    data = data.data[0];
    this.setState({ topic_data: data })

    data = await this.post(urls.API_TEACHER_GET_STU_INFO, { sid: this.props.sid })
    data = data.data[0];
    this.setState({
      name: data.name,
      cls: data.maj + data.cls
    })

    //获取学生文件列表
    let file_data = await this.post(urls.API_TEACHER_GET_FILE_BY_TOPIC, { pid: this.props.pid })
    let l = (file_data.data)[0];
    console.log(file_data);
    let flag = (!!l.f_open) && (!!l.f_docs) && (!!l.f_tran) ;
    if (flag) {
      this.setState({ auditOp: true })
    }
    this.setState({ links: l })
    console.log(file_data.data[1]);
    if(!file_data.data[1]){
      this.setState({changeWWW:true})
    }else{
      this.setState({changeWWW:false})
    }
    if(!!file_data.data[2]){
      this.setState({stude:file_data.data[2]})
    }else{
      this.setState({stude:null})
    }
  }

  render() {
    {
      if (this.props.pid != this.state.pid) {
        this.setState({ pid: this.props.pid }, () => {
          this.getStuInfo();
        });
      }
    }
    return (
      <div className="stumethods" data-component="stumethodstwo">
        <div className="stu-info">
          <span className="note-title"><span className="mr-long"><UserOutlined /></span>学生信息</span>

          <span className="note-info-span">{this.props.sid}</span>
          <span className="note-info-span">{this.state.name}</span>
          <span className="note-info-span">{this.state.cls}</span>

        </div>
        <div className="stumethods-pd">
          <div className="m-diviver">学生</div>
          <header className="stm-header">
            <div className="note-block">
              <div className="card-inner">
                <div className="one-of-three">
                  <div className="f-title">
                    1、开题中期
                      </div>
                  <div className="file-block">
                    {
                      fileListOne.map((t) => {
                        let r = this.state.links[t.type];
                        return <FileDownLoad name={t.name} url={r} sid={this.props.sid} />
                      })
                    }

                  </div>

                </div>
                <div className="one-of-three">
                  <div className="f-title">
                    2、论文审核
                      </div>
                  <div className="file-block">
                    {
                      fileListTwo.map((t) => {
                        let r = this.state.links[t.type];
                        return <FileDownLoad name={t.name} url={r} sid={this.props.sid} />
                      })
                    }
                  </div>
                </div>
                <div className="one-of-three">
                  <div className="f-title">
                    3、论文答辩
                      </div>
                  <div className="file-block">
                    {
                      fileListThree.map((t) => {
                        let r = this.state.links[t.type];
                        return <FileDownLoad name={t.name} url={r} sid={this.props.sid} />
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="m-diviver">教师</div>
          <header className="stm-header">
            <div className="note-block">
              <div className="one-of-three">
                <div className="card-inner">
                  <div className="file-block">
                    {
                      !this.state.links['f_task'] &&

                      <>
                        <div className="m-file-down-load" onClick={() => { this.setState({ modal_visiable: true }) }}>
                          <div className="m-f-down-inner">
                            <div className="m-f-down-pic">
                              <CloseCircleOutlined />
                            </div>
                            <p>
                              填写任务书
                                </p>
                          </div>
                        </div>
                      </>
                    }
                    {
                      !!this.state.links['f_task'] &&
                      <>
                        <div className="m-file-down-load" onClick={() => { this.setState({ modal_visiable: true }) }}>
                          <div className="m-f-down-inner m-f-down-inner-active">
                            <div className="m-f-down-pic">
                              <CheckCircleOutlined />
                            </div>
                            <p>
                              修改任务书
                            </p>
                          </div>
                        </div>
                      </>
                    }
                    {
                      this.state.auditOp &&
                      <div className="m-file-down-load" onClick={() => { this.props.teacherStore.getTopicById({ "userId": this.usr.uid, "id": this.props.pid }).then(() => { route('/t_formOP') }) }}>
                        <Tooltip placement="top" title={"您的学生已交齐第一阶段文件"}>
                          <div className="m-f-down-inner">
                            <div className="m-f-down-pic">
                              <CheckCircleOutlined />
                            </div>
                            <p>
                              {
                                this.state.changeWWW&&
                                <>填写审核</>
                              }
                              {
                                !this.state.changeWWW&&
                                <>修改审核</>
                              }
                              
                            </p>
                          </div>
                        </Tooltip>
                      </div>
                    }
                    {
                      
                      this.state.stude &&
                      <div className="m-file-down-load"
                        onClick={()=>{this.setState({stude_modal:true})}}
                      >
                        <Tooltip placement="top" title={"您的学生申请了延迟答辩"}>
                          <div className="m-f-down-inner">
                            <div className="m-f-down-pic">
                            <ExclamationCircleOutlined />
                            </div>
                            <p>
                              延迟答辩
                            </p>
                          </div>
                        </Tooltip>
                      </div>
                    }
                  </div>
                </div>

              </div>
            </div>
          </header>

        </div>

        <Modal
          title="发布任务书"
          visible={this.state.modal_visiable}
          width={900}
          className="task-form-modal"
          footer={null}
          onCancel={() => { this.setState({ modal_visiable: false }) }}
        >
          <TaskForm ref={x => this.task = x} pid={this.props.pid} close={() => { this.setState({ modal_visiable: false }) }} freshList={this.props.freshList} />
        </Modal>

        <Modal
          title="审核学生申请"
          visible={this.state.stude_modal}
          width={900}
          footer={null}
          onCancel={()=>{this.setState({stude_modal:false})}}
        >
          <Delay 
            stu={{name:this.state.name,sid:this.props.sid,id:this.props.pid}} 
            freshList={()=>{this.setState({stude_modal:false},()=>this.setState({stude:null}))}}
            deInfo={this.state.stude}
          />

        </Modal>
      </div>
    )
  }

}