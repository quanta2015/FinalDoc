import { Component } from "preact";
import { inject, observer } from "mobx-react";
import { computed, toJS } from "mobx";
import { route } from "preact-router";
import { Card,Divider  } from "antd";

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
          <Card title="已经上传项目">
            <Card
              type="inner"
              title="Inner Card title"
              extra={<a href="#">More</a>}
            >
              Inner Card content
            </Card>
            <Card
              style={{ marginTop: 16 }}
              type="inner"
              title="Inner Card title"
              extra={<a href="#">More</a>}
            >
              Inner Card content
            </Card>
          </Card>
          
          <br></br>
          <Divider />
          <br></br>
          <Card title="尚未上传项目">
            <Card
              type="inner"
              title="Inner Card title"
              extra={<a href="#">More</a>}
            >
              Inner Card content
            </Card>
            <Card
              style={{ marginTop: 16 }}
              type="inner"
              title="Inner Card title"
              extra={<a href="#">More</a>}
            >
              Inner Card content
            </Card>
          </Card>
        </div>
      </>
    );
  }
}
