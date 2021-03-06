import { Component,createRef } from "preact";
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
  Result,
  Popover,
  Popconfirm,
} from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  PlusOutlined,
  LoadingOutlined,
  CheckOutlined,
  CloseOutlined,
  MenuOutlined,
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
    stu_selected: false,
    popovervisiable: false,
  };
  @computed
  get usr() {
    return this.props.userStore.usr;
  }
  @computed
  get adminFileManage() {
    return this.props.adminStore.adminFileManage;
  }

  formRef = createRef();
  doReturn = () => {
    this.setState({
      fileLaunchSucc: false,
      modalVisiable: false,
      uploaded: false,
      uploading: false,
      loading: false,
      fileUrl: "",
      showDel: false,
      fileName: null,
      fillnameUpdate: false,
    });
  };
  handleModalCancel = () => {
    this.setState({
      modalVisiable: false,
      uploaded: false,
      uploading: false,
      loading: false,
      fileUrl: "",
      showDel: false,
      fileName: null,
      fillnameUpdate: false,
      fileLaunchSucc: false,
      stu_selected: false,
      popovervisiable: false,
      
    });
  };
  handleModalShow = () => {
    this.setState({
      modalVisiable: true,
    });
  };
  deletCancel = () => {
    message.error("取消删除");
    this.setState({
      popovervisiable: false,
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
  deletUploadedFile = (e) => {
    console.log("删除文件序号为", e);
    this.props.adminStore.delUploadedFile(e).then((r) => {
      console.log(r);
      this.callFilelist();
    });
    this.setState({
      popovervisiable: false,
    });
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
    this.formRef.current.setFieldsValue({
      f_name:this.state.fileName,
    })
    // this.props.form.setFieldsValue({
    //   f_name: this.state.fileName,
    // });
  };
  fileChange=(e)=>{
    console.log(e)
  }
  downloadFile = (params) => {
    this.props.adminStore.adminDownload(params).then((r) => {
      if (!r) {
        message.error("网络错误");
        this.setState({
          popovervisiable: false,
        });
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
  fileonSelect = (e) => {
    console.log(e);
    if (e === "22") {
      this.setState({
        stu_selected: true,
      });
    } else {
      this.setState({
        stu_selected: false,
      });
    }
  };
  handleDel = () => {
    this.setState({
      fileUrl: "",
      showDel: false,
      loading: false,
      fileName:"",
    });
  };
  filenameOnchange = (e) => {
    console.log(e);
  };
  handleVisibleChange = (popovervisiable) => {
    this.setState({ popovervisiable });
  };
  render() {
    const { modalVisiable, fileLaunchSucc, popovervisiable } = this.state;
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
                      headStyle={{ padding: "12px 12px 12px 12px" }}
                      bodyStyle={{ padding: "12px 0px 12px 12px" }}
                      extra={
                        <Popover
                          placement="rightTop"
                          title={"操作"}
                          trigger="click"
                          // visible={popovervisiable}
                          // onVisibleChange={this.handleVisibleChange}
                          content={
                            <div className="m-admin-file-card-extra">
                              <div className="n-admin-file-card-extra">
                                {" "}
                                <a
                                  href="#"
                                  onClick={() =>
                                    this.downloadFile({
                                      file: item.f_path,
                                      name: item.f_name,
                                    })
                                  }
                                >
                                  <DownloadOutlined />
                                  下载文件
                                </a>
                              </div>
                              <br></br>
                              <div className="u-del">
                                <Popconfirm
                                  overlayClassName="m-popconfirm"
                                  title="确定删除此文件？"
                                  onConfirm={() =>
                                    this.deletUploadedFile({
                                      id: item.id,
                                    })
                                  }
                                  onCancel={this.deletCancel}
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <a href="#">
                                    <CloseOutlined />
                                    删除文件
                                  </a>
                                </Popconfirm>
                              </div>
                            </div>
                          }
                        >
                          <a>
                            <MenuOutlined />
                          </a>
                        </Popover>
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
            destroyOnClose={true}
          >
            {!fileLaunchSucc && (
              <div className="admin-file-modal">
                <Form
                  {...this.getlayout()}
                  name="basic"
                  initialValues={{ remember: true }}
                  onFinish={this.getonFinish()}
                  onFinishFailed={this.getonFinishFailed()}
                  ref={this.formRef}
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
                       
                        shouldUpdate={true}
                      >
                        <Input
                          className="input_box"
                          values={this.state.fileName}
                          
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
                        <Select
                          className="input_box"
                          onSelect={this.fileonSelect}
                        >
                          <Select.Option value="21">
                            {" "}
                            师生模板文件{" "}
                          </Select.Option>
                          <Select.Option value="22">
                            {" "}
                            学生模板文件{" "}
                          </Select.Option>
                          <Select.Option value="23">
                            {" "}
                            教师模板文件{" "}
                          </Select.Option>
                          <Select.Option value="24">
                            系主任模板文件{" "}
                          </Select.Option>
                          <Select.Option value="3">
                            {" "}
                            评分模板文件{" "}
                          </Select.Option>
                        </Select>
                      </Form.Item>
                      {this.state.stu_selected && (
                        <Form.Item
                          className="label-text"
                          label="请选择学生文件模板类型"
                          name="f_sub_type"
                          rules={[
                            {
                              required: true,
                              message: "Please select your file type!",
                            },
                          ]}
                        >
                          <Select className="input_box">
                            <Select.Option value="221">
                              {" "}
                              开题中期{" "}
                            </Select.Option>
                            <Select.Option value="222">
                              {" "}
                              论文定稿{" "}
                            </Select.Option>
                            <Select.Option value="223">
                              {" "}
                              论文答辩{" "}
                            </Select.Option>
                          </Select>
                        </Form.Item>
                      )}
                    </Col>
                    <Col span={12}>
                      <Form.Item onChange={this.fileChange}>
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
