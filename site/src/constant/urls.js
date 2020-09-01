import { API_SERVER, LOCAL_SERVER } from './apis'


// 用户接口声明
export const API_USR_XXXXXX = API_SERVER + '/userXXXXXX'
export const API_USR_LOGIN = API_SERVER +'/user/login'

// 系统接口声明
export const API_SYS_XXXXXX = API_SERVER + '/sysXXXXXX'


export const API_SYS_GET_PROJLIST = API_SERVER + '/getProjectList'
export const API_SYS_UPLOAD_FILE = API_SERVER + '/upload'
export const API_SYS_DOWN_FILE = API_SERVER + '/download'
//查询签名状态
export const API_SYS_GET_SIGN_STATE = API_SERVER + '/checkSign'
//上传签名图片
export const API_SYS_UPLOAD_SIGN = API_SERVER + '/teacher/uploadSign'
//得到所有站内信
export const API_SYS_GET_MESSAGES = API_SERVER + '/getPersonalMessages' 
//一键已读
export const API_SYS_READ_MESSAGES = API_SERVER + '/updateMessagesRead' 
//通知列表
export const API_SYS_GET_NOTICE = API_SERVER + '/getPersonalAnnouncement'
//已读通知
export const API_SYS_READ_NOTICE = API_SERVER + '/updateAnnouncementRead' 
//状态通知 一对多
export const API_SYS_POST_MESSAGETOMANY = API_SERVER + '/insertMessageToMany' 
//状态通知 一对一
export const API_SYS_POST_MESSAGETOONE = API_SERVER + '/insertMessageToOne' 

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
export const API_MAN_POST_OGP_AUTOALLOCATETOPIC = API_SERVER + '/openGp/tenTopic'
export const API_MAN_POST_OGP_MANUALALLOCATETOPIC = API_SERVER + '/openGp/handleGroup'
export const API_MAN_POST_OGP_GROUPLIST = API_SERVER + '/openGp/groupList'
export const API_MAN_POST_OGP_TDETAILLIST = API_SERVER + '/openGp/topicDetailList'
export const API_MAN_POST_OGP_DELETEGROUP = API_SERVER + '/openGp/deleteGroup'
// export const API_MAN_POST_OPEND_DEFENSE = API_SERVER + ''

//组织终期答辩
// 组织开题答辩模块
export const API_MAN_POST_FGP_TOPICLIST = API_SERVER + '/finalGp/topicList'
export const API_MAN_POST_FGP_TEACHERLIST = API_SERVER + '/finalGp/teacherList'
export const API_MAN_POST_FGP_AUTOALLOCATETOPIC = API_SERVER + '/finalGp/tenTopic'
export const API_MAN_POST_FGP_MANUALALLOCATETOPIC = API_SERVER + '/finalGp/handleGroup'
export const API_MAN_POST_FGP_GROUPLIST = API_SERVER + '/finalGp/groupList'
export const API_MAN_POST_FGP_TDETAILLIST = API_SERVER + '/finalGp/topicDetailList'
export const API_MAN_POST_FGP_DELETEGROUP = API_SERVER + '/finalGp/deleteGroup'

//审核任务书、论文定稿等
export const API_MAN_POST_RP_TASKLIST = API_SERVER + '/auditMg/taskList'
export const API_MAN_POST_RP_REVIEWTASK = API_SERVER + '/auditMg/reviewTask'
export const API_MAN_POST_RP_JUDEGOPENDEFENCE = API_SERVER + '/auditMg/judgeOpDef'
export const API_MAN_POST_RP_NEXTOPENDEFENCE = API_SERVER + '/auditMg/nextOpDef'
export const API_MAN_POST_RP_STATUSOPENDEFENCE = API_SERVER + '/auditMg/statusOpDef'



// 查看论文进度
export const API_MAN_POST_VIEWPROGRESS = API_SERVER + '/auditMg/viewProgress'
// 查看本系老师课题数量
export const API_MAN_POST_VIEWTEACOUNT = API_SERVER + '/auditMg/viewTeaCount'
// 查看某位学生上传的文件
export const API_MAN_POST_VIEWFILES = API_SERVER + '/auditMg/viewFiles'

//一键进入最终答辩阶段
export const API_MAN_POST_FM_JUDEGFINALDEFENCE = API_SERVER + '/auditFm/judgeFinDef'
export const API_MAN_POST_FM_NEXTFINALDEFENCE = API_SERVER + '/auditFm/nextFinDef '
export const API_MAN_POST_FM_STATUSFINALDEFENCE = API_SERVER + '/auditFm/statusFinDef'



