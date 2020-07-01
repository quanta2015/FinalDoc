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
export const API_SYS_GET_FUUL_TOPIC_BY_ID = API_SERVER + '/teacher/getTopicFullInfo';
//通过教师id获取topic内容
export const API_SYS_GET_TOPIC_BY_TEACHER_ID = API_SERVER + '/teacher/getTidgetTopic'; 
//通过topicID删除topic
export const API_USR_DELETE_TOPIC_BY_ID = API_SERVER + '/teacher/delOneTopicWithID';
//获取area列表
export const API_SYS_GET_TEACHER_AREA_LIST = API_SERVER + '/teacher/getTeacherAreas'
//获取学生申请列表
export const API_SYS_GET_TOPIC_CHECK_STUDNET = API_SERVER + '/teacher/getTopicCheckStudent'
//审核学生申请
export const API_SYS_TEACHER_REVIEW_STUDENT = API_SERVER + '/teacher/getTopicStudentAlter'
//查看学生个人信息
export const API_TEACHER_GET_STU_INFO = API_SERVER + '/teacher/getStuPersonalInfo'
//查看被审核意见
export const API_TEACHER_GET_SUGG = API_SERVER +'/teacher/getTidToTsugg'
//获取全部已通过topic
export const API_TEACHER_GET_ALL_TOPIC =API_SERVER + '/teacher/getAllPassedTopic'


// 任课教师-初期审核

// 获取审核命题列表
export const API_SYS_TEACHER_AUDIT_TP_GET_TOPIC_LIST = API_SERVER + '/auditTp/getTopicList';
// 提交通过命题审核
export const API_SYS_TEACHER_AUDIT_TP_CHECK_UPDATE_YES = API_SERVER + '/auditTp/checkUpdateYes';
// 提交未通过命题审核
export const API_SYS_TEACHER_AUDIT_TP_CHECK_UPDATE_NO = API_SERVER + '/auditTp/checkUpdateNo';
// 查询命题列表
export const API_SYS_TEACHER_AUDIT_TP_SEARCH_TOPIC_BY_ID = API_SERVER + '/auditTp/searchTopicById';