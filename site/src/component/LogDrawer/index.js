import { Component } from 'preact'
import { inject, observer } from 'mobx-react'
import { Drawer, Form, Button, Row, Col, Input, Select, DatePicker } from 'antd'
import './index.css'

@inject('userStore')
@observer
class LogDrawer extends Component {
    constructor(props) {
        super(props);
        
    }

    render() {
        return (
            <div className="g-log">
                <Drawer
                    title="指导日志"
                    width={720}
                    onClose={this.props.onClose}
                    visible={this.props.showDrawer}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={this.props.onClose} style={{ marginRight: 8 }}>
                                取消
              </Button>
                            <Button onClick={this.props.onClose} type="primary">
                                确定
              </Button>
                        </div>
                    }
                >
                    
                    



                </Drawer>
            </div>
        );
    }
}

export default LogDrawer;