// 学生接口声明
//用户选择过的所有课题记录
export const API_STU_GET_TOPINFO = API_SERVER + '/student/getStuInfo' 
//用户可选的课题列表
export const API_STU_GET_TTLLIST = API_SERVER + '/student/getTopicList' 
export const API_STU_UPDATE_TTLLIST = API_SERVER + '/student/addStuTopic'
export const API_STU_DELETE_TTLLIST = API_SERVER + '/student/delStuTopic'
export const API_STU_FIND_ISDURAUDIT = API_SERVER + '/student/calStuTopicStateTwo'
//双选成功的课题信息 
export const API_STU_GET_STPINFO = API_SERVER + '/student/calStuDoubleSlelctSucc' 
export const API_STU_DEL_FILE = API_SERVER + '/student/delFile'
//所有指导日志
export const API_STU_GET_GUIDANCE = API_SERVER + '/student/getGuidance' 
//增加指导日志
export const API_STU_ADD_GUIDANCE = API_SERVER+'/student/insertGuidance'
//删除指导日志
export const API_STU_DEL_GUIDANCE = API_SERVER + '/student/delGuidance'
//更改指导日志
export const API_STU_EDIT_GUIDANCE = API_SERVER + '/student/updateGuidance'
//所有阶段以及截止时间
export const API_STU_GET_ALLSTATES = API_SERVER + '/student/getAllStates' 
// 返回当前阶段
export const API_STU_GET_CURSTATE = API_SERVER + '/student/getCurrentState' 
// 获取模板文件
export const API_STU_GET_TEMP_FILE = API_SERVER + '/student/getAllStudentTemplate'
//返回开题成绩
export const API_STU_GET_OPSCORE = API_SERVER + '/student/getOpenScore'
// 获取答辩信息
export const API_STU_GET_REPLY_INFO = API_SERVER + '/student//getQuestionInfo'
// 获取nav栏状态
export const API_STU_GET_NAV_STAGE = API_SERVER + '/student/getStudentTopicStatus'
// 提交延缓答辩申请
export const API_STU_SUBMIT_DEFER = API_SERVER + '/student/insertDeferApplication'
// 查询延缓答辩申请内容
export const API_STU_GET_DEFER_PRG = API_SERVER + '/student/getDeferAppliStatus'
// 判断当前延缓答辩申请入口是否开放
export const API_STU_GET_DEFER_SHOW = API_SERVER + '/student/getIfCanDefAppli'
// 获取终期导师评分与终期评阅评分
export const API_STU_GET_FDSCORE = API_SERVER + '/student/getFinalScores'

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
export const API_SYS_GET_TOPIC_BY_TEACHER_ID = API_SERVER+ '/teacher/getTidgetTopic'; 
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
//解绑学生
export const API_TEACHER_UNTIED = API_SERVER + '/teacher/getStudentUntied'
//获取所有选题类型(get)
export const API_SYS_GET_ALL_TYPE = API_SERVER + '/teacher/getAllType'
//保存任务书
export const API_TEACHER_SAVE_TASK = API_SERVER+'/teacher/saveTask'
//获取任务书
export const API_TEACHER_GET_TASK = API_SERVER + '/teacher/getTask'
//是否可以发布课题
export const API_TEACHER_CAN_PUBLISH = API_SERVER + '/teacher/canPublish'
//是否是审核组员
export const API_TEACHER_AUDIT_OP_IS_MEMBER = API_SERVER + `/auditOp/isTeamMember`
//获取起止时间
export const API_TEACHER_GET_TIME_LINE = API_SERVER + '/teacher/getTimeLine'
//获取是否为第二阶段
export const API_TEACHER_GET_SEL = API_SERVER + '/teacher/getSel'
//获取是否需要审核（1,3阶段）
export const API_TEACHER_GET_IF_AUDIT = API_SERVER + '/teacher/getIfAudit'
//通过推迟
export const API_TEACHER_PASS_DE = API_SERVER + '/teacher/passDelay';
//拒绝推迟
export const API_TEACHER_RUFUSE_DE = API_SERVER + '/teacher/refuseDelay';

