import { Component } from 'preact';
import { Router } from 'preact-router';
import AsyncRoute from 'preact-async-route';
import { createHashHistory } from 'history';

import NavT from './component/NavT'
import NavS from './component/NavS'
import './style.scss'

var usr = {
  name:'教师',
  role: 1    // 0: teacher 1:student 2: manage
}

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id="app">
        { (usr.role==0) && <NavT/>}
        { (usr.role==1) && <NavS/>}
        <Router >
          <AsyncRoute path='/t_manage'  getComponent={ () => import('./app/t/manage').then(module => module.default) } />
          <AsyncRoute path='/t_auditTP' getComponent={ () => import('./app/t/auditTP').then(module => module.default) } />
          <AsyncRoute path='/t_auditOP' getComponent={ () => import('./app/t/auditOP').then(module => module.default) }/>   
          <AsyncRoute path='/t_auditFD' getComponent={ () => import('./app/t/auditFD').then(module => module.default) }/>   
        </Router>
      </div>
    )
  }
}

export default App