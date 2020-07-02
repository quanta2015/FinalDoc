import { API_SERVER } from './apis'


// 用户接口声明
export const API_USR_XXXXXX = API_SERVER + '/userXXXXXX'

// 系统接口声明
export const API_SYS_XXXXXX = API_SERVER + '/sysXXXXXX'


export const API_SYS_GET_PROJLIST = API_SERVER + '/getProjectList'
export const API_SYS_UPLOAD_FILE = API_SERVER + '/upload'
export const API_SYS_DOWN_FILE = API_SERVER + '/download'

// 专业负责人接口声明
export const API_MAN_GET_TEALIST = API_SERVER + '/manage/teacherList'
export const API_MAN_GET_TOPICLIST = API_SERVER + '/manage/topicList'
export const API_MAN_POST_ALLOCATETOPIC = API_SERVER + '/manage/checkAllocate'
export const API_MAN_POST_AUTOALLOCATETOPIC = API_SERVER + '/manage/randAllocate'
export const API_MAN_POST_CHECKLIST = API_SERVER + '/manage/checkList'
export const API_MAN_POST_AUDITCOUNT = API_SERVER + '/manage/auditCount'
export const API_MAN_POST_AREALIST = API_SERVER + '/manage/areaList'


// 学生接口声明
export const API_STU_GET_TOPINFO = API_SERVER + '/student/getStuInfo' //用户选择过的所有课题记录
export const API_STU_GET_TTLLIST = API_SERVER + '/student/getTopicList' //用户可选的课题列表
export const API_STU_UPDATE_TTLLIST = API_SERVER + '/student/addStuTopic'
export const API_STU_DELETE_TTLLIST = API_SERVER + '/student/delStuTopic'
export const API_STU_FIND_ISINPROJ = API_SERVER + '/student/calStuTopicStateZero'
export const API_STU_FIND_ISDURAUDIT = API_SERVER + '/student/calStuTopicStateTwo'
export const API_STU_GET_STPINFO = API_SERVER + '/student/calStuTopicStateThree' //双选成功的课题信息
