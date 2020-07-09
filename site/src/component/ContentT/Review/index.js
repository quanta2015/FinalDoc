import './index.scss'
import BaseActions from '../../BaseActions';
import * as urls from '../../../constant/urls'
import { Table, Tag, Space ,Tooltip} from 'antd';
import { StarOutlined, CloseOutlined, CheckOutlined,UserOutlined } from '@ant-design/icons';


export default class Review extends BaseActions{

  columns = [
    {
      title:"课题名",
      dataIndex:'topic',
      key:'topic'
    },
    {
      title:"学号",
      dataIndex:'sid',
      key:'sid'
    },
    {
      title:"姓名",
      dataIndex:'name',
      key:'name'
    },
    {
      title:"操作",
      dataIndex:'do',
      key:'do',
      render:(text,record)=>{
        return(
          <div className="review-tool">
          <Tooltip placement="top" title={"通过"}>
            <CheckOutlined onClick={()=>{this.pass(record.sid,record.name,record.id)}} className="blue-font"/>
          </Tooltip>
          <Tooltip placement="top" title={"拒绝"}  >
            <span onClick={()=>{this.refuse(record.sid,record.name,record.id)}}>
              <CloseOutlined className="red-font"/>
            </span>
            
          </Tooltip>
          </div>
        )
      }
    },
  ]
  constructor(props){
    super(props)
  }

  /**
   * 通过学生申请
   * @param {string} id 学生id
   * @param {string} name 学生name
   * @param {string} tid 课题id
   */
  pass =async (id,name,tid)=>{
    let r = confirm(`您确定要通过 ${name} 的申请么？`)
    if(!r)return;
    let data = {sid:id,topic_id:tid,val:1}
    r = await this.post(urls.API_SYS_TEACHER_REVIEW_STUDENT,data);
    console.log(r);
    this.props.freshList();
  }

  /**
   * 拒绝学生申请
   * @param {string} id 学生id
   * @param {string} name 学生name
   * @param {string} tid 课题id
   */
  refuse =async (id,name,tid)=>{
    let r = confirm(`您确定要拒绝 ${name} 的申请么？`)
    if(!r)return;
    r = await this.post(urls.API_SYS_TEACHER_REVIEW_STUDENT,{sid:id,topic_id:tid,val:0});
    this.props.freshList();
  }


  render(){
    return (
      <div  data-component="review">
      <div className="review-line">
        <span>
          <span className="mr-long"><UserOutlined /></span>
          <span className="m-short">申请学生：</span>
          <span className="m-short">学号： {this.props.list.sid}</span>
          <span className="m-short">姓名： {this.props.list.name}</span>
        </span>
        
        <div className="icons">
          <Tooltip placement="top" title={"通过"}>
            <span className="m-icon">
              <CheckOutlined onClick={()=>{this.pass(this.props.list.sid,this.props.list.name,this.props.list.id)}}  className="blue-font"/>
            </span>
          </Tooltip>
          <Tooltip placement="top" title={"拒绝"}>
            <span  className="m-icon">
            <CloseOutlined onClick={()=>{this.refuse(this.props.list.sid,this.props.list.name,this.props.list.id)}} className="red-font"/>
            </span>
          </Tooltip>
        </div>
      </div>
      </div>
    )
  }

}