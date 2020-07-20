import { Component } from "preact";
import { inject, observer } from "mobx-react";
import { computed, toJS } from "mobx";
import { route } from "preact-router";
import {
  Card,
  Divider,
  Col,
  Row,
  Modal,
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Upload,
  Tooltip,
  message,
  Result
} from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  PlusOutlined,
  LoadingOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "./index.scss";
import FileUpload from "../../../../component/FileUpload";
import { FILE_UPLOAD_FORMAT } from "../../../../constant/data";
import { API_ADMIN_UPLOAD_FILE } from "../../../../constant/urls";
import FormItem from "antd/lib/form/FormItem";
import Item from "antd/lib/list/Item";
@inject("userStore", "adminStore")
@observer
export default class fileManage extends Component {
  state = {
    modalVisiable: false,
    uploaded: false,
    uploading: false,
    loading: false,
    fileUrl: "",
    showDel: false,
    fileName: null,
    fillnameUpdate: false,
    fileLaunchSucc: false,
  };
  @computed
  get usr() {
    return this.props.userStore.usr;
  }
  @computed
  get adminFileManage() {
    return this.props.adminStore.adminFileManage;
  }
  doReturn = () => {
    this.setState({
      fileLaunchSucc: false,
      modalVisiable: false,
      
    });
  };
  handleModalCancel = () => {
    this.setState({
      modalVisiable: false,
      fileLaunchSucc: false,
    });
  };
  handleModalShow = () => {
    this.setState({
      modalVisiable: true,
    });
  };

  componentDidMount() {
    if (!this.usr.uid) {
      route("/");
    }
    this.callFilelist();
  }
  getonFinish = () => {
    const onFinish = (values) => {
      values.f_path = this.state.fileUrl;
      console.log(values);
      this.props.adminStore.launchfile(values).then((r) => {
        if (r !== 301) {
          this.callFilelist();
          this.setState({
            fileLaunchSucc: true,
          });
        }
      });
    };
    return onFinish;
  };

  getonFinishFailed = () => {
    const onFinishFailed = (errorInfo) => {
      //  console.log("Failed:", errorInfo);
    };
    return onFinishFailed;
  };
  getlayout = () => {
    const layout = {
      //  labelAlign: "left",
      hideRequiredMark: true,
      //labelCol: { span: 8 },
      //wrapperCol: { offset: 0, span: 16 },
    };
    return layout;
  };
  gettailLayout = () => {
    const tailLayout = {
      wrapperCol: { offset: 0, span: 16 },
    };
    return tailLayout;
  };
  handleChange = (info) => {
    if (info.file.status === "uploading") {
      this.setState({
        loading: true,
        fileName: info.file.name,
        fillnameUpdate: true,
      });
      return;
    }
    console.log("文件信息", info.file.name);
    if (info.file.status === "done") {
      this.setState({
        loading: false,
        fileUrl: info.file.response.data,
        fileName: info.file.name,
        fillnameUpdate: true,
      });
      message.success(`成功上传文件《${info.file.name}》`);
    }
  };

  downloadFile = () => {
    let params = {
      file: this.state.fileUrl,
      id: this.props.tpInfo.sid,
      name: this.props.type.name,
    };
    this.props.userStore.downloadFile(params).then((r) => {
      if (!r) {
        message.error("网络错误");
      }
    });
  };

  beforeUpload = (file) => {
    if (!file) {
      this.setState({ fileUrl: "" });
      return;
    }
    // 文件格式约束
    let tag = true;
    let fileFormat = file.name.slice(file.name.indexOf(".") + 1);

    // 文件大小约束
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("请重新选择文件，文件不得大于10M");
    }

