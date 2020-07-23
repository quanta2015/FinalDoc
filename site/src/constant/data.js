import React from 'react'


export const DATE_FORMAT = 'YYYY/MM/DD'
export const MONTH_FORMAT = 'YYYY/MM'

import home from '../icon/icon_setting.svg';
import manage from '../icon/icon_manage.svg';
import audit from '../icon/icon_audit.svg';
import cp from '../icon/icon_cp.svg';

import notice from '../icon/icon_notice.svg';

import group from '../icon/icon_m_group.svg';
import divide from '../icon/icon_m_divide.svg';
import article from '../icon/icon_m_article.svg';
import progress from '../icon/icon_m_progress.svg';

import paper from '../icon/icon_s_paper.svg';
import select from '../icon/icon_s_select.svg';

export var MENU_MAIN_M =
   [{ title: '分配审核选题', path: '/m_distributeTopic', icon: divide },
   { title: '审核任务书', path: '/m_reviewPaper', icon: progress },
   { title: '组织开题答辩', path: '/m_organizeOpendefence', icon: group },
   { title: '查看论文进度', path: '/m_viewProgress', icon: article },
   ]

export var MENU_MAIN_T =
   [{ title: '毕业设计管理', path: '/t_manage', icon: manage },
      // { title: '系统设置 ', path: '/t_system', icon: home },
   ]

export var MENU_MAIN_T_AUDIT = [
   { title: '初期命题审核', path: '/t_auditTP', icon: cp },
   { title: '中期开题审核', path: '/t_auditOP', icon: audit },
   { title: '终期论文审核', path: '/t_auditFD', icon: audit }
]

export var MENU_MAIN_S = [
   { title: '通知公告', path: '/s', icon: notice },
   { title: '选择课题', path: '/s_selectTL', icon: select },
   { title: '课题详情', path: '/s_topicPG', icon: paper },
]

//学生选课状态
export var STU_ST_STATUS =
   [{ name: '未通过', color: 'red' },
   { name: '待教师通过', color: 'blue' }]

//学生三阶段所需上传文件
export var FILE_UPLOAD_TYPE =
   [{
      stage: '开题中期',
      file: [{ name: '开题报告', type: 'f_open' },
      { name: '外文翻译', type: 'f_tran' },
      { name: '文献综述', type: 'f_docs' },
      { name: '中期检查表', type: 'f_midcheck' }]
   },
   {
      stage: '论文审核',
      file: [{ name: '论文定稿', type: 'f_paper' },
      { name: '设计作品', type: 'f_design_opus' },
      { name: '作品说明书', type: 'f_manual' },
      { name: '查重报告', type: 'f_check' }]
   },
   {
      stage: '论文答辩',
      file: [{ name: '答辩材料', type: 'f_reply_source' },
      { name: '答辩记录', type: 'f_reply_log' },
      { name: '答辩成绩表', type: 'f_reply_score' },
      { name: '延缓申请表', type: 'f_reply_delay_apply' }]
   }]

//系主任端查看论文进度表中，能下载的学生上传的文件
export var FILE_DOWNLOAD_TYPE =
   [{
      stage: '1. 开题中期',
      file: [{ name: '开题报告', type: 'f_open' },
      { name: '外文翻译', type: 'f_tran' },
      { name: '文献综述', type: 'f_docs' },
      { name: '中期检查表', type: 'f_midcheck' }]
   },
   {
      stage: '2. 论文审核',
      file: [{ name: '论文定稿', type: 'f_paper' },
      { name: '设计作品', type: 'f_design_opus' },
      { name: '作品说明书', type: 'f_manual' },
      { name: '查重报告', type: 'f_check' },
      { name: '承诺书', type: 'f_prom' }]
   },
   {
      stage: '3. 论文答辩',
      file: [{ name: '答辩材料', type: 'f_reply_source' },
      { name: '答辩记录', type: 'f_reply_log' },
      { name: '答辩成绩表', type: 'f_reply_score' }]
   }]

//学生文件上传状态
export var STU_FU_STATUS =
   [{ name: '未完成', color: '' },
   { name: '待审核', color: 'blue' },
   { name: '已通过', color: 'green' }
   ]

//文件上传类型约束
export var FILE_UPLOAD_FORMAT =
{
   reply: ['zip', 'ppt', 'pptx'],
   doc: ['doc', 'docx', 'pdf']
}

export var STU_OP_SCORE = [
   { name: '指导老师评分', type: 'ins_score' },
   { name: '开题答辩小组评分', type: 'grp_score' }
]

// 站内信类型
export var MSG_TYPE = [
   "info", "success", "warning", "error"
]


//管理端
//管理端nav
export var ADMIN_NAV_DATA = [
   {
     title: "公告文档",
     childData: [
       { title: "公告管理", path: "/admin_ann" },
       { title: "文档管理", path: "/admin_file" },
     ],
     path: "/admin_ann",
     icon: "BankOutlined",
     stateNum:0,
   },
   {
     title: "选题管理",
     childData: [
       { title: "option1", path: "/admin" },
       { title: "option2", path: "/admin" },
     ],
     path: "/admin",
     icon: "BankOutlined",
     stateNum:1,
   },
   {
     title: "中期检查",
     childData: [
       { title: "option1", path: "/admin" },
       { title: "option2", path: "/admin" },
     ],
     path: "/admin",
     icon: "BankOutlined",
     stateNum:2,
   },
   {
     title: "评阅答辩",
     childData: [
       { title: "option1", path: "/admin" },
       { title: "option2", path: "/admin" },
     ],
     path: "/admin",
     icon: "BankOutlined",
     stateNum:3,
   },
   {
     title: "成绩分析",
     childData: [
       { title: "option1", path: "/admin" },
       { title: "option2", path: "/admin" },
     ],
     path: "/admin",
     icon: "BankOutlined",
     stateNum:4,
   },
   {
     title: "系统设置",
     childData: [
       { title: "option1", path: "/admin" },
       { title: "option2", path: "/admin" },
     ],
     path: "/admin_sys_set",
     icon: "BankOutlined",
     stateNum:0,
   },
 ];
 
