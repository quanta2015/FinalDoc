/*
 * @Description: 
 * @version: 
 * @Author: queue
 * @Date: 2020-08-01 16:29:48
 * @LastEditors: queue
 * @LastEditTime: 2020-08-01 16:41:11
 */ 
import { Component } from 'preact';
import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_1907726_65bvv1771ws.js'
  ],
});
import style from '../index.scss';

class DeleteSpan extends Component {

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
            <IconFont type="iconiconset0127" />
          </span>
          {
            this.state.show &&
            <span className="tip">
              解绑该学生
        </span>
          }
        </span></span>
    )

  }
}

export default DeleteSpan;
