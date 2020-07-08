import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import BaseActions from '../../../component/BaseActions';
import UploadImg from '../../../component/ImgUpload'
import { route } from 'preact-router';

import './index.css';

@inject('userStore')
@observer
export default class System extends BaseActions{

	@computed
  get usr() {
      return this.props.userStore.usr;
  }

	componentDidMount(){
    if (!this.usr.id) {
			route('/')
		}
	}

	render() {
		return (
			<div data-component="tsystem">  
				<div className="sign-line">
					<span>签名：</span>
					<UploadImg uid={this.usr.uid}/></div>
			</div>
		);
	}
}
