import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { route } from 'preact-router';
import { computed, toJS } from 'mobx';
import "./style.scss"

@inject('userStore', 'studentStore')
@observer
export default class Student extends Component {
  state = {
    topNoticeList: [{
      title: '2021届毕业设计（论文）时间安排和具体工作要求aaaa',
      date: '2020-07-14',
      id: 1
    }, {
        title: '2021届毕业设计（论文）时间安排和具体工作要求',
        date: '2020-07-14',
        id: 2
    }],
    noticeList: [{
      title: '2021届毕业设计（论文）时间安排和具体工作要求',
      date: '2020-07-14',
      id: 3
    }, {
      title: '2021届毕业设计（论文）时间安排和具体工作要求',
      date: '2020-07-14',
      id: 4
    }, {
      title: '2021届毕业设计（论文）时间安排和具体工作要求',
      date: '2020-07-14',
      id: 5
    }],
    applyList:[{
      name: '开题答辩',
      date: '2020-12-10',
      time: '18:30',
      week: '星期一',
      location: '勤园6-101',
      number: 16 
    }, {
        name: '论文一辩',
        date: '2020-12-10',
        time: '18:30',
        week: '星期一',
        location: '勤园6-101',
        number: 16
      }]
  }

  @computed
  get usr() {
    return toJS(this.props.userStore.usr);
  }

  @computed
  get docTemplate() {
    return this.props.studentStore.docTemplate;
  }

  componentDidMount() {
    if (!this.usr.uid) {
      route('/');
    }
  }

  downloadFile = (item) => {
    let params = { file: item.link, id: '', name: item.title };
    this.props.userStore.downloadFile(params)
      .then(r => {
        if (!r) {
          message.error('网络错误');
        }
      })
  }

  render() {
    const { topNoticeList, noticeList, applyList } = this.state;
    return (
      <div className="g-s">
        <div className="m-notice">
          <div className="m-banner">
            <span className="u-title">通知公告</span>
            <ul className="m-top-list">
              {topNoticeList.map(item =>
                <li>
                  <div className="m-top-item">
                    <span className="u-top-title" title={item.title}>{item.title}</span>
                    <span className="u-top-date">{item.date}</span>
                  </div>
                </li>
              )}
            </ul>
          </div>
          <div className="m-not-wp">
            <ul className="m-not-list">
              {noticeList.map(item =>
                <li>
                  <div className="m-not-item">
                    <span className="u-not-date">{item.date}</span>
                    <span className="u-not-title" title={item.title}>{item.title}</span>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="m-other">
          <div className="m-card">
            <span className="u-title">答辩信息</span>
                {
                  applyList.map((item, i) => 
                    <div className="m-apply">
                      <div className="m-date">
                        <div className="u-ymd">
                          <div className="u-d">{item.date.slice(item.date.lastIndexOf('-') + 1)}</div>
                          <div className="u-ym">{item.date.slice(0, item.date.lastIndexOf('-'))}</div>
                        </div>
                        <div className="u-week">{item.week}</div>
                      </div>
                      <div className="m-detail">
                        <div className="u-name">{item.name}</div>
                        <p>时间：{item.date} {item.time}</p>
                        <p>地点：{item.location}</p>
                        <p>序号：{item.number}</p>
                      </div>
                    </div>  
                  )
                }
          </div>
          <div className="m-card">
            <span className="u-title">模板文件</span>
              {this.docTemplate.map((item, i) => 
                <div className="m-tmp-wp">
                  <div className="u-tmp-title"><span>0{i + 1}</span> / {item.name}</div>
                  <div className="m-tmplate">
                    {item.file && item.file.map(item =>
                      <span className="u-file" onClick={() => this.downloadFile(item)}>{item.title}</span>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    );
  }
}
