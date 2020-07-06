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
    { title:'组织答辩小组', path: '/m_organizeOpendefence' , icon:home },
    { title:'论文审核工作', path: '/m_reviewPaper' , icon:home },
    { title:'查看论文进度', path: '/m_viewProgress' , icon:home },
   ]
