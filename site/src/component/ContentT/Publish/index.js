import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { Input, Select, Button, Switch, InputNumber, message,Tag } from 'antd';
const { Option } = Select;
const { TextArea } = Input;
import './index.scss'
import BaseActions from '../../BaseActions';
import * as urls from '../../../constant/urls'
const { Search } = Input;

function tagRender(props) {
  const { label, value, closable, onClose } = props;
  return (
    <Tag color={!!label?label[1].props.children:"blue"} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
      {label}
    </Tag>
  );
}

@inject('userStore','teacherStore')
@observer
class Publish extends BaseActions {

  cleared=true;

  state = {
    stuData: [],
    selectStu: false,
    type:'',
    selected_stu_data:null,
    area:[],
    areaList:[],
    typeList:[]
  }

  constructor(props) {
    super(props)
  } 

  @computed
  get usr() {
      return this.props.userStore.usr;
  }

  @computed
  get me() {
      return this.props.userStore;
  }

  setBlocks= async ()=>{
    if(!this.cleared){
      let r = confirm("您上次编辑的记录还未提交，是否覆盖/清空？")
      if(!r)return;
      this.cleared = true;
      this.props.needGoon(false);
    }
    if(!!this.props.tid){
      //let data = await this.me.getTopicFullInfo(this.props.pid);
      let data = await this.post(urls.API_SYS_GET_FUUL_TOPIC_BY_ID,{pid:this.props.tid});
      data = data.data[0];
      this.name.setState({value : data.topic});
      this.setState({type:data.type,area:data.area})
      this.note.setState({value:data.note})    
      if((data.sid==null||data.sid=="null")&&this.state.selectStu){this.switch.click();}
      if(data.sid!=null&&data.sid!="null"){
        if(!this.state.selectStu){
          this.switch.click();
        }
        this.setState({stuData:[{uid:data.sid,name:data.name}],selected_stu_data:data.sid})
      }
    }else{
      this.clear();
    }
    this.name.focus();
  }

  async componentDidMount(){  
    let areaData = await this.post(urls.API_SYS_GET_TEACHER_AREA_LIST,{tid:this.usr.uid});
    this.setState({areaList:areaData.data})
    let typeData = await this.get(urls.API_SYS_GET_ALL_TYPE);
    typeData = typeData.data.map((x)=>x.name)
    this.setState({typeList:typeData,type:typeData[0]})
    this.name.focus();
  }

  clear = e => {
    this.name.setState({value : ""});
    this.note.setState({ value: "" })
    this.setState({
      selected_stu_data:null,
      type:'工程设计',
      area:this.state.areaList.map((x)=>x.id)
    })
    this.cleared = true;
    this.props.needGoon(false);
  }

  handleSearchStu = async (e) => {
    this.setState({
      selected_stu_data:e
    },async ()=>{
      let id = this.state.selected_stu_data;
      if(!/^\d+$/.test(id)){
        message.error("请输入纯数字！");
        return;
      }
      let data = await this.post(urls.API_SYS_GET_STU_BY_LIKEID, {num:id});
      this.setState({stuData:data.data})
    }
    );
  }

  handleSwitchChange = () => {
    let s = !(this.state.selectStu);
    this.setState({ selectStu: s })
  }

  handleStuChange = (e)=>{
    this.setState({
      selected_stu_data:e
    })
  }

  handleTypeChange=(e)=>{
    this.setState({
      type:e
    })
  }

  handleAreaChange=(e)=>{
    this.setState({
      area:e
    })
  }

