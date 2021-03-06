import { Component } from 'preact';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import Message from '../../component/Message'
import Announcement from '../../component/Announcement';
import { route } from 'preact-router';
import "./style.scss"

@inject('userStore')
@observer
export default class Teacher extends Component {
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

      <div className="g-t">
        <div className="m-t">
          <Message />
          <Announcement pageSize={12} height={550} />
        </div>
      </div>
    );
	}
}
