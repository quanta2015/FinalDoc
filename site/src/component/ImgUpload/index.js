import React, { Component } from 'react';
import ImgCrop from 'antd-img-crop';
import {API_SYS_UPLOAD_SIGN,API_SYS_GET_SIGN_STATE} from '../../constant/urls'
import BaseActions from '../BaseActions'
import { Upload, Button, Modal, message, Tooltip } from 'antd';
import style from './index.scss'

//文件转base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

//阈值化
function two(data) {
    let v;
    for (let i = 0; i < data.length - 4; i += 4) {
        v = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (v > 160) v = 255;
        else v = 0;
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
    }
    return data;
}

//blob转base64
function blobToDataURL(blob, callback) {
    let a = new FileReader();
    a.onload = function (e) { callback(e.target.result); }
    a.readAsDataURL(blob);
}

/**
 * @props {string} uid 教师id 
 */
class UploadImage extends BaseActions {
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
        uploaded:false,
        uploading:false
    };

    //图片预览取消函数
    handleCancel = () => this.setState({ previewVisible: false });

    //图片预览弹窗函数
    handlePreview = async file => {
        // if (!file.url && !file.preview) {
        //     file.preview = await getBase64(file.originFileObj);
        //     console.log(file.preview);
        // }
        this.setState({
            // previewImage: file.url || file.preview,
            // previewImage: file.preview,
            previewVisible: true,
        });
    };

    //上传文件改变时的状态，详情可以参考antd的Upload组件API参数
    onChange = ({ fileList }) => {
        this.setState({ fileList });
    };

    addWater = (file) => {
        let p = new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 150;
                canvas.height = 70;
                const img = document.createElement('img');
                img.src = reader.result;
                img.onload = () => {
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, 150, 70);
                    let imgdata = ctx.getImageData(0, 0, 150, 70);
                    //二值化
                    two(imgdata.data)
                    ctx.putImageData(imgdata, 0, 0)
                    ctx.fillStyle = 'rgba(225,225,225,0.7)';
                    ctx.font = "lighter 40px solid"
                    ctx.textBaseline = 'middle';
                    ctx.textAlign = 'center'
                    //画水印
                    ctx.fillText('毕业设计', 75, 35);
                    let q = canvas.toDataURL('image/jpeg');
                    resolve(q)
                };
            };
        });
        p.then((img) => { this.setState({ previewImage: img }) ;this.onUpload(img)})

    }

    onUpload = async (img)=>{
        this.setState({})
        let x = await this.post(API_SYS_UPLOAD_SIGN,{uid:this.props.uid,type:"sign",file:img})
        this.setState({uploaded:true})
        
    }

    async componentWillMount(){
        let data = await this.post(API_SYS_GET_SIGN_STATE,{uid:this.props.uid})
        let s = data.data[0]==1;
        this.setState({uploaded:s})
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        //根据官方属性定制化裁剪框大小固定的裁剪组件属性
        const props = {
            aspect: 15 / 7,
            resize: false, //裁剪是否可以调整大小
            resizeAndDrag: true, //裁剪是否可以调整大小、可拖动
            modalTitle: "上传您的签名", //弹窗标题
            modalWidth: 600, //弹窗宽度
            rotate: true
        };
        return (
            <div data-component="imgupload">
                <ImgCrop
                    {...props}
                >
                    <Upload
                        name="sign"
                        accept="image/*"
                        data={{ tid: this.props.uid,type:'sign'}}
                        listType="text"
                        fileList={fileList}
                        onPreview={this.handlePreview}
                        onChange={this.onChange}
                        transformFile={this.addWater}
                        beforeUpload={(f)=>{this.addWater(f);return false}}
                    >
                        {fileList.length > 0 ? null : 
                            <>
                            {
                                this.state.uploaded&&
                                <Tooltip title={"重新上传"}>
                                    <span className="upload-span">签名已上传</span>
                                </Tooltip>
                            }
                            {
                                !this.state.uploaded&&
                                <Tooltip title={"请上传白底黑字照片"}>
                                    <span className="upload-span">上传签名</span>
                                </Tooltip>
                            }
                            
                            
                            </>
                        }
                    </Upload>
                </ImgCrop>
                <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={this.handleCancel}
                    title='预览'>
                    <img alt="签名预览" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default UploadImage;