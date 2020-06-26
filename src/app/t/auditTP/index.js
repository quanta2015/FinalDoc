import NavBar from '../../../component/NavBar';
import SearchBar from '../../../component/ContentT/SearchBar';
import BaseActions from '../../../component/BaseActions'

import { Component } from 'preact';
import { Collapse, Button } from 'antd';

const { Panel } = Collapse;

import './style.scss';

//test data
const subjects = [
	{
		id: 1,
		title: 'subjectA',
		content: 'this is subjectA.',
		teacher: 'teacherA',
		category: 'category1'
	},{
		id: 2,
		title: 'subjectB',
		content: 'this is subjectB.',
		teacher: 'teacherB',
		category: 'category3'
	},{
		id: 3,
		title: 'subjectC',
		content: 'this is subjectc.',
		teacher: 'teacherC',
		category: 'category3'
	},{
		id: 4,
		title: 'subjectE',
		content: 'this is subjectE.',
		teacher: 'teacherC',
		category: 'category3'
	},{
		id: 5,
		title: 'subjectD',
		content: 'this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.\
		this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.\
		this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.\
		this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.\
		this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.\
		this is subjectD.this is subjectD.this is subjectD.this is subjectD.this is subjectD.',
		teacher: 'teacherA',
		category: 'category2'
	},{
		id: 6,
		title: 'subjectF',
		content: 'this is subjectF.',
		teacher: 'teacherB',
		category: 'category1'
	},{
		id: 7,
		title: 'subjectG',
		content: 'this is subjectG.',
		teacher: 'teacherC',
		category: 'category3'
	},{
		id: 8,
		title: 'subjectH',
		content: 'this is subjectH.',
		teacher: 'teacherC',
		category: 'category4'
	},{
		id: 9,
		title: 'subjectI',
		content: 'this is subjectI.',
		teacher: 'teacherB',
		category: 'category1'
	},{
		id: 10,
		title: 'subjectJ',
		content: 'this is subjectJ.',
		teacher: 'teacherA',
		category: 'category2'
	}
]

const subjectCategorys = [
	{
		id: 1,
		title: 'A'
	},
	{
		id: 2,
		title: 'B'
	},
	{
		id: 3,
		title: 'C'
	},
]

const teachers = [
    {
		id: 1,
		name: 'teacherA'
    },{
        id: 2,
		name: 'teacherB'
    },{
        id: 3,
		name: 'teacherC'
    }
]

export default class Home extends BaseActions {
	constructor(props) {
		super(props)
		
        this.state = {
			subjects: subjects,
			teachers: teachers,
			subjectCategorys: subjectCategorys
		}
	}

	async componentDidMount() {
		//获取数据
		let data = await this.get("http://123.207.32.32:8000/home/multidata",null)
		console.log(data)
	}

	dataChange = (result, newSubjects) =>{
		console.log(newSubjects)
		this.setState({
			subjects: newSubjects
		})
	}

	yesBtnClick = (id) =>{
		console.log(id)
	}

	noBtnClick = (id) =>{
		console.log(id)
	}

	render(_,{ subjects,teachers,subjectCategorys }) {
		return (
			<div className="g-home">
				<NavBar/>
				<SearchBar teachers={teachers} subjectCategorys={subjectCategorys} dataChange={this.dataChange}/>
				<Collapse>
					{subjects.map( (subject) => 
						<Panel header={subject.title} key={subject.id}>
							<p>{subject.content}</p>
							<div>
								<span style="margin-right:20px">选题任课教师: {subject.teacher}</span>
								<span>选题类型: {subject.category}</span>
							</div>
	
							<div class="btn_group">
								<Button style="margin-right:5px" type="primary" size="small" onClick={this.yesBtnClick.bind(this,subject.id)}>通过</Button>
								<Button size="small" onClick={this.noBtnClick.bind(this,subject.id)}>提出意见</Button>
							</div>
						</Panel>
					)}
				</Collapse>
			</div>
		);
	}
}
