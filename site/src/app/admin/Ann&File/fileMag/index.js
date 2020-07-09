import { Component } from "preact";
import { inject, observer } from "mobx-react";
import { computed, toJS } from "mobx";
import { route } from "preact-router";
import { Card, Divider, Col, Row } from "antd";
import {
  UploadOutlined,
  
} from '@ant-design/icons';
@inject("userStore")
@observer
export default class fileManage extends Component {
  @computed
  get usr() {
    return this.props.userStore.usr;
  }

  componentDidMount() {
    if (!this.usr.uid) {
      route("/");
    }
  }

  render() {
    return (
      <>
        <div className="g-m">
          <div className="m-m"></div>
          <Card title="已经上传项目"    extra={<a href="#">  <UploadOutlined /></a>}>
       
              <Row gutter={[8, 8]}>
                <Col span={6}>
                  <Card type="inner" title="名称" extra={<a href="#">More</a>}>
                    学生名单
                  </Card>
                </Col>
                <Col span={6}>
                  <Card type="inner" title="名称" extra={<a href="#">More</a>}>
                    学生名单
                  </Card>
                </Col>
                <Col span={6}>
                  <Card type="inner" title="名称" extra={<a href="#">More</a>}>
                    学生名单
                  </Card>
                </Col>
                <Col span={6}>
                  <Card type="inner" title="名称" extra={<a href="#">More</a>}>
                    学生名单
                  </Card>
                </Col>
              </Row>
        
          </Card>

          
          <Divider />
         
        </div>
      </>
    );
  }
}
