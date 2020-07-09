/*
 * @Descripttion: 
 * @version: 
 * @Author: wyx
 * @Date: 2020-07-09 14:01:54
 * @LastEditors: wyx
 * @LastEditTime: 2020-07-09 14:41:57
 */ 

import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { computed, toJS } from 'mobx';
import './annMg.scss';
import { Table, Tag, Space, message, Modal, Button, Descriptions, Input, Tooltip,Popconfirm } from 'antd';

const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ];
  
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    },
  ];


@inject('userStore')
@observer
export default class AnnounceManage extends Component {
    render() {
        return(
            <div className="g-ann">
                <Table dataSource={dataSource} columns={columns} />
            </div> 
        )
        
    }
}