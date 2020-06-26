import { Component } from 'preact';
import { Router } from 'preact-router';
import AsyncRoute from 'preact-async-route';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { createHashHistory } from 'history';

import NavT from './component/NavT'
import NavS from './component/NavS'
import './style.scss'

@inject('userStore')
@observer
class App extends Component {
  constructor(props) {
    super(props)
  }

  @computed
  get usr() {
    return this.props.userStore.usr;
  }

  render() {
    return (
      <div id="app">
        { (this.usr.role==0) && <NavT/>}
        { (this.usr.role==1) && <NavS/>}
        <Router >
          <AsyncRoute path='/t_manage'  getComponent={ () => import('./app/t/manage').then(module => module.default) } />
          <AsyncRoute path='/t_auditTP' getComponent={ () => import('./app/t/auditTP').then(module => module.default) } />
          <AsyncRoute path='/t_auditOP' getComponent={ () => import('./app/t/auditOP').then(module => module.default) }/>   
          <AsyncRoute path='/t_auditFD' getComponent={ () => import('./app/t/auditFD').then(module => module.default) }/>   
          <AsyncRoute path='/s_selectTL' getComponent={() => import('./app/s/selectTL').then(module => module.default)} />
          <AsyncRoute path='/s_topicPG' getComponent={() => import('./app/s/topicPG').then(module => module.default)} />
        </Router>
      </div>
    )
  }
}

export default App