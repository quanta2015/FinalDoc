import { Collapse, Select,Button } from 'antd';
import { Component } from 'preact';
import { UserOutlined  } from '@ant-design/icons';
import style from './index.css'
const { Panel } = Collapse;


const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const StateExtra = (s) => (
  <div>
    {s==3 && <div style="color:green">通过</div>}
    {s==1 && <div style="color:orange">待审核</div>}
    {s==2 && <div style="color:red">失败</div>}
    {s==0 && <div style="color:orange">待分配</div>}
  </div>
);
class Check extends Component {

  toplist=[
    {id:"1",name:"JAVA程序设计",status:0,stu:null},
    {id:"2",name:".NET程序设计",status:1,stu:null},
    {id:"3",name:"WEB程序设计",status:2,stu:null},
    {id:"4",name:"JSP程序设计",status:3,
      stu:{
        name:"李兆荣",
        uid:2017212212294
      }
    },
    {id:"5",name:"C++程序设计",status:3,
      stu:null
    },
  ]

  state = {
    
  };

  render() {
    return (
      <div className="check-block">
        <div className="title">我的课题</div>
        <Collapse
          defaultActiveKey={[]}
          expandIconPosition={'left'}
        >
          {
            this.toplist.map(
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
        {this.toplist.length<8&&
          <Button type="primary" style="margin:20px 0" onClick={()=>{this.props.change(null)}}>发布新课题</Button>
        }
      </div>
    );
  }
}

export default Check;