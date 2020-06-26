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

export var STU_ST_STATUS =
   [{ name: '未通过', color: 'red' },
   { name: '待审核', color: 'blue' }]
