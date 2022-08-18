import request from '@/utils/request'

//POST /api/Role/AddSingleRole
//新增
export function AddSingleRole(data) {
  return request({
    url: '/api/Role/AddSingleRole',
    method: 'post',
    data
  })
}
///api/Role/DeleteSingleRole
//删除
export function DeleteSingleRole(data) {
  return request({
    url: '/api/Role/DeleteSingleRole',
    method: 'post',
    data
  })
}
//POST /api/Role/UpdateSingleRole
//修改
export function UpdateSingleRole(data) {
  return request({
    url: '/api/Role/UpdateSingleRole',
    method: 'post',
    data
  })
}
export const apiPer = {
  AddSingleRole,
  UpdateSingleRole
}
//POST /api/Role/GetRoleList
//获取角色列表
export function GetRoleList(data) {
  return request({
    url: '/api/Role/GetRoleList',
    method: 'post',
    data
  })
}
///api/Role/RoleAddMenuList
//新增角色页面
export function RoleAddMenuList(data) {
  return request({
    url: '/api/Role/RoleAddMenuList',
    method: 'post',
    data
  })
}