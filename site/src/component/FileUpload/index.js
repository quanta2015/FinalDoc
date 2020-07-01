import { Component } from 'preact';
import { Upload, Tooltip } from 'antd';
import { LoadingOutlined, PlusOutlined, SmileOutlined, CloseOutlined } from '@ant-design/icons';
import './index.css'

class FileUpload extends Component {
    state = {
        loading: false,
        imageUrl: '',
        showDel: false
    };

    componentDidMount() {
        if(this.props.type.name === "开题报告") {
            this.setState({
                imageUrl: 'test'
            })
        }
    }

    handleHover = () => {
        if(this.state.imageUrl) {
            this.setState({
                showDel: true
            })
        }
    }

    handleMouseOut = () => {
        if (this.state.imageUrl) {
            this.setState({
                showDel: false
            })
        }
    }

    handleDel = () => {
        this.setState({
            imageUrl: '',
            showDel: false
        })
    }

    render() {
        // {name: "文献综述", type: "f_docs"}
        const fileType = this.props.type;
        const { imageUrl, showDel } = this.state;
        const text = "点击下载已提交文件";
        const link = 'https://youth.hznu.edu.cn/upload/resources/file/2020/06/24/7589612.doc';
        const uploadButton = (
            <div>
                { this.state.loading ? <LoadingOutlined /> : <PlusOutlined /> }
                < div className = "ant-upload-text" > 上传</div>
            </div>
        )

        return (
            <div className="g-file">
                <div className={imageUrl ? "m-bdwrapper submitted-wp" : "m-bdwrapper"} onMouseOver={this.handleHover} onMouseLeave={this.handleMouseOut}>
                    {showDel && <CloseOutlined className="m-del" onClick={this.handleDel}/>}
                    <Upload
                        name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    >
                        {imageUrl ? <SmileOutlined className="m-smile"/> : uploadButton}
                    </Upload>
                </div>
                {   imageUrl ?
                    <Tooltip placement="bottomLeft" title={text}>
                        <a href={link} download className="submitted-p">开题报告</a>
                    </Tooltip>:
                    <p>{fileType.name}</p>
                }
            </div>
        )
    }
}

export default FileUpload
