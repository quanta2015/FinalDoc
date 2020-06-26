import { Collapse, Select } from 'antd';
import { Component } from 'preact';
import { SettingOutlined } from '@ant-design/icons';
import style from './index.css'
const { Panel } = Collapse;
function callback(key) {
  console.log(key);
}

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
    {id:"1",name:"JAVA程序设计",status:0},
    {id:"2",name:".NET程序设计",status:0},
    {id:"3",name:"WEB程序设计",status:0},
    {id:"4",name:"JSP程序设计",status:0}
  ]

  state = {
    
  };

  render() {
    console.log(this.toplist)
    return (
      <div className="check-block">
        <div className="title">我的课题</div>
        <Collapse
          defaultActiveKey={['1']}
          onChange={callback}
          expandIconPosition={'left'}
        >
          {
            this.toplist.map(
              (t)=>
                <Panel header={t.name} key={t.id} extra={StateExtra(t.status)}>
                  <div className="stu">这里是测试代码</div>
                </Panel>
              
            )
          }
        </Collapse>
      </div>
    );
  }
}

export default Check;