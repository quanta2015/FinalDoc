import './index.css'
import BaseActions from '../../BaseActions';
import * as urls from '../../../constant/urls'
import { Table, Tag, Space ,Tooltip} from 'antd';
import { StarOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';


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
          <div style="margin:0 auto;width:60px;display:flex;justify-content: space-around;">
          <Tooltip placement="top" title={"通过"}>
            <CheckOutlined onClick={()=>{this.pass(record.sid,record.name,record.id)}} style="color:blue"/>
          </Tooltip>
          <Tooltip placement="top" title={"拒绝"}>
            <CloseOutlined onClick={()=>{this.refuse(record.sid,record.name,record.id)}} style="color:red"/>
          </Tooltip>
          </div>
        )
      }
    },
  ]
  constructor(props){
    super(props)
  }

  pass =async (id,name,tid)=>{
    let r = confirm(`您确定要通过 ${name} 的申请么？`)
    if(!r)return;
    r = await this.post(urls.API_SYS_TEACHER_REVIEW_STUDENT,{dis:id,topic_id:tid,val:1});
    console.log(r);
  }

  refuse =async (id,name,tid)=>{
    let r = confirm(`您确定要拒绝 ${name} 的申请么？`)
    if(!r)return;
    r = await this.post(urls.API_SYS_TEACHER_REVIEW_STUDENT,{dis:id,topic_id:tid,val:0});
    console.log(r);
  }


  render(){
    return (
      <Table columns={this.columns} dataSource={this.props.list}>
      </Table>
    )
  }

}