import { Component } from 'preact';
import { route } from 'preact-router';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { MENU_MAIN_S } from '../../constant/data';
import logo from '../../static/public/scl_logo.png';
import './index.scss'

@inject('userStore', 'studentStore')
@observer
class NavS extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cur: 0,
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

  render() {
    return (
      <div className="g-stu-nav">
        <div className="g-logo">
          <div>
            <img className="u-logo" src={logo} />
          </div>
          <div className="u-title">毕业设计管理系统</div>
        </div>
        <div className="g-st">
          {this.currStage.stage.map((item, id) =>
            <span className={id === this.currStage.index ? 'm-st active' : 'm-st'}>{item}</span>
          )}
        </div>
        <div className="g-menu">
          {MENU_MAIN_S.map((item, i) => 
            <>
              {((i === 0) || (!this.selectTpInfo.id && i === 1) || (this.selectTpInfo.id && i === 2)) &&
                <div className={(this.state.cur == i) ? 'm-menu-item active' : 'm-menu-item'} key={i} onClick={this.doMenu.bind(this, item.path, i)}>
                  <img src={item.icon} /><span className="m-menu-span">{item.title}</span>
                </div>
              }
            </>
          )}
        </div>
        <div className="g-footer">
          <div className="m-setting">
            <span>退出登录</span>
          </div>
          <div className="m-tag">
            <span>学生</span>
            {this.usr.cls && <div className="u-cls">{this.usr.cls}</div>}
          </div>
          <div className="m-info">
            {this.usr.uid && <span>{this.usr.uid}</span>}
            {this.usr.name && <span>{this.usr.name}</span>}
          </div>
        </div>
      </div>
    )
  }
}

export default NavS
