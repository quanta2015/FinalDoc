import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';
import "./style.scss"

@inject('manageStore','userStore')
@observer
export default class Manage extends Component {

  @computed
  get usr() {
      return this.props.userStore.usr;
  }

  componentDidMount() {
    if (!this.usr.uid) {
      route('/')
    }
  }

  render() {
    return (
      <div>
        <div className="g-m-title">公告栏</div>
        <div className="g-m m-m">123</div>
      </div>
    );
  }
}