  postInfo = async () => {
    let data;
    console.log(this.name);
    
    if(this.state.area.length==0){
      alert("请选择研究方向！")
      return;
    }
    if(this.name.state.value.trim()==""){
      alert("请输入课题名！")
      return;
    }
    if(this.note.state.value.trim()==""){
      alert("请输入简介！")
      return;
    }
    if(this.state.selectStu){
      let addr = this.state.selected_stu_data;
      if(addr<13){
        message.error("请选择学生！")
        return;
      }else{
        data = {
          //TODO
          tea_id:this.usr.uid,
          name:this.name.state.value,
          type:this.type.base.textContent,
          note:this.note.state.value,
          stuId:this.state.selected_stu_data,
          topic_id:this.props.tid==null?"":this.props.tid,
          area:this.state.area===undefined?[]:this.state.area
        };
      }
    }else{
      data={
        tea_id:this.usr.uid,
        name:this.name.state.value,
        type:this.state.type,
        note:this.note.state.value,
        stuId:null,
        topic_id:this.props.tid==null?"":this.props.tid,
        area:this.state.area===undefined?[]:this.state.area
      }
    }
    await this.post(urls.API_SYS_POST_TOPIC_INFO, data);;
    this.props.close();
    this.cleared = true;
      this.props.needGoon(false);
  }

  render() {
    return (
      <div className="publish-block"  onChange={()=>{this.cleared=false;this.props.needGoon(true)}} data-component="publish">
          <div className="input-line">
            <div className="input-left">课题名称</div>
            <div className="input-right">
              <Input
                style={{ width: 600 }}
                size="large"
                ref={name => this.name = name}
                className="have-placehoder"  placeholder="请输入课题名" />
            </div>
          </div>
          <div className="input-line">
            <div className="input-left">项目类别</div>
            <div className="input-right">
              <Select
                size="large"
                ref={type => this.type = type}
                className="have-placehoder"
                value={this.state.type}
                showSearch
                onChange={this.handleTypeChange}
                defaultValue={"工程设计"}
                style={{ width: 600,height:40 }}
                placeholder="选择项目类别"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {
                  this.state.typeList.map((x)=><Option value={x}>{x}</Option>)
                }
              </Select>
            </div>
          </div>
          <div className="input-line">
            <div className="input-left">研究方向</div>
            <div className="input-right">
              <Select
                size="large"
                ref={area => this.area = area}
                className="have-placehoder"
                value={this.state.area}
                showSearch
                tagRender={tagRender}
                mode="multiple"
                onChange={this.handleAreaChange}
                style={{ width: 600 }}
                placeholder="选择研究方向"
                optionFilterProp="children"
                filterOption={(input, option) =>  
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.state.areaList.map((x)=><Option value={x.id}>{x.area}<span style="display:none">{x.color}</span></Option>
                )}
              </Select>
            </div>
          </div>
          <div className="input-line">
            <div className="input-left">简介</div>
            <div className="input-right">
              <TextArea
                
                ref={note => this.note = note}
                style={{ width: 600 }} rows={11} placeholder="输入您的简介" className="have-placehoder" />
            </div>
          </div>

          <div className="input-line-row">
            <div className="input-right">
              <Switch 
              ref={e=>this.switch=e}
              checkedChildren="手动选择学生" 
              unCheckedChildren="暂不选择学生" 
              onChange={this.handleSwitchChange} />
            </div>
          </div>

          {this.state.selectStu &&
            <>
            <div className="input-line">
              <div className="input-left">选择学生</div>
              <div className="input-right">

                <Select
                size="large"
                  ref={stu => this.stuId = stu}
                  value={this.state.selected_stu_data}
                  className="have-placehoder"
                  style={{ width: 600 }}
                  placeholder="按学号搜索学生"
                  optionFilterProp="children"
                  onChange={this.handleStuChange}
                  showSearch
                  onSearch={this.handleSearchStu}
                >
                  {
                    this.state.stuData.map((x) => <Option value={x.uid}>{x.name} {x.uid}</Option>)
                  }
                </Select>
              </div>
            </div>
            </>
          }

          <div className="input-line-row">
            <div className="input-button">
              <Button type="primary" onClick={this.postInfo}>提交</Button>
            </div>
            <div className="input-button">
              <Button onClick={this.clear}>清空</Button>
            </div>
          </div>

      </div>
    )
  }
}



export default Publish;