// 任课教师-初期审核
export const API_SYS_TEACHER_AUDIT_TP_GET_TOPIC_LIST = API_SERVER + '/auditTp/getTopicList';// 获取审核命题列表
export const API_SYS_TEACHER_AUDIT_TP_CHECK_UPDATE_YES = API_SERVER + '/auditTp/checkUpdateYes';// 提交通过命题审核
export const API_SYS_TEACHER_AUDIT_TP_CHECK_UPDATE_NO = API_SERVER + '/auditTp/checkUpdateNo';// 提交未通过命题审核
export const API_SYS_TEACHER_AUDIT_TP_SEARCH_TOPIC_BY_ID = API_SERVER + '/auditTp/searchTopicById';// 查询命题列表

// 任课教师-开题审核
export const API_SYS_TEACHER_AUDIT_OP_GET_TOPIC_LIST = API_SERVER + '/auditOp/getTopicList';// 获取开题审核选题列表
export const API_SYS_TEACHER_AUDIT_OP_GET_TEAM = API_SERVER + '/auditOp/getTeam';// 获取当前教师的审核小组
export const API_SYS_TEACHER_AUDIT_OP_GET_AUDIT_PERMISSION = API_SERVER + '/auditOp/getAuditPermission';// 判断是否为审核组教师
export const API_SYS_TEACHER_AUDIT_OP_SUBMIT_TUTOR_FORM = API_SERVER + '/auditOp/submitTutorForm';// 提交指导教师审核表单
export const API_SYS_TEACHER_AUDIT_OP_SUBMIT_TEAM_FORM = API_SERVER + '/auditOp/submitTeamForm';// 提交审核组审核表单
export const API_SYS_TEACHER_AUDIT_OP_IS_TEAM_LEADER = API_SERVER + '/auditOp/isTeamLeader';// 判断是否为审核组组长

//任课教师-结题审核
export const API_SYS_TEACHER_AUDIT_FD_GET_TOPIC_LIST = API_SERVER + '/auditFd/getTopicList';// 获取结题审核选题列表
export const API_SYS_TEACHER_AUDIT_FD_GET_AUDIT_PERMISSION = API_SERVER + '/auditFd/getAuditPermission';// 判断是否为指导教师
export const API_SYS_TEACHER_AUDIT_FD_SUBMIT_TUTOR_FORM = API_SERVER + '/auditFd/submitTutorForm';// 提交指导教师审核表单
export const API_SYS_TEACHER_AUDIT_FD_SUBMIT_TEAM_FORM = API_SERVER + '/auditFd/submitTeamForm';// 提交评审人审核表单




/*教务处管理端接口*/
//获取当前所有公告，并按时间倒序排列
export const API_ADMIN_GET_TOTAL_ANN_LIST = API_SERVER + '/admin'+'/getAllAnnounce'
//删除某个公告
export const API_ADMIN_DEL_ONE_ANN = API_SERVER + '/admin'+'/delOneAnnounce'
//获取所有文件
export const API_ADMIN_GET_ALL_FILE = API_SERVER + '/admin'+'/getAllFileAddress'
//上传文件
export const API_ADMIN_UPLOAD_FILE = API_SERVER + '/admin'+'/uploadFile'
//发布公告
export const API_ADMIN_UPLOAD_ANN = API_SERVER + '/admin'+'/insertAnnouncement'
//上传模板文件的记录
export const API_ADMIN_INSERT_FILE_RECORD = API_SERVER + '/admin'+'/insertFileTemplate'
//根据通知id获取通知具体内容
export const API_ADMIN_CALL_ANN_DETAIL = API_SERVER + '/admin'+'/getAnnouncementDetails'
//管理端文件下载
export const API_ADMIN_DOWNLOAD_FILE = API_SERVER + '/admin'+'/admindownload'
//删除文件
export const API_ADMIN_DELETE_UPLOAD_FILE = API_SERVER + '/admin'+'/delFile'

//获取全部学生名单
export const API_ADMIN_GET_ALL_STU_LIST = API_SERVER + '/admin'+'/getAllStu'
//获取全部教师名单
export const API_ADMIN_GET_ALL_TEA_LIST = API_SERVER + '/admin'+'/getAllTea'
//修改名单某条信息
export const API_ADMIN_EDIT_ONE_INFO = API_SERVER + '/admin'+'/editInfo'
// 获取timeline内state_id、相关阶段名称、开始日期、结束日期
export const API_ADMIN_GET_TIMELINE_WITH_MAJOR = API_SERVER + '/admin'+'/getMajorTimeline'
// 修改timeline内开始日期、结束日期
export const API_ADMIN_CHANGE_TIMELINE_WITH_MAJOR = API_SERVER + '/admin'+'/updateMajorTimeline'