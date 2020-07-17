import { Collapse, Button, Table, message, Tag, Modal, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';
import { CheckCircleOutlined } from '@ant-design/icons';

import style from './index.scss'
import BaseActions from '../../BaseActions';
const { Panel } = Collapse;
import * as urls from '../../../constant/urls'
import StuMethods from '../StuMethods'
import DeleteSpan from '../../../icon/Icons/Delete'
import ReWrite from '../../../icon/Icons/ReWrite'
import Watch from '../../../icon/Icons/Watch'
import ReviewLine from '../Review';
import TaskList from '../TaskForm'


const PanelHeader = (name, id, sid, status) => (
  <span>
    <span className="check-short-pid">

      {
        !!sid &&
        <Tooltip title="已绑定学生">
          {id}<CheckCircleOutlined className='float-icon' />
        </Tooltip>
      }
      {
        !sid && <>{id}</>
      }

    </span>
    <span className="check-default-pname">
      {name}
    </span>
  </span>
)

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
    judgeTopic: true,
  }

  async componentDidMount() {
    let x = await this.post(urls.API_TEACHER_CAN_PUBLISH, { tid: this.usr.uid })
    if (x.r[0].flag > 1) {
      this.setState({ judgeTopic: false })
    }
  }

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
      {t.status == 3 && <Tag color="blue">审核已通过</Tag>}
      {t.status == 1 && <Tag color="orange">待审核</Tag>}
      {t.status == 100 && <Tag color="red">审核未通过</Tag>}
      {t.status == 0 && <Tag color="orange">待分配</Tag>}
      {t.status == 4 && <Tag color="green">双选成功</Tag>}
      {t.status == 5 && <Tag color="orange">学生已选定</Tag>}
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
    </div>
  );

  render() {
    return (
      <div className="check-block" data-component="checkBlock">
        <div className="title">
          <h1>毕业设计管理</h1>
          <span>
            {
              this.props.pbChanged &&
              <Button type="dashed" onClick={() => { this.props.justOpenDrawer() }}>继续编辑</Button>
            }
            {this.props.toplist.length < 8 && this.state.judgeTopic &&
              <Button type="dashed" onClick={() => { this.props.change(null) }}>发布新课题</Button>
            }
            <Button type="default" onClick={() => { this.props.showAllTopic() }}>查看全部课题</Button>
          </span>
        </div>
        {this.props.toplist.length == 0 && <span>您还没有课题！</span>}
        <ul className="check-ul">
          {
            this.props.toplist.map(
              (t) =>
                <li>
                  <div className="stu">
                    <div className="stu-header">
                      {PanelHeader(t.name, t.id, t.sid, t.status)}
                      {this.StateExtra(t)}
                    </div>

                    {(t.status == 4 || t.status == 5) &&
                      <div className="stu-body">
                        {t.sid != null &&
                          <StuMethods sid={t.sid} tid={this.usr.uid} pid={t.id} freshList={this.props.freshList} />
                        }
                        {
                          t.sid == null && this.props.checkList.map((x) => { return x.id }).indexOf(t.id) >= 0 &&
                          <ReviewLine list={this.props.checkList[this.props.checkList.map((x) => x.id).indexOf(t.id)]} freshList={this.props.freshList} />
                        }
                      </div>
                    }
                  </div>
                </li>
            )
          }
        </ul>
      </div>
    );
  }
}

export default Check;