/*
 * @Description: 
 * @version: 
 * @Author: queue
 * @Date: 2020-07-30 20:02:23
 * @LastEditors: queue
 * @LastEditTime: 2020-08-01 16:39:01
 */ 
import { Component } from 'preact';
import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_1907726_65bvv1771ws.js'
  ],
});
import style from '../index.scss';

class ReWrite extends Component {

  constructor(props) {
    super(props)
  }

  state = {
    show: false
  }

  render() {
    return (
      <span data-component="teaicon">
        <span className="m-icon">
          <span
            onMouseEnter={() => { this.setState({ show: true }) }}
            onMouseLeave={() => { this.setState({ show: false }) }}
          >
            <IconFont type="iconwrite" />
          </span>
          {
            this.state.show &&
            <span className="tip">
              重新编辑
        </span>
          }
        </span></span>
    )

  }
}

export default ReWrite;
