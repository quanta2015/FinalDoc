import { Collapse,Button, Table } from 'antd';
import { UserOutlined  } from '@ant-design/icons';
import style from './index.css'
import BaseActions from '../../BaseActions';
const { Panel } = Collapse;
import * as urls from '../../../constant/urls'
import DeleteSpan from '../../../component/ContentT/Icons/Delete'
import ReWrite from '../../../component/ContentT/Icons/ReWrite'
import Watch from '../../../component/ContentT/Icons/Watch'

let me = {
  tea_id : '20127018'
}

const StateExtra = (s) => (
  <div className="state-extra">
    {s==3 &&<span style="color:green">已通过</span>}
    {s==1 && <span style="color:orange">待审核</span>}
    {s==2 && <span style="color:red">未通过</span>}
    {s==0 && <span style="color:orange">待分配</span>}
    <div className="icons">
      {
        (s==0||s==1||s==2)&&<span><DeleteSpan/></span>
      }
      {
        (s==2||s==0)&&<span><ReWrite/></span>
      }
      {
        (s==2)&&<span><Watch/></span>
      }
      
      
    </div>
    
  </div>
);
class Check extends BaseActions {

  constructor(props){
    super(props);
  }
 
  state = {
    toplist:[
      {key:3,id:"3",name:"WEB程序设计",status:2,stu:null},
      {key:4,id:"4",name:"JSP程序设计",status:3,
        stu:{
          name:"李兆荣",
          uid:2017212212294
        }
      },
      {key:4,id:"5",name:"C++程序设计",status:3,stu:null},
      {key:1,id:"1",name:"JAVA程序设计",status:0,stu:null},
      {key:2,id:"2",name:".NET程序设计",status:1,stu:null},
      
    ]
  };

  async componentDidMount(){
    let data = await this.get(urls.API_SYS_GET_TOPIC_BY_TEACHER_ID,{tea_id:me.tea_id})
    console.log(data)
  }

  render() {
    return (
      <div className="check-block">
        <div className="title">我的课题</div>
        <Collapse 
          defaultActiveKey={[]}
          expandIconPosition={'left'}
        >
          {
            this.state.toplist.map(
              (t)=>
                <Panel header={t.name} key={t.id} extra={StateExtra(t.status)}>
                  <div className="stu">
                    {t.status==0 && <span>您的课题{t.name}正在等待教务处分配</span>}
                    {t.status==1 && <span>您的课题{t.name}正在等待教师审核</span>}
                    {t.status==2 && 
                      <div className="fail-block">
                        <span>您的课题{t.name}审核未通过</span>
                        <div>
                          <Button onClick={()=>{console.log("查看意见")}}>查看意见</Button>
                          <Button type="primary" onClick={()=>{this.props.change(null)}}>去修改</Button>
                        </div>
                        
                      </div>
                    }
                    {t.status==3 &&
                      <>
                        {t.stu!=null&&
                          <div className="stu-block">
                          <span style="margin-right:10px"><UserOutlined /></span>
                          课题学生：{t.stu.name}
                        </div>
                        }
                        {t.stu==null&&
                          <span>您的课题{t.name}还没有学生选择</span>
                        }
                      </>
                    
                    }
                  </div>
                </Panel>
              
            )
          }
        </Collapse>
        {this.state.  toplist.length<8&&
          <Button type="primary" style="margin:20px 0" >发布新课题</Button>
        }
      </div>
    );
  }
}

export default Check;