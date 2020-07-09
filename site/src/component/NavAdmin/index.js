import { Component } from "preact";
import { inject, observer } from "mobx-react";
import { computed, toJS } from "mobx";
import { route } from "preact-router";
import { Modal } from "antd";
import UploadImage from "../ImgUpload";
import {BankOutlined} from '@ant-design/icons';

import "./index.scss";
// import more from './more.svg'
import { ADMIN_NAV_DATA } from "../../constant/data";

@inject("manageStore", "userStore")
@observer
class NavM extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cur: 0,
      visible: false,
    };
  }

  @computed
  get usr() {
    return this.props.userStore.usr;
  }

  componentDidMount() {
    // if (!this.usr.uid) {
    //   route('/')
    // }
    // route('/m_distributeTopic')
  }

  doMenu = (path, i) => {
    this.setState({ cur: i }, () => {
      route(path);
    });
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <div className="g-admin-nav">
        <div className="g-info">
          <div>身份：教务处</div>
          <div>姓名：{this.usr.name}</div>
          <div>工号：{this.usr.uid}</div>
        </div>
        <div className="g-menu">
          {ADMIN_NAV_DATA.map((item, i) => {
            return (
              <div
                className={
                  this.state.cur == i ? "m-menu-item active" : "m-menu-item"
                }
                key={i}
                onClick={this.doMenu.bind(this, item.path, i)}
              >
                <BankOutlined className="iconStyle"/>
                <span>{item.title}</span>

              </div>
            );
          })}
        </div>
        
      </div>
    );
  }
}

export default NavM;
