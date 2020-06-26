import './style';
import { Component } from 'preact';
import { Provider } from 'mobx-react'
import { configure } from 'mobx'

import injects from './store'
import App from './App'

import './style.scss'
import 'antd/dist/antd.css';

import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'

export default class Root extends Component {
  render() {
    return (
      <Provider {...injects}>
        <ConfigProvider locale={zhCN}>
          <App></App>
        </ConfigProvider>
      </Provider>
    );
  }
}
