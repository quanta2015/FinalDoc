import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { Upload, Tooltip, message } from 'antd';
import { LoadingOutlined, PlusOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { FILE_UPLOAD_FORMAT } from '../../constant/data'
import { API_SYS_UPLOAD_FILE } from '../../constant/urls'
import './index.css'

const isValidFormat = (formatList, fileFormat) => {
    if (formatList.indexOf(fileFormat) === -1) {
        message.error('请重新选择文件，支持的类型有 ' + formatList.join(','));
        return false;
    }
    return true;
}

@inject('userStore')
@observer
class FileUpload extends Component {
    state = {
        loading: false,
        fileUrl: '',
        showDel: false
    };

    componentDidUpdate(prevProps) {
        let fileUrl = this.props.tpInfo[this.props.type.type];
        if (this.props.tpInfo.id && fileUrl && fileUrl !== this.state.fileUrl) {
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
                fileUrl: info.file.response.data.path
            })
            message.success(`成功上传文件《${info.file.name}》`)
        }
    }

    downloadFile = () => {
        // this.props.userStore.downloadFile({ file: this.state.fileUrl })
        // .then(r=>{
        //     console.log(r)
        // })
    }

    beforeUpload = (file) => {
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
        if(!isLt10M) {
            message.error('请重新选择文件，文件不得大于10M');
        }
        return tag && isLt10M;
    }

    handleHover = () => {
        if(this.state.fileUrl) {
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
        //todo: 后端接口 清空对应字段
        this.setState({
            fileUrl: '',
            showDel: false
        })
    }

    render() {
        // example: {name: "文献综述", type: "f_docs"}
        const fileType = this.props.type;
        const tpInfo = this.props.tpInfo;
        const { fileUrl, showDel } = this.state;
        const text = "点击下载已提交文件";
        const link = 'https://youth.hznu.edu.cn/upload/resources/file/2020/06/24/7589612.doc'
        const uploadButton = (
            <div>
                { this.state.loading ? <LoadingOutlined /> : <PlusOutlined /> }
                < div className = "ant-upload-text" > 上传</div>
            </div>
        )
        return (
            <div className="g-file">
                <div className={fileUrl ? "m-bdwrapper submitted-wp" : "m-bdwrapper"} onMouseOver={this.handleHover} onMouseLeave={this.handleMouseOut}>
                    {showDel && <CloseOutlined className="m-del" onClick={this.handleDel}/>}
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action={API_SYS_UPLOAD_FILE}
                        data={() => { return { type: fileType.type, tid: tpInfo.tid, sid: tpInfo.sid}}}
                        beforeUpload={this.beforeUpload}
                        onChange={this.handleChange}
                    >
                        {fileUrl ? <CheckOutlined className="m-smile"/> : uploadButton}
                    </Upload>
                </div>
                {   fileUrl ?
                    <Tooltip placement="bottom" title={text}>
                        <p className="submitted-p" onClick={this.downloadFile}>{fileType.name}</p>
                    </Tooltip>:
                    <p>{fileType.name}</p>
                }
            </div>
        )
    }
}

export default FileUpload
