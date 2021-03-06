import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { Modal, Button, message, Empty, Skeleton } from 'antd';
import { route } from 'preact-router';
import { computed, toJS } from 'mobx';
import Announcement from '../../component/Announcement';
import Message from '../../component/Message'
import "./style.scss"

const pageSize = 5;

@inject('userStore', 'studentStore')
@observer
export default class Student extends Component {
  state = {
    startRow: 0,
    endRow: pageSize - 1,
    currentPage: 1,
    total: 1,
    visible: false,
    selectItem: null,
    loadingReply: true,
    loadingTemplate: true
  }

  @computed
  get usr() {
    return toJS(this.props.userStore.usr);
  }

  @computed
  get docTemplate() {
    return toJS(this.props.studentStore.docTemplate);
  }

  @computed
  get replyList() {
    return toJS(this.props.studentStore.replyList);
  }

  //判断该组件是否已挂载 需要更新 state
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    if (!this.usr.uid) {
      route('/');
    }
    // 切换导航
    if (this.docTemplate.length && this.docTemplate.length && this._isMounted) {
      this.setState({
        loadingReply: false,
        loadingTemplate: false
      })
    }
    // 首次打开页面
    if (!this.docTemplate.length) {
      this.props.studentStore.getTempFileList()
      .then(r => {
        if (r && this._isMounted) {
          this.setState({
            loadingTemplate: false
          })
        }
      })
    }
    if (!this.replyList.length) {
      this.props.studentStore.getReplyInfo({ uid: this.usr.uid })
      .then(r => {
        if (r && this._isMounted) {
          this.setState({
            loadingReply: false
          })
        }
      })
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  downloadFile = (item) => {
    let params = { file: item.f_path, id: '毕业设计', name: item.f_name };
    this.props.userStore.downloadFile(params)
      .then(r => {
        if (!r) {
          message.error('网络错误');
        }
      })
  }

  render() {
    const { selectItem, loadingReply, loadingTemplate } = this.state;
    const FILE_STAGE = ['开题中期', '论文定稿', '论文答辩'];
    // 答辩场次
    const GTD_ROUND = { 10: '开题答辩', 11: '开题延缓', 20: '最终一辩', 21: '一辩延缓', 30: '最终二辩' }
    return (
      <div className="g-s">
        <Message />
        <Announcement />
        <div className="m-other">
          <div className="m-card">
            <span className="u-title">答辩信息</span>
            <Skeleton loading={loadingReply} active avatar={{ size: 80, shape: 'square' }} title={false} paragraph={{rows: 3}}>
              {
                !!this.replyList.length && this.replyList[0].time ?
                this.replyList.map((item, i) =>
                  <div className="m-apply">
                    <div className="m-date">
                      <div className="u-ymd">
                        <div className="u-d">{item.time.slice(0, 10).slice(item.time.slice(0, 10).lastIndexOf('-') + 1)}</div>
                        <div className="u-ym">{item.time.slice(0, 10).slice(0, item.time.slice(0, 10).lastIndexOf('-'))}</div>
                      </div>
                      <div className="u-week">{item.week}</div>
                    </div>
                    <div className="m-detail">
                      <div className="u-name">{GTD_ROUND[item.gtd_round]}</div>
                      {item.time && <p>时间：{item.time}</p>}
                      <p>地点：{item.gtd_cls}</p>
                      <p>序号：{item.order}</p>
                    </div>
                  </div>
                ):
                <Empty
                  className="z-empty"
                  description={<span>暂未发布</span>}
                />
              }
            </Skeleton>
          </div>
          <div className="m-card">
            <span className="u-title">模板文件</span>
            <Skeleton loading={loadingTemplate} active title={false} paragraph={{rows: 3}}>
              {!!this.docTemplate.length && this.docTemplate.map((item, i) =>
                <div className="m-tmp-wp">
                  <div className="u-tmp-title"><span>0{i + 1}</span> / {FILE_STAGE[i]}</div>
                  <div className="m-tmplate">
                    {item.map(file =>
                      <span className="u-file" onClick={() => this.downloadFile(file)}>{file.f_name}</span>
                    )}
                  </div>
                </div>
              )}
            </Skeleton>
          </div>
        </div>
        {selectItem &&
          <Modal
            className="g-dialog"
            title={null}
            visible={this.state.visible}
            closable={false}
            onCancel={this.handleCancel}
            width={700}
            footer={
              [
                selectItem.check_flag ?
                  <Button onClick={this.handleCancel}>关闭</Button> :
                  <Button onClick={this.handleOk} type="primary">已读</Button>
              ]}
          >
            <div className="u-title">{selectItem.ann_title}</div>
            <div className="u-time">{selectItem.time}</div>
            <p>{selectItem.ann_content}</p>
          </Modal>
        }
      </div>
    );
  }
}
