/*
 * @Author: your name
 * @Date: 2020-07-14 21:28:50
 * @LastEditTime: 2020-08-23 20:20:57
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \FinalDoc\site\src\App.js
 */
import { Component } from 'preact';
import { Router, route } from 'preact-router';
import AsyncRoute from 'preact-async-route';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';


import NavAdmin from './component/NavAdmin'
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
  handleapp = () => {
    console.log(JSON.stringify(this.usr.role));
    if (!this.usr.role) {
      return "app_login";
    }

    else {
      return "app";
    }

  };

  render() {
    return (
      // <div id={this.handleapp()}>
      <div id="app">
        {(this.usr.role == 0) && <NavT />}
        {(this.usr.role == 1) && <NavS />}
        {(this.usr.role == 2) && <NavM />}
        { (this.usr.role == 3) && <NavAdmin /> }

        <div id="context">
          <Router onChange={this.handleRoute}>
            {/* 系统模块 */}
            <AsyncRoute exact path='/'  getComponent={ () => import('./app/login').then(module => module.default) } />

            {/* 教师模块 */}
            <AsyncRoute path='/t' getComponent={() => import('./app/t').then(module => module.default)} />
            <AsyncRoute path='/t_manage' getComponent={() => import('./app/t/manage').then(module => module.default)} />
            <AsyncRoute path='/t_auditTP' getComponent={() => import('./app/t/auditTP').then(module => module.default)} />
            <AsyncRoute path='/t_auditOP' getComponent={() => import('./app/t/auditOP').then(module => module.default)} />
            <AsyncRoute path='/t_auditFD' getComponent={() => import('./app/t/auditFD').then(module => module.default)} />
            <AsyncRoute path='/t_formOP' getComponent={ () => import('./app/t/formOP').then(module => module.default) }/>
            <AsyncRoute path='/t_formFD' getComponent={ () => import('./app/t/formFD').then(module => module.default) }/>


            {/* 学生模块 */}
            <AsyncRoute path='/s' getComponent={() => import('./app/s').then(module => module.default)} />
            <AsyncRoute path='/s_selectTL' getComponent={() => import('./app/s/selectTL').then(module => module.default)} />
            <AsyncRoute path='/s_topicPG' getComponent={() => import('./app/s/topicPG').then(module => module.default)} />

            {/* 系主任端 */}
            <AsyncRoute path='/m' getComponent={() => import('./app/m').then(module => module.default)} />
            <AsyncRoute path='/m_distributeTopic' getComponent={() => import('./app/m/distributeTopic').then(module => module.default)} />
            <AsyncRoute path='/m_organizeOpendefence' getComponent={() => import('./app/m/organizeOpendefence').then(module => module.default)} />
            <AsyncRoute path='/m_distributeReviewers' getComponent={() => import('./app/m/distributeReviewers').then(module => module.default)} />
            <AsyncRoute path='/m_reviewPaper' getComponent={() => import('./app/m/reviewPaper').then(module => module.default)} />
            <AsyncRoute path='/m_viewProgress' getComponent={() => import('./app/m/viewProgress').then(module => module.default)} />
            <AsyncRoute path='/m_summary' getComponent={() => import('./app/m/summary').then(module => module.default)} />
            <AsyncRoute path='/m_organizeFinaldefence' getComponent={() => import('./app/m/organizeFinaldefence').then(module => module.default)} />
               {/* 教务处模块 */}
          <AsyncRoute  exact path='/admin'  getComponent={ () => import('./app/admin').then(module => module.default) } />
          <AsyncRoute   path='/admin_ann' getComponent={ () => import('./app/admin/Ann&File').then(module => module.default) }/>
          <AsyncRoute   path='/admin_file' getComponent={ () => import('./app/admin/Ann&File/fileMag').then(module => module.default) }/>
          <AsyncRoute   path='/admin_sys_set' getComponent={ () => import('./app/admin/SysCal/index').then(module => module.default) }/>
          <AsyncRoute   path='/admin_topic_admin' getComponent={ () => import('./app/admin/TopicMag/index.js').then(module => module.default) }/>
          <AsyncRoute   path='/admin_mid_check' getComponent={ () => import('./app/admin/MidCheck/index.js').then(module => module.default) }/>
          <AsyncRoute   path='/admin_debate_review' getComponent={ () => import('./app/admin/ReviewDebate/index.js').then(module => module.default) }/>
          <AsyncRoute   path='/admin_score_analysis' getComponent={ () => import('./app/admin/ScoreAnalysis/index.js').then(module => module.default) }/>
          <AsyncRoute path='/admin_schedule_set' getComponent={() => import('./app/admin/timeline/index').then(module => module.default)} />
          </Router>
        </div>
      </div>
    )
  }
}

export default App