import BaseActions from '../BaseActions';
import * as urls from '../../constant/urls'
import { Card,Input,Tag, Tooltip  } from 'antd';
import style from './index.css';
import { inject, observer } from 'mobx-react';
import { UserOutlined,CheckCircleOutlined,CloseCircleOutlined} from '@ant-design/icons';

const tiptitle = (url)=>{
  if(!url){
    return(
      <span>
        您的学生还未上传
      </span>
    )
  }else{
    return(
      <span>
        下载文件
      </span>
    )
  }
}


//props:{name:"",url:"",sid:""}
@inject('userStore')
export default class FileDownLoad extends BaseActions{

  // name：文件名，topic：课题id
  constructor(props){
    super(props)
  }

  state={
    url:null
  }

  download=()=>{
    let params = {file:this.props.url,id:this.props.sid,name:this.props.name}
    console.log(params);
    
    this.props.userStore.downloadFile(params)
  }

  render(){
    return(
      <div className="file-down-load" data-component="filedownload">
        <Tooltip placement="top" title={()=>{return tiptitle(this.props.url)}}>
          <div className="f-down-inner">
            {
              (!!this.props.url)&&
              <a onClick={this.download}>
                <div className="f-down-pic">
                  <CheckCircleOutlined />
                </div>
                <p>
                  {this.props.name}
                </p>
              </a>
            }
            {
              (!this.props.url)&&
              <>
                <div className="f-down-pic">
                  <CloseCircleOutlined />
                </div>
                <p>
                  {this.props.name}
                </p>
              </>
            }
          </div>
        </Tooltip>
      </div>
    )
  }




}