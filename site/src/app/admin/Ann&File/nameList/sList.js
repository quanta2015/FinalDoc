/*
 * @Descripttion: 
 * @version: 
 * @Author: wyx
 * @Date: 2020-07-23 16:17:38
 * @LastEditors: wyx
 * @LastEditTime: 2020-07-27 17:24:40
 */ 

import { Component } from 'preact';
import { useState } from 'preact/hooks';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import './sList.scss';
import { Table, Input, InputNumber, Popconfirm, Form, Radio, Space, Button, message, Select} from 'antd';
import { SearchOutlined } from '@ant-design/icons'


@inject('adminStore', 'userStore')
@observer
export default class SLIST extends Component {
    state = {
        //filteredInfo: null,
        searchText: '',
        searchedColumn: '',
    };

    @computed
	get nameListManage() {
		return this.props.adminStore.nameListManage;
    }
    
    async componentDidMount() {
		await this.props.adminStore.getAllStuList();
	}


    // clearFilters = () => {
    //     this.setState({ filteredInfo: null });
    // };

    //表头搜索
    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };
    //表头搜索重置
    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };
    //表格搜索
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
            <Input
                ref={node => {
                this.searchInput = node;
                }}
                placeholder={`请输入...`}
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
            />
            <Space>
                <Button
                type="primary"
                onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
                >
                搜索
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                重置
                </Button>
            </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
            setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) => text,
    });


    render(){
        let { filteredInfo } = this.state;
        filteredInfo = filteredInfo || {};
        
        const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
        }) => {
        //const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
        const inputNode = inputType === 'select' ? 
        <Select
            placeholder="请选择系..."
        >
            <Option value="计算机系">计算机系</Option>
            <Option value="金融系">金融系</Option>
            <Option value="物联网软工系">物联网软工系</Option>
        </Select> 
        : <Input />;
        return (
            <td {...restProps}>
            {editing ? (
                <Form.Item
                name={dataIndex}
                style={{
                    margin: 0,
                }}
                rules={[
                    {
                    required: true,
                    message: `请输入 ${title}!`,
                    },
                ]}
                >
                {inputNode}
                </Form.Item>
            ) : (
                children
            )}
            </td>
        );
        };

        //const EditableTable = () => {
            const [form] = Form.useForm();
            const [data, setData] = useState(this.nameListManage.stu_list);
            const [editingKey, setEditingKey] = useState('');

            const isEditing = record => record.key === editingKey;

            const edit = record => {
                form.setFieldsValue({
                name: '',
                maj: '',
                cls:'',
                ...record,
                });
                setEditingKey(record.key);
            };

            const cancel = () => {
                setEditingKey('');
            };

            const save = async key => {
                try {
                const row = await form.validateFields();
                const newData = [...data];
                const index = newData.findIndex(item => key === item.key);

                if (index > -1) {
                    const item = newData[index];
                    newData.splice(index, 1, { ...item, ...row });
                    setData(newData);
                    setEditingKey('');
                    //console.log(toJS(newData[index]))
                    let params = toJS(newData[index]);
                    // console.log(params)
                    let res = await this.props.adminStore.editInfo(params);     //修改某条信息
                    if (res && res.code === 200) {
                        message.success('修改成功！');
                        await this.props.adminStore.getAllStuList();                 
                    } else {
                        message.err('修改失败，请重试！');
                    }
                } else {
                    newData.push(row);
                    setData(newData);
                    setEditingKey('');
                }
                } catch (errInfo) {
                console.log('Validate Failed:', errInfo);
                }
            };

            const columns = [
                {
                title: '学号',
                dataIndex: 'key',
                key: 'key',
                editable: false,
                ...this.getColumnSearchProps('key'),
                },
                {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                editable: true,
                ...this.getColumnSearchProps('name'),
                },
                {
                title: '所在系',
                dataIndex: 'maj',
                editable: true,
                filters: [
                    { text: "计算机系", value: "计算机系" },
                    { text: "物联网软工系", value: "物联网软工系" },
                    { text: "金融系", value: "金融系" },
                ],
                onFilter: (value, record) => record.maj === value,
                },
                {
                title: '班级',
                dataIndex: 'cls',
                editable: true,
                },
                {
                title: '操作',
                dataIndex: 'operation',
                render: (_, record) => {
                    const editable = isEditing(record);
                    return editable ? (
                    <span>
                        <Popconfirm title="确定保存吗?" 
                            onConfirm={()=>save(record.key)} 
                            onCancel={cancel}>
                            <a
                            href="javascript:;"
                            style={{
                                marginRight: 8,
                            }}
                            >
                            保存
                            </a>
                        </Popconfirm>
                        <a onClick={cancel}>
                            取消
                        </a>
                    </span>
                    ) : (
                    <a disabled={editingKey !== ''} onClick={() => edit(record)}>
                        编辑
                    </a>
                    );
                },
                },
            ];
            const mergedColumns = columns.map(col => {
                if (!col.editable) {
                return col;
                }

                return {
                ...col,
                onCell: record => ({
                    record,
                    //inputType: 'text',
                    inputType: col.dataIndex === 'maj' ? 'select' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: isEditing(record),
                }),
                };
            });
            return (
                <Form form={form} component={false}>
                <div className="m-stu-table">
                <Table
                    components={{
                    body: {
                        cell: EditableCell,
                    },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                    onChange: cancel,
                    }}
                />
                </div>
                </Form>
            );
        };
        // return(
        //     <EditableTable />
        // )

    //}
}