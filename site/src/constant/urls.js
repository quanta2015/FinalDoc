import { API_SERVER } from './apis'


// 用户接口声明
export const API_USR_XXXXXX = API_SERVER + '/userXXXXXX'
export const API_USR_LOGIN = API_SERVER +'/user/login'

// 系统接口声明
export const API_SYS_XXXXXX = API_SERVER + '/sysXXXXXX'


export const API_SYS_GET_PROJLIST = API_SERVER + '/getProjectList'
export const API_SYS_UPLOAD_FILE = API_SERVER + '/upload'
export const API_SYS_DOWN_FILE = API_SERVER + '/download'

// 专业负责人接口声明
export const API_MAN_GET_TEALIST = API_SERVER + '/manage/teacherList'
export const API_MAN_GET_TOPICLIST = API_SERVER + '/manage/topicList'

// 分配审核课题模块
export const API_MAN_POST_ALLOCATETOPIC = API_SERVER + '/manage/checkAllocate'
export const API_MAN_POST_AUTOALLOCATETOPIC = API_SERVER + '/manage/randAllocate'
export const API_MAN_POST_CHECKLIST = API_SERVER + '/manage/checkList'
export const API_MAN_POST_AUDITCOUNT = API_SERVER + '/manage/auditCount'
export const API_MAN_POST_AREALIST = API_SERVER + '/manage/areaList'
export const API_MAN_POST_RELEASE = API_SERVER + '/manage/releaseTopic'
export const API_MAN_POST_JUDGETOPIC = API_SERVER + '/manage/judgeTopic'

// 组织开题答辩模块
export const API_MAN_POST_OGP_TOPICLIST = API_SERVER + '/openGp/topicList'
export const API_MAN_POST_OGP_TEACHERLIST = API_SERVER + '/openGp/teacherList'
export const API_MAN_POST_OGP_AUTOALLOCATETOPIC = API_SERVER + '/openGp/randGroup'
export const API_MAN_POST_OGP_MANUALALLOCATETOPIC = API_SERVER + '/openGp/handleGroup'
export const API_MAN_POST_OGP_GROUPLIST = API_SERVER + '/openGp/groupList'
export const API_MAN_POST_OGP_TDETAILLIST = API_SERVER + '/openGp/topicDetailList'
export const API_MAN_POST_OGP_DELETEGROUP = API_SERVER + '/openGp/deleteGroup'

// 查看论文进度
export const API_MAN_POST_VIEWPROGRESS = API_SERVER + '/auditMg/viewProgress'
// 查看某位学生上传的文件
export const API_MAN_POST_VIEWFILES = API_SERVER + '/auditMg/viewFiles'



// 学生接口声明
export const API_STU_GET_TOPINFO = API_SERVER + '/student/getStuInfo' //用户选择过的所有课题记录
export const API_STU_GET_TTLLIST = API_SERVER + '/student/getTopicList' //用户可选的课题列表
export const API_STU_UPDATE_TTLLIST = API_SERVER + '/student/addStuTopic'
export const API_STU_DELETE_TTLLIST = API_SERVER + '/student/delStuTopic'
export const API_STU_FIND_ISINPROJ = API_SERVER + '/student/calStuTopicStateZero'
export const API_STU_FIND_ISDURAUDIT = API_SERVER + '/student/calStuTopicStateTwo'
export const API_STU_GET_STPINFO = API_SERVER + '/student/calStuTopicStateThree' //双选成功的课题信息 
export const API_STU_DEL_FILE = API_SERVER + '/student/delFile'

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
//获取学生文件列表
export const API_TEACHER_GET_FILE_BY_TOPIC = API_SERVER + '/teacher/getAllTopicFiles'


// 任课教师-初期审核

// 获取审核命题列表
export const API_SYS_TEACHER_AUDIT_TP_GET_TOPIC_LIST = API_SERVER + '/auditTp/getTopicList';
// 提交通过命题审核
export const API_SYS_TEACHER_AUDIT_TP_CHECK_UPDATE_YES = API_SERVER + '/auditTp/checkUpdateYes';
// 提交未通过命题审核
export const API_SYS_TEACHER_AUDIT_TP_CHECK_UPDATE_NO = API_SERVER + '/auditTp/checkUpdateNo';
// 查询命题列表
export const API_SYS_TEACHER_AUDIT_TP_SEARCH_TOPIC_BY_ID = API_SERVER + '/auditTp/searchTopicById';
