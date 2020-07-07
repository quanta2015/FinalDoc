import { Collapse,Button, Table, message ,Tag} from 'antd';
import { inject, observer } from 'mobx-react';
import { computed} from 'mobx';
import style from './index.css'
import BaseActions from '../../BaseActions';
const { Panel } = Collapse;
import * as urls from '../../../constant/urls'
import StuMethods from '../StuMethods'
import DeleteSpan from '../../../component/ContentT/Icons/Delete'
import ReWrite from '../../../component/ContentT/Icons/ReWrite'
import Watch from '../../../component/ContentT/Icons/Watch'
import ReviewLine from '../Review';


const PanelHeader = (name,status,id)=>(
<span>
    {status!=3&&<span style="display: inline-block;margin-left:40px;width:30px">{id}</span>}
    {status==3&&<span style="display: inline-block;margin-left:10px;width:30px">{id}</span>}
    {status!=3&&
    <span style="margin-left:10px;cursor:default">
      {name}
    </span>
    }
    {
      status==3&&
      <span style="margin-left:10px;cursor:pointer">
        {name}
      </span>
    }
  </span>
)

@inject('userStore')
@observer
class Check extends BaseActions {

  constructor(props){
    super(props);
  }

  @computed
  get usr() {
      return this.props.userStore.usr;
  }

  /**
   * 撤销课题
   * @param {string} id 课题id
   * @param {string} name 课题name
   */
  deleteTopic = async (id,name)=>{
    let r = confirm(`您确定要撤销您的课题 ${id} : ${name} 么？`);
    if(!r){
      return;
    }
    r = await this.post(urls.API_USR_DELETE_TOPIC_BY_ID,{id:id});
    if(r){
      message.info("删除成功")
    }else{
      message.error("删除失败")
    }
    this.props.close();
  }

  getSugg = async (id)=>{
    let data = await this.post(urls.API_TEACHER_GET_SUGG,{pid:id})
    message.info("意见信息："+data.data[0].sugg)
  }

  StateExtra = (t) => (
    <div className="state-extra">
      {t.status==3 && <Tag color="green">已通过</Tag>}
      {t.status==1 && <Tag color="orange">待审核</Tag>}
      {t.status==4 && <Tag color="red">未通过</Tag>}
      {t.status==0 && <Tag color="orange">待分配</Tag>}
      <div className="icons">
        {
          (t.status==0||t.status==1||t.status==4)&&<span onClick={()=>{this.deleteTopic(t.id,t.name)}}><DeleteSpan /></span>
        }
        {
          (t.status==4||t.status==0)&&<span onClick={()=>{this.props.change(t.id)}}><ReWrite/></span>
        }
        {
          (t.status==4)&&<span onClick={()=>{this.getSugg(t.id)}}><Watch/></span>
        }
      </div>
      
    </div>
  );

  render() {
    return (
      <div className="check-block">
        <div className="title">
          <span>我的课题</span>
          <span>
            {
              this.props.pbChanged&&
              <Button type="dashed"  onClick={()=>{this.props.justOpenDrawer()}}>继续编辑</Button>
            }
            {this.props.toplist.length<8&&
              <Button type="dashed" onClick={()=>{this.props.change(null)}}>发布新课题</Button>
            }
            <Button type="default" onClick={()=>{this.props.showAllTopic()}}>查看全部课题</Button>
          </span>
        </div>
        {this.props.toplist.length==0&&<span>您还没有课题！</span>}
        <Collapse 
          defaultActiveKey={[]} 
          expandIconPosition={'left'}
        >
          
          {
            this.props.toplist.map(
              (t)=>
                <Panel header={PanelHeader(t.name,t.status,t.id)} key={t.id} extra={this.StateExtra(t)} showArrow={t.status==3?true:false} disabled={t.status==3?false:true}>
                  <div className="stu">
                    {t.status==3 &&
                      <>
                        {t.sid!=null&&
                          <StuMethods  sid={t.sid} tid={this.usr.uid} pid={t.id} freshList={this.props.freshList}/>
                        }
                        {t.sid==null&&this.props.checkList.map((x)=>{return x.id}).indexOf(t.id)<0&&
                          <span>您的课题{t.name}还没有学生选择</span>
                        }
                        {
                          t.sid==null&&this.props.checkList.map((x)=>{return x.id}).indexOf(t.id)>=0&&
                          <ReviewLine list={this.props.checkList[this.props.checkList.map((x)=>x.id).indexOf(t.id)]} freshList={this.props.freshList}/>
                        }
                      </>
                    }
                  </div>
                </Panel>
              
            )
          }
        </Collapse>
        
      </div>
    );
  }
}

export default Check;