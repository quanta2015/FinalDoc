import { API_SERVER } from './apis'


// 用户接口声明
export const API_USR_XXXXXX = API_SERVER + '/userXXXXXX'

// 系统接口声明
export const API_SYS_XXXXXX = API_SERVER + '/sysXXXXXX'


export const API_SYS_GET_PROJLIST = API_SERVER + '/getProjectList'

// 专业负责人接口声明
export const API_MAN_GET_TEALIST = API_SERVER + '/manage/teacherList'
export const API_MAN_GET_TOPICLIST = API_SERVER + '/manage/topicList'

export const API_MAN_POST_ALLOCATETOPIC = API_SERVER + '/manage/checkAllocate'
export const API_MAN_POST_AUTOALLOCATETOPIC = API_SERVER + '/manage/randAllocate'
export const API_MAN_POST_CHECKLIST = API_SERVER + '/manage/checkList'
export const API_MAN_POST_AUDITCOUNT = API_SERVER + '/manage/auditCount'
export const API_MAN_POST_AREALIST = API_SERVER + '/manage/areaList'



export const API_MAN_POST_OGP_TOPICLIST = API_SERVER + '/openGp/topicList'

export const API_MAN_POST_OGP_TEACHERLIST = API_SERVER + '/openGp/teacherList'

export const API_MAN_POST_OGP_AUTOALLOCATETOPIC = API_SERVER + '/openGp/randGroup'
export const API_MAN_POST_OGP_MANUALALLOCATETOPIC = API_SERVER + '/openGp/handleGroup'