import React from 'react'


export const DATE_FORMAT  = 'YYYY/MM/DD'
export const MONTH_FORMAT = 'YYYY/MM'

import home  from '../icon/icon_setting.svg';

export var MENU_MAIN_T = 
   [{ title:'毕业设计管理', path: '/t_manage' , icon:home },
    { title:'初期命题审核', path: '/t_auditTP', icon:home },
    { title:'中期开题审核', path: '/t_auditOP', icon:home },
    { title:'终期论文审核', path: '/t_auditFD', icon:home }]

export var MENU_MAIN_M = 
   [{ title:'分配审核选题', path: '/m_distributeTopic' , icon:home },
    { title:'组织开题答辩', path: '/m_organizeOpendefence' , icon:home },
    { title:'组织最终答辩', path: '/m_organizeFinaldefence' , icon:home },
    { title:'查看论文进度', path: '/m_viewProgress' , icon:home },
   ]
export var MENU_MAIN_S = 
   [{ title:'毕业设计管理', path: '/t_manage' , icon:home }]

//学生选课状态
export var STU_ST_STATUS =
   [{ name: '未通过', color: 'red' },
   { name: '待审核', color: 'blue' }]

//学生三阶段所需上传文件
export var FILE_UPLOAD_TYPE = 
   [{ stage: '1. 开题中期', 
      file: [{name: '开题报告', type: 'f_open'},  
             {name: '外文翻译', type: 'f_tran'}, 
             {name: '文献综述', type: 'f_docs'},
             {name: '中期检查表', type: 'f_' }] },
    { stage: '2. 论文审核',
      file: [{name: '论文定稿', type: 'f_paper'}, 
             {name: '设计作品', type: 'f_' },
             {name: '作品说明书', type: 'f_'}, 
             {name: '查重报告', type: 'f_check'}, 
             {name: '承诺书', type: 'f_prom'}]},
    { stage: '3. 论文答辩',
      file: [{name: '答辩材料', type: 'f_'}, 
             {name: '答辩记录', type: 'f_' },
             {name: '答辩成绩表', type: 'f_'},
             {name: '延缓申请表', type: 'f_' }]}]

//学生文件上传状态
export var STU_FU_STATUS = 
   [{ name: '未完成', color: '' },
    { name: '待审核', color: 'blue' },
    { name: '待修改', color: 'red' },
    { name: '已通过', color: 'green' }
   ]

//文件上传类型约束
export var FILE_UPLOAD_FORMAT = 
   {reply: ['zip', 'ppt', 'pptx'],
    doc: ['doc', 'docx', 'pdf']}
