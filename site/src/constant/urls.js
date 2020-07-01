import { API_SERVER } from './apis'


// 用户接口声明
export const API_USR_XXXXXX = API_SERVER + '/userXXXXXX'

// 系统接口声明
export const API_SYS_XXXXXX = API_SERVER + '/sysXXXXXX'


export const API_SYS_GET_PROJLIST = API_SERVER + '/getProjectList'
export const API_SYS_GET_STUINFO = API_SERVER + '/student/getStuInfo'
export const API_SYS_GET_TTLLIST = API_SERVER + '/student/getTopicList'
export const API_SYS_UPDATE_TTLLIST = API_SERVER + '/student/addStuTopic'
export const API_SYS_DELETE_TTLLIST = API_SERVER + '/student/delStuTopic'
export const API_SYS_FIND_ISINPROJ = API_SERVER + '/student/calStuTopicStateZero'
export const API_SYS_FIND_ISDURAUDIT = API_SERVER + '/student/calStuTopicStateTwo'
// export const