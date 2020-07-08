import BaseActions from '../../BaseActions';
import * as urls from '../../../constant/urls'
import { Card, Input, Tag, Button } from 'antd';
import style from './index.scss';
import FileUpload from '../../FileUpload'
import FileDownLoad from '../../FileDownLoad'

import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { UserOutlined, BookOutlined, DownloadOutlined, TagsOutlined } from '@ant-design/icons';

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

@inject('teacherStore')
@observer
export default class StuMethods extends BaseActions {
  constructor(props) {
    super(props)
  }


  state = {
    sid: this.props.sid,
    name: null,
    cls: null,
    areaList: [],
    topic_data: null,
    topic_area: [],
    tab: 'publish',
    links: []
  }

  async componentDidMount() {
    //获取学生信息
    let data = await this.post(urls.API_SYS_GET_FUUL_TOPIC_BY_ID, { pid: this.props.pid });
    data = data.data[0];
    this.setState({ topic_data: data })

    this.setState({ sid: this.props.sid }, () => {
      this.getStuInfo();
    });

    //获取学生文件列表
    let l = await this.post(urls.API_TEACHER_GET_FILE_BY_TOPIC, { pid: this.props.pid })
    console.log(l);
    l = (l.data)[0];
    this.setState({ links: l })
  }

  getStuInfo = async () => {
    let data = await this.post(urls.API_TEACHER_GET_STU_INFO, { sid: this.state.sid })
    data = data.data[0];
    this.setState({
      name: data.name,
      cls: data.maj + data.cls
    })
  }

  onTied = async () => {
    let r = confirm("您确定要解绑该学生么？")
    if (r) {
      await this.post(urls.API_TEACHER_UNTIED, { pid: this.props.pid });
      this.props.freshList();
    }
  }


  render() {
    {
      if (this.props.sid != this.state.sid) {
        this.setState({ sid: this.props.sid }, () => {
          this.getStuInfo();
        });
      }
    }
    return (
      <div data-component="stumethods">
        <div className="note-block">
          <span className="note-title"><span  className="mr-long"><UserOutlined /></span>学生信息</span>
          <Card style={{ width: 600 }}>
            <span className="note-info-span">{this.props.sid}</span>
            <span className="note-info-span">{this.state.name}</span>
            <span className="note-info-span">{this.state.cls}</span>
          </Card>
          <Button onClick={this.onTied} className="ml-long">解绑</Button>
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
                <Card style={{ width: 810 }}>
                  <div className="card-inner">
                    <div className="file-block">
                      <FileUpload type={{ name: '任务书', type: 'f_task' }} tpInfo={{ tid: this.props.tid, sid: this.props.sid }} />
                    </div>
                  </div>
                </Card>
              </div>
            </header>
          }
          {
            this.state.tab == 'download' &&
            <header className="stm-header">
              <div className="note-block">
              </div>
              <div className="note-block">
                <Card style={{ width: 810 }}>
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
                </Card>
              </div>
            </header>

          }
        </Card>
      </div>
    )
  }

}