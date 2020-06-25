import { Component } from 'preact';
import { Router } from 'preact-router';
import AsyncRoute from 'preact-async-route';
import { createHashHistory } from 'history';

import Nav from './component/Nav'

class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id="app">
        <Nav/>
        <Router >
          <AsyncRoute path='/'      getComponent={ () => import('./app/home').then(module => module.default) } />
          <AsyncRoute path='/login' getComponent={ () => import('./app/login').then(module => module.default) } />
          <AsyncRoute path='/proj'  getComponent={ () => import('./app/proj').then(module => module.default) }/>
        </Router>
      </div>
    )
  }
}

export default App