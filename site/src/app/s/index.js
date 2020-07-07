import { Component } from 'preact';
import { route } from 'preact-router';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import "./style.css"

@inject('userStore', 'studentStore')
@observer
export default class Student extends Component {
  @computed
  get usr() {
    return toJS(this.props.userStore.usr);
  }

  componentDidMount() {
    this.props.studentStore.getSelectTopic({ uid: this.usr.uid })
      .then(r => {
        // if (!this.usr.uid) {
        //   route('/');
        // }else if (!r ) { //未双选
        //   route('/s_selectTL');
        // } else { //已双选
        //   route('/s_topicPG');
        // }
        // route('/s_topicPG')
        route('/s_selectTL')
      })
  }

  render() {
    return (
      <div className="g-s">
        <div className="m-s">Student info</div>
      </div>
    );
  }
}
