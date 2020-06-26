import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { route } from 'preact-router';
import { PushpinOutlined } from '@ant-design/icons';
import './index.scss'

@inject('userStore')
@observer
class NavS extends Component {
	state = {
    usrInfo: {
      name: '教师',
      uid: '2018212213466',
      collage: '杭州国际服务工程学院',
      class: '计算机183',
      isSelected: true,
      teaName: '张三'
    }
  }
  
  @computed
  get usr() {
    return this.props.userStore.usr;
  }

  componentDidMount() {
    if(!this.state.usrInfo.isSelected) {
      route('/s_selectTL');
    }
    // }else {
    //   route('/s_topicPG');
    // }
    // let r = await this.props.userStore.getProjList()
    // this.setState({ usrInfo: r });
  }

  render() {
    const { usrInfo } = this.state;
    return (
      <div className="g-nav">
        <div className="g-menu">
          <div className="m-info">
            {usrInfo.name && <p>姓名：{usrInfo.name}</p>}
            {usrInfo.uid && <p>学号：{usrInfo.uid}</p>}
            {usrInfo.class && <p>班级：{usrInfo.class}</p>}
            {usrInfo.collage && <p>学院：{usrInfo.collage}</p>}
            {usrInfo.isSelected && <p>指导老师：{usrInfo.teaName}</p>}
          </div>
          {!usrInfo.isSelected && 
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
