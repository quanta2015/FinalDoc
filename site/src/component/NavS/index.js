import { Component } from 'preact';
import { route } from 'preact-router';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { CaretRightOutlined } from '@ant-design/icons';
import { MENU_MAIN_S } from '../../constant/data';
import message from '../../icon/icon_message.svg'
import './index.scss'

@inject('userStore', 'studentStore')
@observer
class NavS extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cur: -1,
    }
  }

  @computed
  get selectTpInfo() {
    return toJS(this.props.studentStore.selectTpInfo);
  }

  @computed
  get usr() {
    return this.props.userStore.usr;
  }

  @computed
  get currStage() {
    return this.props.studentStore.currStage;
  }

  componentDidMount() {
    this.props.studentStore.getSelectTopic({ uid: this.usr.uid });
  }

  doMenu = (path, i) => {
    this.setState({ cur: i }, () => {
      route(path)
    })
  }

  gohome = () => {
    this.setState({
      cur: -1
    });
    route('/s');
  }

  goMessage = () => {
    this.setState({
      cur: -1
    });
    route('/message');
  }

  render() {
    let cur = this.state.cur;
    return (
      <div className="g-stu-nav">
        <div className="g-logo">
          <img className="m-msg" src={message} onClick={this.goMessage}/>
          <div className="u-title" onClick={this.gohome}>毕业设计命题系统</div>
        </div>
        <div className="g-st">
          {this.currStage.stage.map((item, id) => 
            <span className={id === this.currStage.index ? 'm-st active' : 'm-st'}>{item}</span>
          )}
        </div>
        <div className="g-menu">
          {!this.selectTpInfo.id ?
            <div className={(cur == 0) ? 'm-menu-item active' : 'm-menu-item'} onClick={this.doMenu.bind(this, MENU_MAIN_S[0].path, 0)}>
              <img src={MENU_MAIN_S[0].icon} /><span className="m-menu-span">{MENU_MAIN_S[0].title}</span>
            </div>:
            <div className={(cur == 1) ? 'm-menu-item active' : 'm-menu-item'} onClick={this.doMenu.bind(this, MENU_MAIN_S[1].path, 1)}>
              <img src={MENU_MAIN_S[1].icon} /><span className="m-menu-span">{MENU_MAIN_S[1].title}</span>
            </div>
          }
        </div>
        <div className="g-footer">
          <div className="m-setting">
            <span>退出登录</span>
          </div>
          <div className="m-info">
            {this.usr.name && <p>姓名：{this.usr.name}</p>}
            {this.usr.uid && <p>学号：{this.usr.uid}</p>}
            {this.usr.cls && <p>班级：{this.usr.cls}</p>}
          </div>
        </div>
      </div>
    )
  }
}

export default NavS
