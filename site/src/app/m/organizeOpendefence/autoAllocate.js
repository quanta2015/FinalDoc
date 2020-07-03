import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed } from 'mobx';


import { InputNumber, Select, Button, message, Form} from 'antd';

@inject('manageStore')
@observer
export default class AutoAllocate extends Component {
  
    render() {
        return (
            <div className="main"> 
             
                    每位<InputNumber size="small"   style={{ width: 50 }} min={1} />篇&nbsp;&nbsp;
                     
                 
                

            </div>
        );
    }
}

