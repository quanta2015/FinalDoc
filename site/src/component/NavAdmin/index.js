import { Component } from "preact";
import { inject, observer } from "mobx-react";
import { computed, toJS } from "mobx";
import { route } from "preact-router";
import { Modal } from "antd";
import UploadImage from "../ImgUpload";
import { BankOutlined, CaretRightOutlined } from "@ant-design/icons";

import "./index.scss";
// import more from './more.svg'
import { ADMIN_NAV_DATA } from "../../constant/data";

@inject("manageStore", "userStore")
@observer
class NavAdmin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cur: 0,
      visible: false,
      status: {
        title: "1、选题阶段",
        content: ["指定命题", "分配命题", "审核命题", "双选命题"],
        active: 2,
      },
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
    let cur = this.state.cur;
    let status = this.state.status;
    return (
      <div data-component="navAdmin">
        <div className="g-admin-nav">
          <div
            className="g-home-title"
            onClick={() => {
              route("/t");
            }}
          >
            毕业论文管理系统
          </div>
          <div className="g-status">
            <div className="g-status-name">{status.title}</div>
            <div className="g-status-content">
              {status.content.map((c, i) => {
                return (
                  <>
                    <span
                      className={
                        i == status.active
                          ? "g-status-active g-status-item"
                          : "g-status-item"
                      }
                    >
                      {c}
                    </span>
                    {i < status.content.length - 1 && (
                      <CaretRightOutlined className="g-status-arrow" />
                    )}
                  </>
                );
              })}
            </div>
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
                  <BankOutlined className="iconStyle" />
                  <span>{item.title}</span>
                </div>
              );
            })}
          </div>

          <div className="g-info">
            <div>身份：教务处</div>
            <div>姓名：{this.usr.name}</div>
            <div>工号：{this.usr.uid}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default NavAdmin;
