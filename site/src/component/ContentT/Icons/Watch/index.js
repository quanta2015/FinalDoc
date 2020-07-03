import { Component } from 'preact';
import { createFromIconfontCN } from '@ant-design/icons';

const IconFont = createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_1907726_g4uqtocpzea.js'
  ],
});
import style from '../index.css';

class Watch extends Component{

  constructor(props){
    super(props)
  }

  state={
    show:false
  }

  render(){
    return(
    <span className="m-icon">
      <span
        onMouseEnter={()=>{this.setState({show:true})}} 
        onMouseLeave={()=>{this.setState({show:false})}}
      >
        <IconFont type="iconchakan"/>
      </span>
      {
        this.state.show&&
        <span className="tip">
          查看意见
        </span>
      }
    </span>
    )
    
  }
}

export default Watch;
