import { Component } from 'preact';
import { inject, observer } from 'mobx-react';
import { Table, Tag, Space } from 'antd';
import { computed } from 'mobx';
import "./totalSchedule.css"

const columns = [
    {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
         
    },
    {
        title: '班级',
        dataIndex: 'age',
        key: 'age',

    },
    {
        title: '选题',
        dataIndex: 'class',
        key: 'class',
    },
   
     
    {
        title: '指导教师',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: '选题阶段',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
            <>
                {tags.map(tag => {
                    let color = 'green';

                    return (
                        <Tag color={color} key={tag}>
                            {tag}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: '开题答辩',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
            <>
                {tags.map(tag => {
                    let color =  'green';
                    
                    return (
                        <Tag color={color} key={tag}>
                            {tag}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: '审核论文定稿',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
            <>
                {tags.map(tag => {
                    let color = 'green';

                    return (
                        <Tag color={color} key={tag}>
                            {tag}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: '论文答辩',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
            <>
                {tags.map(tag => {
                    let color = 'green';

                    return (
                        <Tag color={color} key={tag}>
                            {tag}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: '最终稿审核',
        key: 'tags',
        dataIndex: 'tags',
        render: tags => (
            <>
                {tags.map(tag => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (tag === 'loser') {
                        color = 'volcano';
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: '查看详情',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                
                <a>详情</a>
            </Space>
        ),
    },
];

const data = [
    {
        key: '1',
        name: '杨薪宏',
        class:"计算机181",
        age: "关于湖景苑是永远的神的问题",
        address: '周春儿',
        tags: ['nice'],
    },
    {
        key: '2',
        name: '杨薪宏',
        class: "计算机181",
        age: "关于湖景苑是永远的神的问题",
        address: '周春儿',
        tags: ['loser'],
    },
    {
        key: '3',
        name: '杨薪宏',
        class: '计算机181',
        age: "关于湖景苑是永远的神的问题",
        address: '周春儿',
        tags: ['nice'],
    },
];


@inject('manageStore')
@observer
export default class TotalSchedule extends Component {
    render() {
        return (
            <div class="totalschedule_table">
                <Table columns={columns} dataSource={data} />
            </div>
        );
    }
}