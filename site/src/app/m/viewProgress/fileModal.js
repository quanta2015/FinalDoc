import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import { Table, Space, Popconfirm, Modal, Button, Tooltip, Input, message, Tag } from 'antd';
import { SearchOutlined,DownloadOutlined  } from '@ant-design/icons';
import { FILE_UPLOAD_TYPE } from '../../../constant/data'
import "./fileModal.css"

@inject('manageStore', 'userStore')
@observer
export default class FileModal extends Component {
	state = {

	}

	// @computed
	// get stu_list() {
	// 	return this.props.manageStore.stu_list;
	// }

	// @computed
	// get usr() {
	// 	return this.props.userStore.usr;
	// }

	// async componentDidMount() {
	// 	await this.props.manageStore.viewProgress({ "ide": this.usr.uid });
    // }
    
    // downloadFile = () => {
    //     let params = { file: this.state.fileUrl, id: this.props.tpInfo.sid, name: this.props.type.name };
    //     this.props.userStore.downloadFile(params)
    //     .then(r=>{
    //         if(!r){
    //             message.error('网络错误');
    //         }
    //     }) 
    // }

	render() {
		return (
			<div className="filemodal">
                {FILE_UPLOAD_TYPE.map((item) =>
                    <div className="">
                        <h3 className="">{item.stage}</h3>
                        <div>
                            {item.file.map((item) =>
                                <Button type="primary" icon={<DownloadOutlined />} size="small">
                                    {item.name}
                                    {this.props.record}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
			</div>
		);
	}
}
