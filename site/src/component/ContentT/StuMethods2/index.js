import BaseActions from '../../BaseActions';
import * as urls from '../../../constant/urls'
import { Card, Input, Tag, Button, Modal } from 'antd';
import style from './index.scss';
import FileUpload from '../../FileUpload'
import FileDownLoad from '../../FileDownLoad'

import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { UserOutlined, BookOutlined, DownloadOutlined, TagsOutlined } from '@ant-design/icons';
import TaskForm from '../TaskForm';

const tabListNoTitle = [
  {
    key: 'publish',
    tab: <span><BookOutlined /><span className="tab-title">发布材料</span></span>,
  },
  {
    key: 'download',
    tab: <span><DownloadOutlined /><span className="tab-title">学生文件下载</span></span>
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

@inject('teacherStore')
@observer
export default class StuMethods extends BaseActions {
  constructor(props) {
    super(props)
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
    modal_visiable: false
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
      <div data-component="stumethods">
        <div className="stumethods">
          <div className="note-block">
            <span className="note-title"><span className="mr-long"><UserOutlined /></span>学生信息</span>

            <span className="note-info-span">{this.props.sid}</span>
            <span className="note-info-span">{this.state.name}</span>
            <span className="note-info-span">{this.state.cls}</span>

          </div>

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
                        !this.state.links['f_task'] && <Button type="dashed" style={{ height: 100 }} onClick={() => { this.setState({ modal_visiable: true }) }}>发布任务书</Button>
                      }
                      {
                        !!this.state.links['f_task'] && <Button type="dashed" onClick={() => { this.setState({ modal_visiable: true }) }}>重新发布任务书</Button>
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
                            return <FileDownLoad name={t.name} url={r} sid={this.state.sid} />
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
                            return <FileDownLoad name={t.name} url={r} sid={this.state.sid} />
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
                            return <FileDownLoad name={t.name} url={r} sid={this.state.sid} />
                          })
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </header>

            }
          </Card>
          <Modal
            title="发布任务书"
            visible={this.state.modal_visiable}
            width={900}
            footer={null}
            onCancel={() => { this.setState({ modal_visiable: false }) }}
          >
            <TaskForm ref={x => this.task = x} pid={this.props.pid} close={() => { this.setState({ modal_visiable: false }) }} />
          </Modal>
        </div>

      </div>
    )
  }

}