import { Component } from 'preact';
import { Router } from 'preact-router';
import AsyncRoute from 'preact-async-route';
import { createHashHistory } from 'history';

import NavT from './component/NavT'
import NavS from './component/NavS'
import NavM from './component/NavM'
import './style.scss'
import { computed, observable } from 'mobx'
import { inject, observer } from 'mobx-react'

// var usr = {
//   name:'专业负责人',
//   role:2    // 0: teacher 1:student 2: manage
// }

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
        { (this.usr.role==2) && <NavM/>}
        <div id="context">
        <Router >
          <AsyncRoute path='/t_manage'  getComponent={ () => import('./app/t/manage').then(module => module.default) } />
          <AsyncRoute path='/t_auditTP' getComponent={ () => import('./app/t/auditTP').then(module => module.default) } />
          <AsyncRoute path='/t_auditOP' getComponent={ () => import('./app/t/auditOP').then(module => module.default) }/>   
          <AsyncRoute path='/t_auditFD' getComponent={ () => import('./app/t/auditFD').then(module => module.default) }/>
          {/* 系主任端 */}
          <AsyncRoute path='/m_distributeTopic' getComponent={ () => import('./app/m/distributeTopic').then(module => module.default) }/>
          <AsyncRoute path='/m_organizeOpendefence' getComponent={ () => import('./app/m/organizeOpendefence').then(module => module.default) }/>
          <AsyncRoute path='/m_reviewPaper' getComponent={ () => import('./app/m/reviewPaper').then(module => module.default) }/>
          <AsyncRoute path='/m_viewProgress' getComponent={ () => import('./app/m/viewProgress').then(module => module.default) }/> 
        </Router>
        </div>
      </div>
    )
  }
}

export default App