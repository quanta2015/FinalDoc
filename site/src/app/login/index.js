import { Component } from "preact";
import { inject, observer } from "mobx-react";
import { computed } from "mobx";
import "./style.scss";
import {
  InputNumber,
  Select,
  Button,
  message,
  Icon,
  Form,
  Input,
  Divider,
  Checkbox,
} from "antd";
import { route } from "preact-router";
import token from "../../util/token.js";
const { Option } = Select;

@inject("userStore")
@observer
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      username: "",
      password: "",
      rememberMe: true,
    };
    let user = token.getUser();
    console.log(JSON.stringify(user))
    if (user) {
      let values = { uid: user[0].uid, password: user[0].pwd };
      this.props.userStore.login(values).then((r) => {
        console.log('=========75==================',r)
        if (r.data && r.code === 200) {

          message.success(r.msg);
          if (r.data[0].role == 0)
            route('/t', true)
          if (r.data[0].role == 2)
            route('/m', true)
          if (r.data[0].role == 1)
            route('/s', true)
        } else if (r.code === 301) {
          message.error(r.msg);
        }

        //  console.log("Success:", values);
      })


    };
  }

  @computed
  get usr() {
    return this.props.userStore.usr;
    
  }

  // doLogin = () => {
  //   this.props.form.validateFields(async (err, values) => {
  //     if (err) {
  //       return;
  //     }

  //     console.log(values);

  //     this.props.userStore.login(values).then((r) => {
  //       console.log('接收',r)
  //       if (r && r.code === 200) {
  //         console.log('succ')
  //         message.success(r.msg);
  //       } else if (r && r.code === 301) {
  //         console.log('fail')
  //         message.error(r.msg);
  //       }
  //     });
  //   });
  // };
  getlayout = () => {
    const layout = {
      labelAlign: "left",
      hideRequiredMark: true,
      labelCol: { span: 8 },
      wrapperCol: { offset: 0, span: 16 },
    };
    return layout;
  };
  gettailLayout = () => {
    const tailLayout = {
      wrapperCol: { offset: 0, span: 16 },
    };
    return tailLayout;
  };

  getonFinish = () => {
    const onFinish = (values) => {
      this.props.userStore.login(values).then((r) => {
        //console.log('=========75==================',r)
        if (r.data && r.code === 200) {

          message.success(r.msg);
          if (r.data[0].role == 0)
            route('/t', true)
          if (r.data[0].role == 2)
            route('/m', true)
          if (r.data[0].role == 1)
            route('/s', true)
        } else if (r.code === 301) {
          message.error(r.msg);
        }

        //  console.log("Success:", values);
      })


    };
    return onFinish;
  };

  getonFinishFailed = () => {
    const onFinishFailed = (errorInfo) => {
      //  console.log("Failed:", errorInfo);
    };
    return onFinishFailed;
  };

  render() {
    return (
      <div data-component="login">
        <div className="rootbody" >
          <div className="root">
            <div className="fake_background">
              <div className='cap_logo'></div>
              <div className='xiaoxun'></div>
            </div>
            <div className="right_box">
              <div className="logo_box">
                <div className="logo">
                </div>
              </div>
              <div className="login_box">
                <div className="login_body">
                  <div className="login_box">
                    <Form
                      {...this.getlayout()}
                      name="basic"
                      initialValues={{ remember: true }}
                      onFinish={this.getonFinish()}
                      onFinishFailed={this.getonFinishFailed()}
                      layout={"vertical"}
                    >
                      <Form.Item
                        className="label-text"
                        label="ID"
                        name="uid"
                        rules={[
                          {
                            required: true,
                            message: "Please input your ID!",
                          },
                        ]}
                      >
                        <Input className="input_box" />
                      </Form.Item>

                      <Form.Item
                        className="label-text"
                        label="Password"
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "Please input your password!",
                          },
                        ]}
                      >
                        <Input.Password className="input_box" />
                      </Form.Item>

                      <Form.Item {...this.gettailLayout()}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="subit_buttom"

                        >
                          Submit
                        </Button>
                      </Form.Item>
                    </Form>
                    <div className="under_sign">
                      <div className="remember">
                        <Checkbox>Remember me?</Checkbox>
                      </div>
                      <div>
                        <span>Forgot password?</span>
                        <br></br>
                        <br></br>
                        <div className="url_login">
                          <span>统一身份认证登录</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="login_title">
                    <span>毕业论文管理系统</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export default Login
