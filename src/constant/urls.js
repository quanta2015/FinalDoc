import { API_SERVER } from './apis'


// 用户接口声明
export const API_USR_XXXXXX = API_SERVER + '/userXXXXXX'

// 系统接口声明
export const API_SYS_XXXXXX = API_SERVER + '/sysXXXXXX'


export const API_SYS_GET_PROJLIST = API_SERVER + '/getProjectList'

// 获取选择了自己的学生的列表
export const API_SYS_GET_CHECKED_STULIST = API_SERVER + '/teacher/getCheckedStuList';
//获取自己要审核的选题列表
export const API_SYS_GET_EXAMINE_LIST = API_SERVER + '/teacher/getExamineList';
//提交选题信息
export const API_SYS_POST_TOPIC_INFO = API_SERVER + '/teacher/postTopicInfo';
//通过学号模糊查询
export const API_SYS_GET_STU_BY_LIKEID = API_SERVER + '/teacher/getStuInfoByLikeID';
//通过topicID查询完整信息
export const API_SYS_GET_FUUL_TOPIC_BY_ID = API_SERVER + '/teacher/getStuInfoByLikeID';
//通过教师id获取topic内容
export const API_SYS_GET_TOPIC_BY_TEACHER_ID = API_SERVER + '/teacher/getTidgetTopic'; 
