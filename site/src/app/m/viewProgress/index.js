import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import "./style.css"

@inject('manageStore')
@observer
export default class Home extends Component {
	render() { 
		return (
            <div>查看论文进度</div>
        );
	}
}
