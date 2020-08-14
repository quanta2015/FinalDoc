import './index.scss'
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import BaseActions from '../../BaseActions';
import * as urls from '../../../constant/urls'
import { Button } from 'antd';
@inject('userStore')
@observer
export default class Delay extends BaseActions {

  constructor(props) {
    super(props)
  }

  @computed
  get usr() {
    return this.props.userStore.usr;
  }

  /**
   * 通过学生申请
   * @param {string} name 学生name
   * @param {string} tid 课题id
   */
  pass = async (id, name, pid , type) => {
    let r = confirm(`您确定要通过 ${name} 的延迟申请么？`)
    if (!r) return;
    let data = { pid, type }
    r = await this.post(urls.API_TEACHER_PASS_DE, data);
    this.props.userStore.insertMessageToOne({from:this.usr.id,to:id,context:"教师已通过延迟答辩"})
    this.props.freshList();
  }

  /**
   * 拒绝学生申请
   * @param {string} id 学生id
   * @param {string} name 学生name
   * @param {string} tid 课题id
   */
  refuse = async (id, name, pid ,type) => {
    let r = confirm(`您确定要拒绝 ${name} 的延迟申请么？`)
    if (!r) return;
    let data = {pid:pid,type:type}
    r = await this.post(urls.API_TEACHER_RUFUSE_DE, data);
    this.props.userStore.insertMessageToOne({from:this.usr.id,to:id,context:"教师已拒绝延迟答辩"})
    this.props.freshList();
  }

  render() {
    return (
      <div data-component="delay">
        {this.props.deInfo&&
        <div className='delay-block'>
        <div className="de-title">
          您的学生{this.props.stu.name}申请延迟 {this.props.deInfo.type==1?'开题答辩':'论文答辩'}。
        </div>

        <div className="de-content">
          申请理由： {this.props.deInfo.reason}
        </div>

        <div className="de-btns">
          <Button type="primary" className="ml-long" 
          onClick={() => { this.pass(this.props.stu.sid, this.props.stu.name, this.props.stu.id,this.props.deInfo.type) }}>
            通过
          </Button>
          <Button className="ml-long" 
          onClick={() => { this.refuse(this.props.stu.sid, this.props.stu.name, this.props.stu.id,this.props.deInfo.type) }}>
            拒绝
          </Button>
        </div>
      </div>
        }
        
      </div>
    )
  }

}