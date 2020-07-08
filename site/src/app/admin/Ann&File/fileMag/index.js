import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';


@inject('userStore')
@observer
export default class file extends Component {

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

      <div className="g-m">
        <div className="m-m">文件模块</div>
      </div>
    );
  }
}
