import BaseActions from '../../BaseActions';
import * as urls from '../../../constant/urls'
import { Card,Input,Tag  } from 'antd';
import style from './index.scss';
import FileUpload from '../../FileUpload'
import FileDownLoad from '../../FileDownLoad'

import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { UserOutlined,BookOutlined ,DownloadOutlined,TagsOutlined } from '@ant-design/icons';

const tabListNoTitle = [
  {
    key: 'publish',
    tab: <span><BookOutlined /><span style="margin-left:9px">发布材料</span></span>,
  },
  {
    key: 'download',
    tab:<span><DownloadOutlined /><span style="margin-left:9px">学生文件下载</span></span>
  }
];

@inject('teacherStore')
@observer
export default class StuMethods extends BaseActions {
  constructor(props) {
    super(props)
  }
  

  state = {
    sid:this.props.sid,
    name: null,
    cls:null,
    areaList:[],
    topic_data:null,
    topic_area:[],
    tab:'publish'
  }

  async componentDidMount() {
    //获取学生信息
    let data = await this.post(urls.API_SYS_GET_FUUL_TOPIC_BY_ID,{pid:this.props.pid});
    data = data.data[0];
    this.setState({topic_data:data})
    
    this.setState({sid:this.props.sid},()=>{
      this.getStuInfo();
    });

    //获取学生文件列表
    let links = await this.post(urls.API_TEACHER_GET_FILE_BY_TOPIC,{pid:this.props.pid})
    console.log(links);
    
  }

  getStuInfo = async ()=>{
    let data = await this.post(urls.API_TEACHER_GET_STU_INFO,{sid:this.state.sid})
    data = data.data[0];
    this.setState({
      name:data.name,
      cls:data.maj + data.cls
    })
  }


  render() {
    {if(this.props.sid!=this.state.sid){
      this.setState({sid:this.props.sid},()=>{
        this.getStuInfo();
      });
    }}
    return (
      <div data-component="stumethods">
        <div className="note-block">
          <span style="width:110px"><span style="margin-right:20px" className=""><UserOutlined /></span>学生信息</span>
          <Card style={{ width: 700}}>
            <span style="margin:10px">{this.props.sid}</span>
            <span style="margin:10px">{this.state.name}</span>
            <span style="margin:10px">{this.state.cls}</span>
          </Card>
        </div>
      
      <Card 
      tabList={tabListNoTitle} 
      size="small" 
      bordered={false}
      onTabChange={(e)=>{this.setState({tab:e})}}
      >
        {this.state.tab=='publish'&&
        <header className="stm-header">
          <div className="note-block"> 
          </div>
          <div className="note-block">
            {/* <span style="width:110px"><span style="margin-right:10px" className=""><BookOutlined /></span>任务发布</span> */}
            <Card style={{ width: 810}}>
            <div className="card-inner">
                <div className="file-block">
                  <FileUpload type={{name:'任务书',type:'f_task'}} tpInfo={{tid:this.props.tid,sid:this.props.sid}}/>  
                </div>
              </div>
            </Card>
          </div>
        </header>
        }
        {
          this.state.tab=='download'&&
          <header className="stm-header">
          <div className="note-block"> 
          </div>
          <div className="note-block">
            <Card style={{ width: 810}}>
            <div className="card-inner">
              <div className="one-of-three">
                <div className="f-title">
                  1、开题中期
                </div>
                <div className="file-block">
                  <FileDownLoad name="开题报告" url="http://www.baidu.com"/> 
                  <FileDownLoad name="外文翻译" /> 
                  <FileDownLoad name="文献综述" /> 
                  <FileDownLoad name="中期检查表" />
                </div>
              </div>
              <div className="one-of-three">
                <div className="f-title">
                  2、论文审核
                </div>
                <div className="file-block">
                  <FileDownLoad name="论文定稿"/> 
                  <FileDownLoad name="设计作品"/> 
                  <FileDownLoad name="作品说明书"/> 
                  <FileDownLoad name="查重报告"/> 
                  <FileDownLoad name="承诺书"/> 
                </div>
              </div>
              <div className="one-of-three">
                <div className="f-title">
                  3、论文答辩
                </div>
                <div className="file-block">
                  <FileDownLoad name="答辩材料"/> 
                  <FileDownLoad name="答辩记录"/> 
                  <FileDownLoad name="答辩成绩表"/> 
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