import request from '@/utils/request'
//POST /api/WhiteList/UpdateWhiteUser
export function UpdateWhiteUser(data) {
  return request({
    url: '/api/WhiteList/UpdateWhiteUser',
    method: 'post',
    data
  })
}
//POST /api/WhiteList/GetAllWhiteUserList
//获取用户信息
export function GetAllWhiteUserList(data) {
  return request({
    url: '/api/WhiteList/GetAllWhiteUserList',
    method: 'post',
    data
  })
}
//POST /api/WhiteList/CollectionWhiteList
//催收白名单列表
export function CollectionWhiteList(data) {
  return request({
    url: '/api/WhiteList/CollectionWhiteList',
    method: 'post',
    data
  })
}
//POST /api/WhiteList/GetWhiteListAllotList
//白名单分配列表
export function GetWhiteListAllotList(data) {
  return request({
    url: '/api/mydata/GetWhiteListAllotList',
    method: 'post',
    data
  })
}
//POST /api/WhiteList/SearchSendedWhiteListSms
//白名单短信发送列表
export function SearchSendedWhiteListSms(data) {
  return request({
    url: '/api/WhiteList/SearchSendedWhiteListSms',
    method: 'post',
    data
  })
}
//POST /api/WhiteList/UploadWhiteListExcel
//白名单短信发送列表---上传白名单
export function UploadWhiteListExcel(data) {
  return request({
    url: '/api/WhiteList/UploadWhiteListExcel',
    method: 'post',
    data,
    headers: { "content-type": "application/x-www-form-urlencoded" },
  })
}
//POST /api/WhiteList/SendWhiteListSms
//白名单短信发送列表---发送白名单短信
export function SendWhiteListSms(data) {
  return request({
    url: '/api/WhiteList/SendWhiteListSms',
    method: 'post',
    data,
  })
}
//POST /api/WhiteList/CollectionAllot
//白名单催收分配
export function CollectionAllot(data) {
  return request({
    url: '/api/WhiteList/CollectionAllot',
    method: 'post',
    data
  })
}

// POST /api/WhiteList/AddWhiteSinge
// 新增白名单
export function AddWhiteSinge(data) {
  return request({
    url: '/api/WhiteList/AddWhiteSinge',
    method: 'post',
    data
  })
}

// POST /api/WhiteList/CollectionRemarkWhiteList
// 催收登记备注
export function CollectionRemarkWhiteList(data) {
  return request({
    url: '/api/WhiteList/CollectionRemarkWhiteList',
    method: 'post',
    data
  })
}

// POST /api/WhiteList/WightClick
// 查看手机号
export function WightClick(data) {
  return request({
    url: '/api/WhiteList/WightClick',
    method: 'post',
    data
  })
}
