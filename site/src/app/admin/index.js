import { Component } from "preact";
import { route } from "preact-router";
import { inject, observer } from "mobx-react";
import { computed, toJS } from "mobx";

@inject("userStore")
@observer
export default class Student extends Component {
  @computed
  get usr() {
    return toJS(this.props.userStore.usr);
  }

  componentDidMount() {
    console.log("this.usr.uid");
    if (!this.usr.uid) route("/");
  }

  render() {
    console.log("========管理端页面===========");
    return (
      <div>
        <div>Admin info</div>
      </div>
    );
  }
}
