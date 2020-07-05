import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';
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

  componentDidMount() {
    this.props.studentStore.getSelectTopic({ uid: this.usr.uid })
    .then(r => {
      if (!r) { //未双选
        route('/s_selectTL');
      } else { //已双选
        route('/s_topicPG');
      }
    })
  }

  render() {
    const link = 'https://youth.hznu.edu.cn/upload/resources/file/2020/06/24/7589612.doc'
    return (
      <div className="g-nav">
        <div className="g-menu">
          <div className="m-info">
            <h2 className="m-title bold">基本信息</h2>
            {this.usr.name && <p>姓名：{this.usr.name}</p>}
            {this.usr.uid && <p>学号：{this.usr.uid}</p>}
            {this.usr.cls && <p>班级：{this.usr.cls}</p>}
          </div>
          {!this.selectTpInfo.topic ?
            <div className='m-menuItem active'>
              <PushpinOutlined />
              <span>选择课题</span>
            </div>:
            <div className="m-info divider">
              <h2 className="m-title bold">文件模板</h2>
              <p><a href={link} download>开题报告</a></p>
              <p><a href={link} download>中期检查表</a></p>
              <p><a href={link} download>外文文献翻译</a></p>
              <p><a href={link} download>文献综述</a></p>
              <p><a href={link} download>论文格式</a></p>
              <p><a href={link} download>作品说明书</a></p>
              <p><a href={link} download>诚信承诺书</a></p>
              <p><a href={link} download>评审答辩成绩表</a></p>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default NavS
