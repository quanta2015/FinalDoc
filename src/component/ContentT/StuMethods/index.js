import BaseActions from '../../BaseActions';
import * as urls from '../../../constant/urls'
import { Card,Input,Tag  } from 'antd';
import style from './index.css';
import FileUpload from '../../FileUpload'

const {TextArea} = Input;
import { UserOutlined,BookOutlined ,AlignLeftOutlined,TagsOutlined } from '@ant-design/icons';

let me={
  uid:20100119
}

const tabListNoTitle = [
  {
    key: 'stu',
    tab: <span><span style="margin-right:5px"><UserOutlined /></span>学生信息</span>,
  }
];


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
    topic_area:[]
  }

  async componentDidMount() {
    let data = await this.post(urls.API_SYS_GET_FUUL_TOPIC_BY_ID,{pid:this.props.tid});
    data = data.data[0];
    this.setState({topic_data:data})
    
    this.setState({sid:this.props.sid},()=>{
      this.getStuInfo();
    });

    let areaData = await this.post(urls.API_SYS_GET_TEACHER_AREA_LIST,{tid:me.uid});
    areaData = areaData.data;
    this.setState({areaList:areaData})

    let ta = data.area;
    ta = ta.map((x)=>{
      return areaData[areaData.map((x)=>x.id).indexOf(x)]
    })
    this.setState({topic_area:ta})
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
      <Card 
      tabList={tabListNoTitle} 
      size="small" 
      bordered={false}
      >
        <header className="stm-header">
          <div className="note-block">
            <span style="width:110px"><span style="margin-right:10px" className=""><UserOutlined /></span>基本信息</span>
            <Card style={{ width: 700}}>
              <span style="margin:10px">{this.props.sid}</span>
              <span style="margin:10px">{this.state.name}</span>
              <span style="margin:10px">{this.state.cls}</span>
            </Card>
          </div>
          <div className="note-block">
            <span style="width:110px"><span style="margin-right:10px" className=""><BookOutlined /></span>任务发布</span>
            <Card style={{ width: 700}}>
            <div className="card-inner">
                <div className="file-block">
                  <FileUpload type={{name:'任务书',type:'f_docs'}}/>  
                </div>
              </div>
            </Card>
          </div>
        </header>
      </Card>
    )
  }

}