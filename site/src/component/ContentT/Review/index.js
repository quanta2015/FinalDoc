import './index.scss'
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import BaseActions from '../../BaseActions';
import * as urls from '../../../constant/urls'
import { Table, Tag, Space, Tooltip, Button } from 'antd';
import { StarOutlined, CloseOutlined, CheckOutlined, UserOutlined } from '@ant-design/icons';

@inject('userStore')
@observer
export default class Review extends BaseActions {

  constructor(props) {
    super(props)
  }

  @computed
  get usr() {
    return this.props.userStore.usr;
  }

  /**
   * 通过学生申请
   * @param {string} id 学生id
   * @param {string} name 学生name
   * @param {string} tid 课题id
   */
  pass = async (id, name, tid) => {
    let r = confirm(`您确定要通过 ${name} 的申请么？`)
    if (!r) return;
    let data = { sid: id, topic_id: tid, val: 1 }
    r = await this.post(urls.API_SYS_TEACHER_REVIEW_STUDENT, data);
    this.props.userStore.insertMessageToOne({from:this.usr.id,to:id,context:"教师已通过申请"})
    this.props.freshList();
  }

  /**
   * 拒绝学生申请
   * @param {string} id 学生id
   * @param {string} name 学生name
   * @param {string} tid 课题id
   */
  refuse = async (id, name, tid) => {
    let r = confirm(`您确定要拒绝 ${name} 的申请么？`)
    if (!r) return;
    r = await this.post(urls.API_SYS_TEACHER_REVIEW_STUDENT, { sid: id, topic_id: tid, val: 0 });
    this.props.userStore.insertMessageToOne({from:this.usr.id,to:id,context:"教师已拒绝申请"})
    this.props.freshList();
  }


  render() {
    return (
      <div data-component="review">
        <div className={!this.props.size?'review-line':"review-block"}>
          <span>
            <span className="m-short">申请学生:</span>
            <span className="m-short">学号： {this.props.list.sid}</span>
            <span className="m-short">姓名： {this.props.list.name}</span>
          </span>

          <div className="btns">
            <Button className="ml-long" onClick={() => { this.pass(this.props.list.sid, this.props.list.name, this.props.list.id) }}>通过</Button>
            <Button className="ml-long" onClick={() => { this.refuse(this.props.list.sid, this.props.list.name, this.props.list.id) }}>拒绝</Button>
          </div>
        </div>
      </div>
    )
  }

}