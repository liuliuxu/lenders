import request from '@/utils/request'
//POST /api/Menu/AddSingleMenu
export function AddSingleMenu(data) {
  return request({
    url: '/api/Menu/AddSingleMenu',
    method: 'post',
    data
  })
}
//POST /api/Menu/DeleteSingleMenu
//删除
export function DeleteSingleMenu(data) {
  return request({
    url: '/api/Menu/DeleteSingleMenu',
    method: 'post',
    data
  })
}
//POST /api/Menu/UpdateSingleMenu
//修改
export function UpdateSingleMenu(data) {
  return request({
    url: '/api/Menu/UpdateSingleMenu',
    method: 'post',
    data
  })
}
//POST /api/Menu/GetAllMenuList
//获取所有菜单列表
export function GetAllMenuList(data) {
  return request({
    url: '/api/Menu/GetAllMenuList',
    method: 'post',
    data
  })
}