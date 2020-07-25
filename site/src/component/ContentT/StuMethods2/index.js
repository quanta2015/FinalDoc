import BaseActions from '../../BaseActions';
import * as urls from '../../../constant/urls'
import { Card, Input, Tag, Button, Modal,Tooltip } from 'antd';
import style from './index.scss';
import TaskForm from '../TaskFormSecond';
import FileDownLoad from '../../FileDownLoad'

import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { UserOutlined, BookOutlined, DownloadOutlined, CloseCircleOutlined ,CheckCircleOutlined} from '@ant-design/icons';

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

@inject('userStore','teacherStore')
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
    auditOp: false
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
    let l = await this.post(urls.API_TEACHER_GET_FILE_BY_TOPIC, { pid: this.props.pid })
    l = (l.data)[0];
    console.log(l);
    let flag = (!!l.f_open) && (!!l.f_docs) && (!!l.f_tran);
    console.log(flag);
    if (flag) {
      this.setState({ auditOp: true })
    }
    this.setState({ links: l })
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
      <div className="stumethods" data-component="stumethods">
        <div className="stu-info">
          <span className="note-title"><span className="mr-long"><UserOutlined /></span>学生信息</span>

          <span className="note-info-span">{this.props.sid}</span>
          <span className="note-info-span">{this.state.name}</span>
          <span className="note-info-span">{this.state.cls}</span>

        </div>
        <div className="stumethods-pd">
          <Card
            tabList={tabListNoTitle}
            size="small"
            bordered={false}
            onTabChange={(e) => { this.setState({ tab: e }) }}
          >
            {this.state.tab == 'publish' &&
              <header className="stm-header">
                <div className="note-block">
                </div>
                <div className="note-block">
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
                              <div className="m-f-down-inner">
                                <div className="m-f-down-pic">
                                  <CheckCircleOutlined />
                                </div>
                                <p>
                                  重新填写任务书
                                </p>
                              </div>
                          </div>
                          </>
                      }
                    </div>
                  </div>

                </div>
              </header>
            }
            {
              this.state.tab == 'download' &&
              <header className="stm-header">
                <div className="note-block">
                </div>
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
                      {
                        //这个地方应该是没有感叹号的。。方便你测试
                          this.state.auditOp &&
                          <>
                          <div className="m-fdl-spaceline"></div>
                          <div className="m-file-down-load" onClick={()=>{this.props.teacherStore.getTopicById({ "userId": this.usr.uid, "id": this.props.pid }).then(()=>{route('/t_formOP')})}}>
                            <Tooltip placement="top" title={"您的学生已交齐第一阶段文件"}>
                              <div className="m-f-down-inner">
                                <div className="m-f-down-pic">
                                  <CheckCircleOutlined />
                                </div>
                                <p>
                                  填写审核
                                </p>
                              </div>
                            </Tooltip>
                          </div>
                          </>
                        }
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

            }
          </Card>
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
      </div>
    )
  }

}