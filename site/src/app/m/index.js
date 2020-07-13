import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { route } from 'preact-router';
import "./style.css"

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

      <div className="g-m">
        <div className="m-m">Manage info</div>
      </div>
    );
  }
}
