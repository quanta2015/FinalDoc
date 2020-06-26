import { Input, Select, Button, Switch, InputNumber, message } from 'antd';
const { Option } = Select;
const { TextArea } = Input;
import './index.css'
import BaseActions from '../../BaseActions';
import * as urls from '../../../constant/urls'
const { Search } = Input;
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';



//test data
var me = {
  uid: 1
}
var users = [
  {
    uid: 2017212212291,
    name: '李兆荣'
  }, {
    uid: 2017212212292,
    name: '施博彦'
  }, {
    uid: 2017212212293,
    name: '刘佳宇'
  }, {
    uid: 2017212212294,
    name: '马洋'
  }
];

class Publish extends BaseActions {
  state = {
    stuData: users,
    selectStu: false
  }

  constructor(props) {
    super(props)
  }

  async componentDidMount(){
    if(!!this.props.tid){
      let data = await this.get(urls.API_SYS_GET_FUUL_TOPIC_BY_ID,this.props.tid);
      //TODO
      this.name.value = data.name;
    }
  }

  clear = e => {
    this.name.value = "";
    this.note.setState({ value: "" })
    this.type.base.textContent = "";
  }

  handleSearchStu = async () => {
    let id = this.searchValue.state.value;
    if(!/^\d+$/.test(id)){
      message.error("请输入纯数字！");
      return;
    }
    this.setState({stuData:await this.get(urls.API_SYS_GET_STU_BY_LIKEID,{uid:id})})
    console.log(this.searchValue.state.value)
    console.log(this.stuId.base.textContent)
  }

  handleSwitchChange = () => {
    let s = !(this.state.selectStu);
    this.setState({ selectStu: s })
  }

  postInfo = async () => {
    let data;
    if(this.state.selectStu){
      let stuid = this.stuId.base.textContent;
      let addr = stuid.indexOf(' ');
      if(addr<0){
        message.error("请选择学生！")
        return;
      }else{
        stuid = stuid.substring(addr+1);
        data = {
          //TODO
          uid:me.uid,
          name:this.name.value,
          type:this.type.base.textContent,
          note:this.note.state.value,
          stuId:stuid
        };
      }
    }else{
      data={
        //TODO
        uid:me.uid,
        name:this.name.value,
        type:this.type.base.textContent,
        note:this.note.state.value,
        stuId:null
      }
    }
    await this.post(urls.API_SYS_POST_TOPIC_INFO,data);
    this.props.change();
  }

  render() {
    return (
      <div className="publish-block">
        
          <div className="input-line">
            <div className="input-left"><span>课</span><span>题</span><span>名</span><span>称</span></div>
            <div className="input-right">
              <input
                style={{ width: 500 }}
                ref={name => this.name = name}
                className="have-placehoder" type="text" placeholder="请输入课题名" />
            </div>
          </div>
          <div className="input-line">
            <div className="input-left"><span>项</span><span>目</span><span>类</span><span>别</span></div>
            <div className="input-right">
              <Select
                ref={type => this.type = type}
                className="have-placehoder"
                showSearch
                defaultValue="类别1"
                style={{ width: 500 }}
                placeholder="选择项目类别"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="类别1">类别1</Option>
                <Option value="类别2">类别2</Option>
                <Option value="类别3">类别3</Option>
                <Option value="类别4">类别4</Option>
              </Select>
            </div>
          </div>
          <div className="input-line">
            <div className="input-left"><span>简</span>介</div>
            <div className="input-right">
              <TextArea
                ref={note => this.note = note}
                style={{ width: 500 }} rows={4} placeholder="输入您的简介" className="have-placehoder" />
            </div>
          </div>


          <div className="input-line">
            <div className="input-left"><span>手</span><span>动</span><span>选</span><span>择</span><span>学</span><span>生</span></div>
            <div className="input-right">
              <Switch checkedChildren="开启" unCheckedChildren="关闭" onChange={this.handleSwitchChange} />
            </div>
          </div>

          {this.state.selectStu &&
            <>
            <div className="input-line">
              <div className="input-left"><span>搜</span><span>索</span><span>学</span><span>生</span></div>
              <div className="input-right">
                <Search
                  ref={search=>this.searchValue=search}
                  placeholder="按学号搜索学生"
                  onSearch={this.handleSearchStu}
                  style={{ width: 500 }}
                />
              </div>
            </div>
            <div className="input-line">
              <div className="input-left"><span>学</span><span>生</span><span>列</span><span>表</span></div>
              <div className="input-right">

                <Select
                  ref={stu => this.stuId = stu}
                  className="have-placehoder"
                  style={{ width: 500 }}
                  placeholder="查询结果"
                  optionFilterProp="children"
                >
                  {
                    this.state.stuData.map((x) => <Option value={x.uid}>{x.name} {x.uid}</Option>)
                  }
                </Select>
              </div>
            </div>
            </>
          }

          <div className="input-line">
            <div className="input-left"></div>
            <div className="input-left">
              <Button type="primary" onClick={this.postInfo}>提交</Button>
            </div>
            <div className="input-left">
              <Button onClick={this.clear}>清空</Button>
            </div>
          </div>

      </div>
    )
  }
}



export default Publish;