    return tag && isLt10M;
  };

  handleHover = () => {
    if (this.state.fileUrl) {
      this.setState({
        showDel: true,
      });
    }
  };

  handleMouseOut = () => {
    if (this.state.fileUrl) {
      this.setState({
        showDel: false,
      });
    }
  };
  callFilelist = () => {
    this.props.adminStore.getFileList().then((r) => {
      console.log(r);
    });
  };

  handleDel = () => {
    this.setState({
      fileUrl: "",
      showDel: false,
      loading: false,
    });
  };
  filenameOnchange = (e) => {
    console.log(e);
  };
  render() {
    const { modalVisiable, fileLaunchSucc } = this.state;
    const { fileUrl, showDel, loading } = this.state;

    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <div>
        <div className="g-admin-fileMag">
          <Card
            title="已上传项目"
            extra={
              <a onClick={this.handleModalShow}>
                <UploadOutlined />
              </a>
            }
          >
            <Row gutter={[0, 0]}>
              {this.adminFileManage.file_list.map((item, index) => {
                return (
                  <Col span={6} key={Item.key}>
                    <Card
                      type="inner"
                      title={item.f_name}
                      bodyStyle={{ padding: "12px 0px 12px 12px" }}
                      extra={
                        <a href="#">
                          <DownloadOutlined />
                        </a>
                      }
                    >
                      <Row gutter={[0, 0]}>
                        <Col span={8}>
                          {" "}
                          <div className="m-file-cardbox">文件类型</div>
                        </Col>
                        <Col span={16}>
                          {" "}
                          <div className="m-file-cardbox">{item.f_type}</div>
                        </Col>
                        <Col span={8}>
                          {" "}
                          <div className="m-file-cardbox">上传时间</div>
                        </Col>
                        <Col span={16}>
                          {" "}
                          <div className="m-file-cardbox">{item.f_time}</div>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Card>
          <Modal
            visible={modalVisiable}
            footer={null}
            onCancel={this.handleModalCancel}
            title="上传文件"
            width="900px"
          >
            {!fileLaunchSucc && (
              <div className="admin-file-modal">
                <Form
                  {...this.getlayout()}
                  name="basic"
                  initialValues={{ remember: true }}
                  onFinish={this.getonFinish()}
                  onFinishFailed={this.getonFinishFailed()}
                  // value={{
                  //   f_name:this.state.fileName
                  // }}
                  layout={"vertical"}
                  setFieldsValue
                >
                  <Row gutter={[8, 8]}>
                    <Col span={12}>
                      {" "}
                      <Form.Item
                        className="label-text"
                        label="请输入文件名"
                        name="f_name"
                        rules={[
                          {
                            required: true,
                            message: "Please input your filename!",
                          },
                        ]}
                        initialValue={this.state.fileName}
                        shouldUpdate={true}
                      >
                        <Input
                          className="input_box"
                          values={this.state.fileName}
                          onChange={this.filenameOnchange.bind(this)}
                        />
                      </Form.Item>
                      <Form.Item
                        className="label-text"
                        label="请选择文件类型"
                        name="f_type"
                        rules={[
                          {
                            required: true,
                            message: "Please select your file type!",
                          },
                        ]}
                      >
                        <Select className="input_box">
                          <Select.Option value="all">
                            {" "}
                            师生模板文件{" "}
                          </Select.Option>
                          <Select.Option value="stu">
                            {" "}
                            学生模板文件{" "}
                          </Select.Option>
                          <Select.Option value="tea">
                            {" "}
                            教师模板文件{" "}
                          </Select.Option>
                          <Select.Option value="leader">
                            系主任模板文件{" "}
                          </Select.Option>
                          <Select.Option value="score">
                            {" "}
                            评分模板文件{" "}
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item>
                        <Card title="请选择文件上传">
                          <div
                            className="m-filewp z-submit-wp"
                            onMouseOver={this.handleHover}
                            onMouseLeave={this.handleMouseOut}
                          >
                            {showDel && !loading && (
                              <CloseOutlined
                                className="u-del"
                                onClick={this.handleDel}
                              />
                            )}
                            <Upload
                              name="file"
                              listType="picture-card"
                              className="avatar-uploader"
                              showUploadList={false}
                              action={API_ADMIN_UPLOAD_FILE}
                              data={() => {
                                return {};
                              }}
                              beforeUpload={this.beforeUpload}
                              onChange={this.handleChange}
                            >
                              {fileUrl && !loading ? (
                                <CheckOutlined className="z-success" />
                              ) : (
                                uploadButton
                              )}
                            </Upload>
                          </div>
                        </Card>
                      </Form.Item>
                    </Col>
                    <Form.Item className="label-text">
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="subit_buttom"
                      >
                        上传文件
                      </Button>
                    </Form.Item>
                  </Row>
                </Form>
              </div>
            )}
            {fileLaunchSucc && (
              <div className="m-ret">
                <Result
                  status="success"
                  title="您的公告发布成功！"
                  //subTitle=""
                  extra={
                    <Button
                      type="primary"
                      className="input-btn"
                      onClick={this.doReturn}
                      block
                    >
                      返 回
                    </Button>
                  }
                />
              </div>
            )}
          </Modal>
          <Divider />
        </div>
      </div>
    );
  }
}
