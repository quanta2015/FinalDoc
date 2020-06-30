import BaseActions from '../../BaseActions';
import * as urls from '../../../constant/urls'
import { Collapse, Button, Table, message } from 'antd';
import { UserOutlined  } from '@ant-design/icons';

export default class StuMethods extends BaseActions {
  constructor(props) {
    super(props)
  }

  state = {
    sid:this.props.sid,
    name: null,
    maj:null,
    cls:null
  }

  componentDidMount() {
    this.setState({sid:this.props.sid},()=>{
      this.getStuInfo();
    });
  }

  getStuInfo = async ()=>{
    let data = await this.post(urls.API_SYS_TEACHER_GET_STU_INFO,{sid:this.state.sid})
    data = data.data[0];
    this.setState({
      name:data.name,
      maj:data.maj,
      cls:data.cls
    })
  }


  render() {
    {if(this.props.sid!=this.state.sid){
      this.setState({sid:this.props.sid},()=>{
        this.getStuInfo();
      });
    }}
    return (
      <div className="stumethods-block">
        <header className="stm-header">
          <span style="margin-right:20px"><UserOutlined /></span>
          课题学生：
          <span style="margin:10px">{this.props.sid}</span>
          <span style="margin:10px">{this.state.name}</span>
          <span style="margin:10px">{this.state.maj+this.state.cls}</span>
        </header>
        
        {/*todo*/}
      </div>
    )
  }

}