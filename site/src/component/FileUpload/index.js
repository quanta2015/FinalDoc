import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { Upload, Tooltip, message } from 'antd';
import { LoadingOutlined, PlusOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { FILE_UPLOAD_FORMAT } from '../../constant/data'
import { API_SYS_UPLOAD_FILE } from '../../constant/urls'
import './index.scss'

const isValidFormat = (formatList, fileFormat) => {
    if (formatList.indexOf(fileFormat) === -1) {
        message.error('请重新选择文件，支持的类型有 ' + formatList.join(','));
        return false;
    }
    return true;
}

@inject('userStore', 'studentStore')
@observer
class FileUpload extends Component {
    state = {
        loading: false,
        fileUrl: '',
        showDel: false
    };

    componentDidMount() {
        this.setState({
            fileUrl: this.props.tpInfo[this.props.type.type]
        })
    }

    componentDidUpdate(prevProps) {
        let fileUrl = this.props.tpInfo[this.props.type.type];
        //有课题信息 && 该文件已上传 && 传入值与state值不一 && 传入值有变化
        if (this.props.tpInfo.tid && fileUrl && fileUrl !== this.state.fileUrl && fileUrl !== prevProps.tpInfo[this.props.type.type]) {
            this.setState({
                fileUrl: fileUrl
            })
        }
    }

    handleChange = (info) => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            this.setState({
                loading: false,
                fileUrl: info.file.response.data
            })
            message.success(`成功上传文件《${info.file.name}》`)
        }
    }

    downloadFile = () => {
        let params = { file: this.state.fileUrl, id: this.props.tpInfo.sid, name: this.props.type.name };
        this.props.userStore.downloadFile(params)
        .then(r=>{
            if(!r){
                message.error('网络错误');
            }
        }) 

    }

    beforeUpload = (file) => {
        if (!file) {
            this.setState({ fileUrl: '' })
            return;
        }
        // 文件格式约束
        let tag = true;
        let fileFormat = file.name.slice(file.name.indexOf('.') + 1);
        if (this.props.type.name === '答辩材料') {
            tag = isValidFormat(FILE_UPLOAD_FORMAT.reply, fileFormat);
        } else {
            // todo: 判断是否答辩阶段已结束 结束 清除非pdf文件 上传pdf
            tag = isValidFormat(FILE_UPLOAD_FORMAT.doc, fileFormat);
        }
        // 文件大小约束
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('请重新选择文件，文件不得大于10M');
        }

        return tag && isLt10M;
    }

    handleHover = () => {
        if (this.state.fileUrl) {
            this.setState({
                showDel: true
            })
        }
    }

    handleMouseOut = () => {
        if (this.state.fileUrl) {
            this.setState({
                showDel: false
            })
        }
    }

    handleDel = () => {
        let params = { type: this.props.type.type, tid: this.props.tpInfo.tid, sid: this.props.tpInfo.sid };
        this.props.studentStore.deleteFile(params)
            .then(r => {
                if (r.code === 200) {
                    this.props.studentStore.getSelectTopic({ uid: this.props.tpInfo.sid });
                    this.setState({
                        fileUrl: "",
                        showDel: false,
                        loading: false
                    })
                } else {
                    message.error('网络错误');
                }
            })
    }

    render() {
        // example: {name: "文献综述", type: "f_docs"}
        const fileType = this.props.type;
        // example: {sid: '123', tid: '456', f_docs: './upload/test.doc'}
        const tpInfo = this.props.tpInfo;
        const { fileUrl, showDel, loading } = this.state;
        const text = "点击下载已提交文件";
        const uploadButton = (
            <div>
                {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
                < div className="ant-upload-text" >上传</div>
            </div>
        )
        return (
            <div className="g-upload">
                <div
                    className={fileUrl ? "m-filewp z-submit-wp" : "m-filewp"}
                    onMouseOver={this.handleHover}
                    onMouseLeave={this.handleMouseOut}
                >
                    {showDel && !loading && <CloseOutlined className="u-del" onClick={this.handleDel} />}
                    <Upload
                        name="file"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action={API_SYS_UPLOAD_FILE}
                        data={() => { return { type: fileType.type, tid: tpInfo.tid, sid: tpInfo.sid } }}
                        beforeUpload={this.beforeUpload}
                        onChange={this.handleChange}
                    >
                        {(fileUrl && !loading) ? <CheckOutlined className="z-success"/> : uploadButton}
                    </Upload>
                </div>
                {   fileUrl ?
                    <Tooltip placement="bottom" title={text}>
                        <p className="z-submit-p" onClick={this.downloadFile}>{fileType.name}</p>
                    </Tooltip> :
                    <p>{fileType.name}</p>
                }
            </div>
        )
    }
}

export default FileUpload