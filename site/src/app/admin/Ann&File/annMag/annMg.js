/*
 * @Descripttion: 管理员-公告文档-公告模块 preac
 * @version:
 * @Author: wyx
 * @Date: 2020-07-09 14:01:54
 * @LastEditors: wyx
 * @LastEditTime: 2020-07-09 20:32:46
 */

import { Component } from "preact";
import { inject, observer } from "mobx-react";
import { computed, toJS } from "mobx";
import "./annMg.scss";
import {
  Table,
  Pagination,
  Tag,
  Space,
  message,
  Modal,
  Button,
  Descriptions,
  Input,
  Tooltip,
  Popconfirm,
  Card,
  Divider,
  Col,
  Row,
  Form,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Upload,
  Result
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;

// function showTotal(total) {
//     return `共 ${total} 页`;
// }

@inject("adminStore", "userStore")
@observer
export default class AnnounceManage extends Component {
  state = {
    //filteredInfo: null,
    modalVisiable: false,
    uploaded: false,
    uploading: false,
    loading: false,
    fileUrl: "",
    showDel: false,
    total: 0,
    launchSucc:false,
  };

  @computed
  get announceManage() {
    return this.props.adminStore.announceManage;
  }

  @computed
  get usr() {
    return this.props.userStore.usr;
  }
  doReturn = () => {
    
    this.setState({
      launchSucc: false,
      modalVisiable:false
    });
    
  }
  handleModalCancel = () => {
  
    this.setState({
      modalVisiable: false,
      launchSucc: false,
    });
  };

  handleModalShow = () => {
    this.setState({
      modalVisiable: true,
    });
  };

  componentDidMount() {
    this.callAnnData()
  }

  callAnnData = () => {
    this.props.adminStore.getAnnData().then((r) => {
      console.log(r)
    });
  };

  //表头筛选
  // handleChange = (filters) => {s
  // 	this.setState({
  // 		filteredInfo: filters,
  // 	})
  // }

  clearFilters = () => {
    this.setState({ filteredInfo: null });
  };

  //表头搜索
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  //表头搜索重置
  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  //表格搜索
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={(node) => {
              this.searchInput = node;
            }}
            placeholder={`输入标题...`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              this.handleSearch(selectedKeys, confirm, dataIndex)
            }
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              onClick={() => this.handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              重置
          </Button>
            <Button
              type="primary"
              onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              搜索
          </Button>
          </Space>
        </div>
      ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) => text,
  });

  getonFinish = () => {
    const onFinish = (values) => {
      console.log(values);
      this.props.adminStore.launchAnn(values).then((r) => {
        // console.log('=========188==================',r)
        if(r.code===200)
        {
          this.callAnnData();
          this.setState({
            launchSucc:true
          })
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
      //  labelCol: { span: 8 },
      //  wrapperCol: { offset: 0, span: 16 },
    };
    return layout;
  };

  gettailLayout = () => {
    const tailLayout = {
      wrapperCol: { offset: 0, span: 16 },
    };
    return tailLayout;
  };
  showDetail=(key)=>{
    console.log("表格的id",key)
  }

  render() {
    const paginationProps = {
      showTotal: (total) => {
        return `共 ${total} 条`;
      },
    };
    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};
    //表格列
    const columns = [
      {
        title: "标题",
        dataIndex: "title",
        key: "title",
        ellipsis: true,
        ...this.getColumnSearchProps("title"),
      },
      {
        title: "目标对象",
        dataIndex: "target",
        key: "target",
        filters: [
          { text: "教师", value: "教师" },
          { text: "学生", value: "学生" },
          { text: "全体", value: "全体" },
        ],

        filterMultiple: false,
        //filteredValue: filteredInfo.result || null,
        onFilter: (value, record) => record.target === value,
      },
      {
        title: "发布日期",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "操作",
        key: "action",
        render: (text, record) => (
          <Space size="middle">
            <a onClick={()=>this.showDetail(record.key)} >详情</a>
          </Space>
        ),
      },
    ];
    const { modalVisiable,launchSucc } = this.state;
    const { fileUrl, showDel, loading } = this.state;

    return (
      <div>
        <Button
          className="m-release-btn"
          type="primary"
          icon={<PlusOutlined />}
          size={"small"}
          onClick={this.handleModalShow}
        >
          发布公告
        </Button>
        <div className="g-ann-list">
          <div className="m-detail-table">
            <Table
              dataSource={this.announceManage.announce_list}
              columns={columns}
              pagination={paginationProps}
            //onChange={this.handleChange}
            />
            {/* <Pagination total={50} showTotal={showTotal} /> */}
          </div>
          <Modal
            visible={modalVisiable}
            footer={null}
            onCancel={this.handleModalCancel}
            title="发布公告"
            width="900px"
            destroyOnClose={true}
          >
            {(!launchSucc) &&
              <div className="admin-ann-modal">
                <Row gutter={[8, 8]}>
                  <Col span={24}>
                    {" "}
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
                        label="请输入公告标题"
                        name="ann_title"
                        rules={[
                          {
                            required: true,
                            message: "Please input your announce title!",
                          },
                        ]}
                      >
                        <Input className="input_box" />
                      </Form.Item>

                      <Form.Item
                        className="label-text"
                        label="请选择公告对象"
                        name="ann_target"
                        rules={[
                          {
                            required: true,
                            message: "Please select your announce target!",
                          },
                        ]}
                      >
                        <Select>
                          <Select.Option value="all">全体师生</Select.Option>
                          <Select.Option value="tea">全体教师</Select.Option>
                          <Select.Option value="stu">全体学生</Select.Option>
                          <Select.Option value="leader">各系主任</Select.Option>
                        </Select>
                      </Form.Item>

                      <Form.Item
                        className="label-text"
                        label="请输入公告内容"
                        name="ann_context"
                        rules={[
                          {
                            required: true,
                            message: "Please input your announce context!",
                          },
                        ]}
                      >
                        <TextArea
                          autoSize={{ minRows: 2, maxRows: 6 }}
                          className="input_box"
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="subit_buttom"
                          onClick={this.getonFinish}
                        >
                          发布公告
                      </Button>
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>
              </div>
            }
            {(launchSucc) &&
              <div className="m-ret">
                <Result
                  status="success"
                  title="您的公告发布成功！"
                  //subTitle=""
                  extra={<Button type="primary" className="input-btn" onClick={this.doReturn} block>返 回</Button>}
                />
              </div>}
          </Modal>
        </div>
      </div>
    );
  }
}
