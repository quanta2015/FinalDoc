import { Component } from "preact";
import { inject, observer } from "mobx-react";
import { computed, toJS } from "mobx";
import { route } from "preact-router";
import { Modal } from "antd";
import UploadImage from "../ImgUpload";
import { BankOutlined, CaretRightOutlined } from "@ant-design/icons";
import BaseActions from "../BaseActions";
import { Divider } from "antd";

import "./index.scss";
// import more from './more.svg'
import { ADMIN_NAV_DATA } from "../../constant/data";

@inject("adminStore", "userStore")
@observer
class NavAdmin extends BaseActions {
  constructor(props) {
    super(props);

    this.state = {
      cur: 0,
      checkList: [],
      //状态信息
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

  async componentDidMount() {
    // let list = [];
    // //post请求获取数据，看length是否为0.如果不为0，则显示该tab
    // // let x = await this.post(urls.API_SYS_TEACHER_AUDIT_TP_GET_TOPIC_LIST, {
    // //   uid: this.usr.uid,
    // // });
    // console.log(x);
    // if (x.data.length > 0) {
    //   list.push(MENU_MAIN_T_AUDIT[0]);
    // }
    // this.setState({ checkList: list });
    //获取当前系统状态信息，并且更新state
    //当前为写死的
    //目前的想法是把所有状态宏定义在存储里
    //ajax获取状态码
  }

  doMenu = (path, i) => {
    this.setState({ cur: i }, () => {
      route(path);
    });
  };

  gohome = () => {
    route("/m");
  };

  render() {
    let cur = this.state.cur;
    let status = this.state.status;
    return (
      <div data-component="navAdmin">
        <div className="g-admin-nav">
          <div className="g-logo">
            <div onClick={this.gohome}>毕业设计命题系统</div>
          </div>
          <div className="g-st">
            {this.state.status.content.map((c, i) => {
              return (
                <>
                  <span
                    className={
                      i == this.state.status.active ? "m-st active" : "m-st"
                    }
                  >
                    {c}
                  </span>
                </>
              );
            })}
          </div>
          <div className="g-menu">
            {ADMIN_NAV_DATA.map((item, i) => (
              <div
                className={
                  this.state.cur == i + 4 ? "m-menu-item active" : "m-menu-item"
                }
                key={i + 4}
                onClick={this.doMenu.bind(this, item.path, i + 4)}
              >
                <div className='z-icon '>  <BankOutlined /></div>

                <span className="m-menu-span">{item.title}</span>
              </div>
            ))}
            <br />
            {this.state.checkList.map((item, i) => (
              <div
                className={
                  this.state.cur == i + 4 + 1
                    ? "m-menu-item active"
                    : "m-menu-item"
                }
                key={i + 4 + 1}
                onClick={this.doMenu.bind(this, item.path, i + 4 + 1)}
              >
                <BankOutlined className="z-icon" />
                <span className="m-menu-span">{item.title}</span>
              </div>
            ))}
          </div>
          <div className="g-info">
            <div className="m-info">
              <div className="g-info-typeline">
                <div className="g-info-type">教务处</div>
              </div>

              <div className="g-info-name">
                <span className="z-info-id">{this.usr.uid}</span>
                <span className="z-info-name">{this.usr.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NavAdmin;
