import { Component } from 'preact';

import { Input, Select, Button, Divider} from 'antd';

const { Option } = Select;

import style from './index.css'

//test data
const user={
	id: "20040070"
}

class SearchBar extends Component { 

    constructor(props) {
        super(props)
        this.state = {
            subjectTitle: null,
            subjectCategoryId: null
        }
    }

    searchBtnClick = (title,categoryId) =>{
        console.log(title,categoryId)
        //发送数据
        // let newSubjects = {
        //     code: 200,
        //     data:[
        //         {
        //             id: 1,
        //             title: 'subjectA',
        //             content: 'this is subjectA.',
        //             category: 'category1'
        //         },{
        //             id: 2,
        //             title: 'subjectB',
        //             content: 'this is subjectB.',
        //             category: 'category3'
        //         },{
        //             id: 3,
        //             title: 'subjectC',
        //             content: 'this is subjectc.',
        //             category: 'category3'
        //         }
        //     ]
        // }

        // var data = await this.post("http://www.hanhuikrkr.com:8090/auditTp/searchTopic",{
        //     "uid": user.id,
        //     "topic": title,
        //     "typeId": categoryId
        // });
        // this.props.dataChange(this, newSubjects)
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

	render(_,{subjectTitle,subjectCategoryId}){
        return(
            <div id="searchbox">
                <div className="title">命题审核</div>
                <Divider class="divider"/>

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
                        <Option>选择选题类型</Option>
                        {this.props.subjectCategorys.data.map((category) => 
                            <Option value={category.id.toString()}>{category.type}</Option>
                        )}
                    </Select>
                </div>

                <Button id="search_btn" size="small" type="primary" onClick={this.searchBtnClick.bind(this,subjectTitle,subjectCategoryId)}>查询</Button>

                <Divider class="divider"/>
            </div>
        )
    }
}

export default SearchBar
