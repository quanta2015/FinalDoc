import React from 'react'


export const DATE_FORMAT  = 'YYYY/MM/DD'
export const MONTH_FORMAT = 'YYYY/MM'

import home  from '../icon/icon_setting.svg';

export var MENU_MAIN_T = 
   [{ title:'毕业设计管理', path: '/t_manage' , icon:home },
    { title:'初期命题审核', path: '/t_auditTP', icon:home },
    { title:'中期开题审核', path: '/t_auditOP', icon:home },
    { title:'终期论文审核', path: '/t_auditFD', icon:home }]

export var MENU_MAIN_S = 
   [{ title:'毕业设计管理', path: '/t_manage' , icon:home }]

//学生选课状态
export var STU_ST_STATUS =
   [{ name: '未通过', color: 'red' },
   { name: '待审核', color: 'blue' }]

//学生三阶段所需上传文件
export var FILE_UPLOAD_TYPE = 
   [{ FILE: [{name: '开题报告', type: 'f_open'},  
             {name: '外文翻译', type: 'f_tran'}, 
             {name: '文献综述', type: 'f_docs'},
             {name: '中期检查表', type: 'f_' }] },
    { FILE: [{name: '论文定稿', type: 'f_paper'}, 
             {name: '设计作品', type: 'f_' },
             {name: '作品说明书', type: 'f_'}, 
             {name: '查重报告', type: 'f_check'}, 
             {name: '承诺书', type: 'f_prom'}]},
    { FILE: [{name: '答辩材料', type: 'f_'}, 
             {name: '答辩记录', type: 'f_' },
             {name: '评审答辩成绩表', typr: 'f_'}]}]

//学生文件上传状态
export var STU_FU_STATUS = 
   [{ name: '未通过', color: 'red' },
    { name: '待审核', color: 'blue' }]
