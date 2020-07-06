import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import TotalSchedule from './totalSchedule.js'
import { computed } from 'mobx';
import "./style.css"

@inject('manageStore')
@observer
export default class Home extends Component {
	render() { 
		return (
            <div>

				<TotalSchedule/>
			</div>
        );
	}
}
