import { Component } from 'preact';
import { Router,route } from 'preact-router';
import AsyncRoute from 'preact-async-route';
import { inject, observer } from 'mobx-react';
import { computed,toJS } from 'mobx';

import NavT from './component/NavT'
import NavS from './component/NavS'
import NavM from './component/NavM'
import './style.scss'


@inject('userStore')
@observer
class App extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  @computed
  get usr() {
    return this.props.userStore.usr;
  }


  render() {

    return (
      <div id="app">
        { (this.usr.role == 0) && <NavT/> }
        { (this.usr.role == 1) && <NavS/> }
        { (this.usr.role == 2) && <NavM/> }

        <div id="context">
        <Router >
          {/* 系统模块 */}
          <AsyncRoute path='/'  getComponent={ () => import('./app/login').then(module => module.default) } />
          
          {/* 教师模块 */}
          <AsyncRoute path='/t'  getComponent={ () => import('./app/t').then(module => module.default) } />
          <AsyncRoute path='/t_manage'  getComponent={ () => import('./app/t/manage').then(module => module.default) } />
          <AsyncRoute path='/t_auditTP' getComponent={ () => import('./app/t/auditTP').then(module => module.default) } />
          <AsyncRoute path='/t_auditOP' getComponent={ () => import('./app/t/auditOP').then(module => module.default) }/>   
          <AsyncRoute path='/t_auditFD' getComponent={ () => import('./app/t/auditFD').then(module => module.default) }/>
          
          {/* 学生模块 */}
          <AsyncRoute path='/s'  getComponent={ () => import('./app/s').then(module => module.default) } />
          <AsyncRoute path='/s_selectTL' getComponent={() => import('./app/s/selectTL').then(module => module.default)} />
          <AsyncRoute path='/s_topicPG' getComponent={() => import('./app/s/topicPG').then(module => module.default)} />
          
          {/* 系主任端 */}
          <AsyncRoute path='/m'  getComponent={ () => import('./app/m').then(module => module.default) } />
          <AsyncRoute path='/m_distributeTopic' getComponent={ () => import('./app/m/distributeTopic').then(module => module.default) }/>
          <AsyncRoute path='/m_organizeOpendefence' getComponent={ () => import('./app/m/organizeOpendefence').then(module => module.default) }/>
          <AsyncRoute path='/m_organizeFinaldefence' getComponent={ () => import('./app/m/organizeFinaldefence').then(module => module.default) }/>
          <AsyncRoute path='/m_viewProgress' getComponent={ () => import('./app/m/viewProgress').then(module => module.default) }/> 
        </Router>
        </div>
      </div>
    )
  }
}

export default App