import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { PushpinOutlined } from '@ant-design/icons';
import './index.scss'

@inject('userStore', 'studentStore')
@observer
class NavS extends Component {

  @computed
  get selectTpInfo() {
    return toJS(this.props.studentStore.selectTpInfo);
  }

  @computed
  get usr() {
    return this.props.userStore.usr;
  }

  @computed
  get docTemplate() {
    return this.props.studentStore.docTemplate;
  }

  componentDidMount() {
    // this.props.studentStore.getSelectTopic({ uid: this.usr.uid })
    // .then(r => {
    //   if (!r) { //未双选
    //     route('/s_selectTL');
    //   } else { //已双选
    //     route('/s_topicPG');
    //   }
    // })
  }

  render() {
    return (
      <div className="g-stu-nav">
        <div className="g-menu">
          <div className="m-info">
            <h2 className="m-title bold">基本信息</h2>
            {this.usr.name && <p>姓名：{this.usr.name}</p>}
            {this.usr.uid && <p>学号：{this.usr.uid}</p>}
            {this.usr.cls && <p>班级：{this.usr.cls}</p>}
          </div>
          {!this.selectTpInfo.topic ?
            <div className='m-menu-item active'>
              <PushpinOutlined />
              <span>选择课题</span>
            </div>:
            <div className="m-info divider">
              <h2 className="m-title bold">文件模板</h2>
              {this.docTemplate && this.docTemplate.map((item) => 
                <p><a href={item.link} download>{item.title}</a></p>
              )}
            </div>
          }
        </div>
      </div>
    )
  }
}

export default NavS
