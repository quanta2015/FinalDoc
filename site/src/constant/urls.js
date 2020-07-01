import { API_SERVER } from './apis'


// 用户接口声明
export const API_USR_XXXXXX = API_SERVER + '/userXXXXXX'

// 系统接口声明
export const API_SYS_XXXXXX = API_SERVER + '/sysXXXXXX'


export const API_SYS_GET_PROJLIST = API_SERVER + '/getProjectList'
export const API_SYS_GET_TOPINFO = API_SERVER + '/student/getStuInfo' //用户选择过的所有课题记录
export const API_SYS_GET_TTLLIST = API_SERVER + '/student/getTopicList' //用户可选的课题列表
export const API_SYS_UPDATE_TTLLIST = API_SERVER + '/student/addStuTopic'
export const API_SYS_DELETE_TTLLIST = API_SERVER + '/student/delStuTopic'
export const API_SYS_FIND_ISINPROJ = API_SERVER + '/student/calStuTopicStateZero'
export const API_SYS_FIND_ISDURAUDIT = API_SERVER + '/student/calStuTopicStateTwo'
export const API_SYS_GET_STPINFO = API_SERVER + '/student/calStuTopicStateThree' //双选成功的课题信息

