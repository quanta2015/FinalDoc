import { Component } from 'preact';

import { Input, Select, Button} from 'antd';

const { Option } = Select;

import './index.css'

class NavT extends Component { 

    constructor(props) {
        super(props)
        this.state = {
            subjectTitle: null,
            subjectCategoryId: null,
            subjectTeacher: null
        }
    }

    searchBtnClick = (title,categoryId,teacherId) =>{
        console.log(title,categoryId,teacherId)
        //发送数据
        let newSubjects = [
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
            }
        ]
        this.props.dataChange(this, newSubjects)
    }

    searchInputChange = (e) => {
        this.setState({
            subjectTitle: e.target.value
        })
    }

    searchCategoryChange = (value) => {
        this.setState({
            subjectCategoryId: value
        })
    }

    searchTeacherChange = (value) => {
        this.setState({
            subjectTeacher: value
        })
    }

	render(_,{subjectTitle,subjectCategoryId,subjectTeacher}){
        return(
            <div id="searchbox">
                <h4 id="searchbox_title">选题查询</h4>

                <div class="search_method_box">
                    <h5 class="search_method_box_title">选题名</h5>
                    <Input 
                        id="search_input" 
                        size="small" 
                        type="text" 
                        placeholder="请输入课题名"
                        value={subjectTitle}
                        onChange={this.searchInputChange}
                    />
                </div>
                
                <div class="search_method_box">
                    <h5 class="search_method_box_title">选题类型</h5>
                    <Select
                        class="search_select"
                        showSearch
                        size="small"
                        placeholder="选择选题类型"
                        onChange={this.searchCategoryChange}
                    >
                        <Option value="" disabled>选择选题类型</Option>
                        {this.props.subjectCategorys.map((category) => 
                            <Option value={category.id.toString()}>{category.title}</Option>
                        )}
                    </Select>
                </div>

                <div class="search_method_box">
                    <h5 class="search_method_box_title">选题教师</h5>
                    <Select
                        class="search_select"
                        showSearch
                        size="small"
                        placeholder="选择选题教师"
                        onChange={this.searchTeacherChange}
                    >
                        <Option value="" disabled>选择选题教师</Option>
                        {this.props.teachers.map((teacher) => 
                            <Option value={teacher.id}>{teacher.name}</Option>
                        )}
                    </Select>
                </div>

                <Button id="search_btn" size="small" type="primary" onClick={this.searchBtnClick.bind(this,subjectTitle,subjectCategoryId,subjectTeacher)}>查询</Button>
            </div>
        )
    }
}

export default NavT
