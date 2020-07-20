import { Collapse, Button, Table, message, Tag, Modal, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';

import style from './index.scss'
import BaseActions from '../../BaseActions';
const { Panel } = Collapse;
import * as urls from '../../../constant/urls'
import StuMethods from '../StuMethods2'
import DeleteSpan from '../../../icon/Icons/Delete'
import ReWrite from '../../../icon/Icons/ReWrite'
import Watch from '../../../icon/Icons/Watch'
import ReviewLine from '../Review';


@inject('userStore')
@observer
class Check extends BaseActions {

  constructor(props) {
    super(props);
  }

  @computed
  get usr() {
    return this.props.userStore.usr;
  }

  state = {
    cur: 0,
    more: true,
    nowTopic: this.props.toplist[0]
  }


  topHead = (top) => (
    <div className='tophead'>
      {/* <Button type="dashed" size="large" onClick={this.closeStuBlock}>返回</Button> */}
      <div className="tophead-name">{top}</div>
      {/* <span> </span> */}
    </div>
  )

  /**
   * 撤销课题
   * @param {string} id 课题id
   * @param {string} name 课题name
   */
  deleteTopic = async (id, name) => {
    let r = confirm(`您确定要撤销您的课题 ${id} : ${name} 么？`);
    if (!r) {
      return;
    }
    r = await this.post(urls.API_USR_DELETE_TOPIC_BY_ID, { id: id });
    if (r) {
      message.info("删除成功")
    } else {
      message.error("删除失败")
    }
    this.props.close();
  }

  getSugg = async (id) => {
    let data = await this.post(urls.API_TEACHER_GET_SUGG, { pid: id })
    let arr = data.data[0].sugg.split('\n');
    Modal.info({
      title: "意见信息",
      content: (
        <div>
          {
            arr.map((x) => {
              return <span>{x}<br /></span>
            })
          }
        </div>
      )
    })
  }

  StateExtra = (t) => (
    <div className="state-extra">
      <span className="state-line">
        <span className="state-left">课题状态：</span>
        <span state-right>{t.status == 3 && <Tag color="blue">审核已通过</Tag>}
          {t.status == 1 && <Tag color="orange">待审核</Tag>}
          {t.status == 100 && <Tag color="red">审核未通过</Tag>}
          {t.status == 5 && <Tag color="orange">学生已选定</Tag>}
        </span>
      </span>

      {
        t.status != 3 &&
        <span className="state-line">
          <span className="state-left">
            课题操作：
        </span>
          <span className="state-right">
            <div className="icons">
              {
                (t.status == 0 || t.status == 1 || t.status == 100) && <span onClick={() => { this.deleteTopic(t.id, t.name) }}><DeleteSpan /></span>
              }
              {
                (t.status == 0 || t.status == 1 || t.status == 100) && <span onClick={() => { this.props.change(t.id) }}><ReWrite /></span>
              }
              {
                (t.status == 100) && <span onClick={() => { this.getSugg(t.id) }}><Watch /></span>
              }
            </div>
          </span>
        </span>
      }


    </div>
  );

  switchTo = i => {
    this.setState({ cur: i })
    this.setState({ nowTopic: this.props.toplist[i] }, () => {
      this.setState({ more: true })
    })
  }

  closeStuBlock = () => {
    this.setState({ more: false })
  }



  render() {
    console.log(this.state.nowTopic);
    console.log(this.props.checkList);
    console.log(this.props.checkList.map((x) => x.id).indexOf(this.state.nowTopic.id));
    return (
      <div className="m-check-block-two" data-component="checkBlockTwo">
        <div className='check-title'>毕业设计管理</div>
        <div className="check-list">
          <nav className="left">
            {
              this.props.toplist.map((x, i) => {
                return (
                  <span
                    className={this.state.cur != i ? 'nav-a' : 'nav-a nav-a-active'}
                    onClick={() => { this.switchTo(i) }}
                  >
                    {x.id}
                  </span>
                )
              })
            }
          </nav>
          <nav className={!this.state.more ? 'right' : 'right hided'}>
            {this.props.toplist.map((x, i) => {
              return (
                <span
                  className={this.state.cur != i ? 'nav-n' : 'nav-n nav-n-active'}
                  onClick={() => { this.switchTo(i) }}
                >
                  {x.name}
                </span>
              )
            })
            }
          </nav>
          {
            this.state.more &&
            <div className='right'>
              {this.topHead(this.state.nowTopic.name)}
              {this.state.nowTopic.status == 4 &&
                <StuMethods
                  sid={this.state.nowTopic.sid}
                  tid={this.usr.uid}
                  pid={this.state.nowTopic.id}
                  freshList={this.props.freshList}
                  close={this.close}
                />
              }
              {
                this.state.nowTopic.status == 5 &&
                <div className="state-extra">
                  <ReviewLine
                    size={3}
                    list={this.props.checkList[this.props.checkList.map((x) => x.id).indexOf(this.state.nowTopic.id)]}
                    freshList={this.props.freshList} />
                </div>

              }
              {
                this.state.nowTopic.status < 4 &&
                <>
                  {this.StateExtra(this.state.nowTopic)}
                </>
              }
            </div>
          }

        </div>
      </div>
    );
  }
}

export default Check;