import BaseActions from '../../BaseActions';
import * as urls from '../../../constant/urls'
import { Card,Input,Tag,Table,Tooltip  } from 'antd';
import style from './index.scss'

const {TextArea} = Input;
import { UserOutlined,BookOutlined ,AlignLeftOutlined,TagsOutlined } from '@ant-design/icons';




export default class AllTopicList extends BaseActions{
  constructor(p){
    super(p)
  }

  state={
    list:[]
  }

  columns = [
    {
      title: '课题ID',
      dataIndex: 'id',
      key: 'id',
      render:(val,c)=>{
        return(
          <div>
            {this.props.uid==c.tid&&
            <Tooltip placement="top" title={"我的课题"}>
              <span>{val}</span>
            </Tooltip>
            }
            {
              this.props.uid!=c.tid&&
              <span>{val}</span>
            }
          </div>
          
        )
      }
    },
    {
      title: '课题名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title:'研究领域',
      dataIndex:'area',
      key:'area',
      render:(r) => (
        r.sort(this.myTagsort).map((x)=>
          <Tag color={x.color}>
            {x.name}
          </Tag>
        )
      )
    }
  ]

  myTagsort(a,b){
    return a.name.localeCompare(b.name,'zh-CN')
  }

  mysort(arr){
    let uid = this.props.uid;
    let index = 0;
    for(let i in arr){
      if(arr[i].tid!=uid)continue;
      let temp = arr[i];
      arr[i] = arr[index];
      arr[index] = temp;
      index++;
    }
  }
  
  componentDidMount= async ()=>{
    let data = await this.get(urls.API_TEACHER_GET_ALL_TOPIC)
    data = data.data;
    this.mysort(data);
    this.setState({
      list:data
    })
    
  }

  render(){
    return(
      <div data-component="alltopic">
        <Table className="all-topic-list"
        pagination={ {pageSize:8} }
        columns={this.columns} 
        dataSource={this.state.list} >
          
        </Table>
      </div>
    )
  }
}