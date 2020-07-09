/*
 * @Descripttion: 管理员-公告文档-公告模块 preac
 * @version: 
 * @Author: wyx
 * @Date: 2020-07-09 14:01:54
 * @LastEditors: wyx
 * @LastEditTime: 2020-07-09 20:32:46
 */ 

import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import './annMg.scss';
import { Table, Pagination, Tag, Space, message, Modal, Button, Descriptions, Input, Tooltip,Popconfirm } from 'antd';
import { SearchOutlined,PlusOutlined  } from '@ant-design/icons';


//分页相关 --待修改
const paginationProps = {
	showTotal: ((total) => {
		return `共 ${total} 条`;
	}),
}
// function showTotal(total) {
//     return `共 ${total} 页`;
// }

@inject('adminStore', 'userStore')
@observer
export default class AnnounceManage extends Component {
    state = {
        //filteredInfo: null,
    }

    @computed
	get announceManage() {
		return this.props.adminStore.announceManage;
	}

	@computed
	get usr() {
		return this.props.userStore.usr;
    }
    
    // async componentDidMount() {
    //     await this.props.adminStore
    // }

    //表头筛选
    // handleChange = (filters) => {s
	// 	this.setState({
	// 		filteredInfo: filters,
	// 	})
    // }
    clearFilters = () => {
        this.setState({ filteredInfo: null });
      };
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
					placeholder={`输入标题...`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
						重置
          			</Button>
					<Button
						type="primary"
						onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						搜索
          			</Button>

				</Space>
			</div>
		),
		filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
		onFilter: (value, record) =>
			record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
		onFilterDropdownVisibleChange: visible => {
			if (visible) {
				setTimeout(() => this.searchInput.select());
			}
		},
		render: text =>
			text
    });
    
    
    render() {
        let { filteredInfo } = this.state;
        filteredInfo = filteredInfo || {};
        //表格列
        const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            ellipsis:true,
            ...this.getColumnSearchProps('title'),
        },
        {
            title: '目标对象',
            dataIndex: 'target',
            key: 'target',
            filters: [
                { text: '教师', value: '教师' },
                { text: '学生', value: '学生' },
                { text: '全体', value: '全体' }
            ],

            filterMultiple: false,
            //filteredValue: filteredInfo.result || null,
            onFilter: (value, record) => record.target === value,
        },
        {
            title: '发布日期',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                <a>详情</a>
                </Space>
            ),
            },
        ];
        return(
            <div className="g-ann-list">
                <Button className="m-release-btn" type="primary" icon={<PlusOutlined />} size={'small'}>
                    发布公告
                </Button>
                <div className="m-detail-table">
                    <Table dataSource={this.announceManage.announce_list} 
                        columns={columns}
                        pagination={paginationProps}
                        //onChange={this.handleChange}

                    />
                    {/* <Pagination total={50} showTotal={showTotal} /> */}
                </div>
            </div> 
        )
        
    }
}