import { Component } from "preact";
import { inject, observer } from "mobx-react";
import { computed, toJS } from "mobx";
import { route } from "preact-router";
import { Modal, Menu } from "antd";
import UploadImage from "../ImgUpload";
import { BankOutlined } from "@ant-design/icons";

import "./index.scss";
// import more from './more.svg'
import { ADMIN_NAV_DATA } from "../../constant/data";
const { SubMenu } = Menu;

@inject("manageStore", "userStore")
@observer
class NavM extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cur: null,
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

  doMenu = (path, key) => {
    console.log(this.state.cur, key);
    this.setState({ cur: key }, () => {
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
  handleMenuClick = (e) => {
    console.log("click ", e);
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
          <Menu
            mode="inline"
            className="main-menu"
            // onClick={this.handleMenuClick}
          >
            {ADMIN_NAV_DATA.map((item, index) => {
              console.log(item, index);
              return (
                <SubMenu
                  key={index}
                  title={
                    <span>
                      <BankOutlined className="iconStyle" />
                      {item.title}
                    </span>
                  }
                >
                  {item.childData.map((citem, cindex) => {
                    return (
                      <Menu.Item
                        className={
                          this.state.cur == index
                            ? "ant-menu-item-selected"
                            : "ant-menu-submenu-title"
                        }
                        onClick={this.doMenu.bind(
                          this,
                          citem.path,
                          `${index}+${cindex}`
                        )}
                        key={`${index}+${cindex}`}
                      >
                        <span>{citem.title}</span>
                      </Menu.Item>
                    );
                  })}
                </SubMenu>
              );
            })}
          </Menu>
        </div>
      </div>
    );
  }
}

export default NavM;
