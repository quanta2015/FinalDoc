import { Component } from 'preact';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import "./style.scss"

@inject('userStore')
@observer
export default class Teacher extends Component {
  @computed
  get usr() {
      return this.props.userStore.usr;
  }

  componentDidMount() {
    if (!this.usr.id) {
      route('/')
    }
  }
	render() { 
		return (

      <div className="g-t">
        <div className="m-t">teacher info</div>
      </div>
    );
	}
}
