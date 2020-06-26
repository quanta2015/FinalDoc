import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { route } from 'preact-router';
import { PushpinOutlined } from '@ant-design/icons';
import './index.scss'

@inject('studentStore')
@observer
class NavS extends Component {

  @computed
  get usr() {
    return this.props.studentStore.usr;
  }

  componentDidMount() {
    this.props.studentStore.getStuInfo()
      .then(r => {
        if (!this.usr.isSelected) {
          route('/s_selectTL');
        } else {
          route('/s_topicPG');
        }
      })
  }

  render() {
    return (
      <div className="g-nav">
        <div className="g-menu">
          <div className="m-info">
            {this.usr.name && <p>姓名：{this.usr.name}</p>}
            {this.usr.uid && <p>学号：{this.usr.uid}</p>}
            {this.usr.class && <p>班级：{this.usr.class}</p>}
            {this.usr.collage && <p>学院：{this.usr.collage}</p>}
            {this.usr.isSelected && <p>指导老师：{this.usr.teaName}</p>}
          </div>
          {!this.usr.isSelected &&
            <div className='m-menuItem active'>
              <PushpinOutlined />
              <span>选择课题</span>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default NavS
