import { Component } from 'preact';
import { 
    EditOutlined,
    DeleteOutlined,
    FileSearchOutlined
} from '@ant-design/icons';

import style from './index.css'

class TopicTable extends Component { 

    render(){
        return(
            <table>
                {console.log(this.props.topicList)}
                <thead>
                    <tr>
                        <th>课题标题</th>
                        <th>课题状态</th>
                        <th>功能</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.topicList.map((topic) => 
                        <tr>
                            <td style="width: 300px">{topic.name}</td>
                            <td style="width: 300px" class={"td"+topic.status}>{this.renderStatusName(topic.status)}</td>
                            {this.renderActions(topic.status)}
                        </tr>
                    )}
                </tbody>
            </table>
        )
    }

    renderStatusName(status){
        switch (status){
            case 0:
                return "待分配";
                break;
            case 1:
                return "待审核";
                break;
            case 2:
                return "未通过";
                break;
            case 3:
                return "已通过";
                break;
        }
    }

    renderActions(status){
        switch (status){
            case 0:
                return <td><DeleteOutlined /></td>;
                break;
            case 1:
                return <td><DeleteOutlined /></td>;
                break;
            case 2:
                return <td><EditOutlined /> <DeleteOutlined /> <FileSearchOutlined /></td>;
                break;
            case 3:
                return <td></td>;
                break;
        }
    }
}
export default TopicTable