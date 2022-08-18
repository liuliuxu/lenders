import request from '@/utils/request';
/**
 *获取id
 */
function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

export function login(data) {
  return request({
    url: '/api/Intelligence/GetToken',
    method: 'post',
    data: {...data, GUID: guid()}
  })
}

export function getMenuList(data) {
  return request({
    url: '/api/Menu/GetMenuList',
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

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

//POST /api/User/GetCollectionManList
//催收人员列表
export function GetCollectionManList(data) {
  return request({
    url: '/api/User/GetCollectionManList',
    method: 'post',
	data
  })
}
//POST /api/mydata/GetCollectionManList
//催收人员列表-白名单
export function GetCollectionManListBMD(data) {
  return request({
    url: '/api/mydata/GetWhiteListManList',
    method: 'post',
	data
  })
}
//POST /api/mydata/CollectionTotalList
//催收总订单列表
export function CollectionTotalList(data) {
  return request({
    url: '/api/mydata/CollectionTotalList',
    method: 'post',
	data
  })
}
//POST /api/mydata/CollectionList
//催收订单列表
export function CollectionList(data) {
  return request({
    url: '/api/mydata/CollectionList',
    method: 'post',
	data
  })
}
//POST /api/mydata/CollectionSucced
//催收成功列表
export function CollectionSucced(data) {
  return request({
    url: '/api/mydata/CollectionSucced',
    method: 'post',
	data
  })
}

//POST /api/mydata/CollectionNewList
// s3催收总订单列表
export function CollectionNewList(data) {
  return request({
    url: '/api/mydata/CollectionNewList',
    method: 'post',
    data
  })
}

//POST /api/mydata/S3Detailed
// s3催收订单列表
export function S3Detailed(data) {
  return request({
    url: '/api/mydata/S3Detailed',
    method: 'post',
    data
  })
}


//POST /api/User/GetUserList
//获取用户列表
export function GetUserList(data) {
  return request({
    url: '/api/User/GetUserList',
    method: 'post',
	data
  })
}
//POST /api/User/AddSingleUser
//新增
export function AddSingleUser(data) {
  return request({
    url: '/api/User/AddSingleUser',
    method: 'post',
	data
  })
}
//POST /api/User/UpdateSingleUser
//修改
export function UpdateSingleUser(data) {
  return request({
    url: '/api/User/UpdateSingleUser',
    method: 'post',
	data
  })
}

// POST /api/User/GetConnectionGroupyList
// 获取所有分组用户
export function GetConnectionGroupyList(data) {
  return request({
    url: '/api/User/GetConnectionGroupyList',
    method: 'post',
    data
  })
}

//POST /api/User/GetAppUserInfoList
//获取借款用户信息列表
export function GetAppUserInfoList(data) {
  return request({
    url: '/api/User/GetAppUserInfoList',
    method: 'post',
	data
  })
}
//POST /api/User/GetAppUserInfo
//获取借款用户信息
export function GetAppUserInfo(data) {
  return request({
    url: '/api/User/GetAppUserInfo',
    method: 'post',
	data
  })
}
//POST /api/User/GetAppUpLoadList
//获取app列表
export function GetAppUpLoadList(data) {
  return request({
    url: '/api/User/GetAppUpLoadList',
    method: 'post',
	data
  })
}
//POST /api/User/GetMailUpLoadList
//获取通讯录列表
export function GetMailUpLoadList(data) {
  return request({
    url: '/api/User/GetMailUpLoadList',
    method: 'post',
	data
  })
}
//POST /api/User/GetMsgUpLoadList
//获取短信列表
export function GetMsgUpLoadList(data) {
  return request({
    url: '/api/User/GetMsgUpLoadList',
    method: 'post',
	data
  })
}
//POST /api/User/GetCertInfoList
//获取用户认证状态
export function GetCertInfoList(data) {
  return request({
    url: '/api/User/GetCertInfoList',
    method: 'post',
	data
  })
}
//POST /api/User/GetRomplaintOutInfoList
//获取投诉列表
export function GetRomplaintOutInfoList(data) {
  return request({
    url: '/api/User/GetRomplaintOutInfoList',
    method: 'post',
	data
  })
}
//POST /api/User/GetFeedbackInfoList
//获取反馈列表
export function GetFeedbackInfoList(data) {
  return request({
    url: '/api/User/GetFeedbackInfoList',
    method: 'post',
	data
  })
}

// POST /api/User/AddReplyContent
// 添加投诉反馈
export function AddReplyContent(data) {
  return request({
    url: '/api/User/AddReplyContent',
    method: 'post',
    data
  })
}

//POST /api/User/AllotCollection
// 分配催收
export function AllotCollection(data) {
  return request({
    url: '/api/User/AllotCollection',
    method: 'post',
    data
  })
}

// POST /api/mydata/SetCollRemark
// 催收备注
export function SetCollRemark(data) {
  return request({
    url: '/api/mydata/SetCollRemark',
    method: 'post',
    data
  })
}

// POST /api/User/SearchCollRemark
// 催收备注查看
export function SearchCollRemark(data) {
  return request({
    url: '/api/User/SearchCollRemark',
    method: 'post',
    data
  })
}

// POST /api/Sms/SendLoanQuality
// 发送电销贷款质量短信
export function SendLoanQuality(data) {
  return request({
    url: '/api/Sms/SendLoanQuality',
    method: 'post',
    data
  })
}

// POST /api/Sms/SendRepaymentLoans
// 发送催收偿还贷款的短信
export function SendRepaymentLoans(data) {
  return request({
    url: '/api/Sms/SendRepaymentLoans',
    method: 'post',
    data
  })
}

// POST /api/User/CollectionMobileClick
// 催收订单手机号点击
export function CollectionMobileClick(data) {
  return request({
    url: '/api/User/CollectionMobileClick',
    method: 'post',
    data
  })
}

//POST /api/mydata/D0CollectionTotalList
//D0催收总订单列表
export function D0CollectionTotalList(data) {
  return request({
    url: '/api/mydata/D0CollectionTotalList',
    method: 'post',
    data
  })
}

//POST /api/mydata/D0CollectionList
//D0催收订单列表
export function D0CollectionList(data) {
  return request({
    url: '/api/mydata/D0CollectionList',
    method: 'post',
    data
  })
}

//POST /api/mydata/DMinus1CollectionTotalList
//D-1催收总订单列表
export function DF1CollectionTotalList(data) {
  return request({
    url: '/api/mydata/DMinus1CollectionTotalList',
    method: 'post',
    data
  })
}

//POST /api/mydata/DMinus1CollectionList
//D-1催收订单列表
export function DF1CollectionList(data) {
  return request({
    url: '/api/mydata/DMinus1CollectionList',
    method: 'post',
    data
  })
}

//POST /api/WebPayment/GetGlobPayRepaymentLink
//获取还款链接
export function GetGlobPayRepaymentLink(data) {
  return request({
    url: '/api/WebPayment/GetGlobPayRepaymentLink',
    method: 'post',
    data
  })
}

//POST /api/WebPayment/GetGlobPayRenewRepaymentLink
//获取展期链接
export function GetGlobPayRenewRepaymentLink(data) {
  return request({
    url: '/api/WebPayment/GetGlobPayRenewRepaymentLink',
    method: 'post',
    data
  })
}

//POST /api/User/DMinus1AllotCollection
// D-1总订单分配催收
export function DMinus1AllotCollection(data) {
  return request({
    url: '/api/User/DMinus1AllotCollection',
    method: 'post',
    data
  })
}

//POST /api/User/D0AllotCollection
// D0分配催收
export function D0AllotCollection(data) {
  return request({
    url: '/api/User/D0AllotCollection',
    method: 'post',
    data
  })
}

//POST api/User/S3AllotCollection
// D3分配催收
export function D3AllotCollection(data) {
  return request({
    url: 'api/User/S3AllotCollection',
    method: 'post',
    data
  })
}

// POST /api/WhiteList/GetMailList
// 通讯录拉取
export function GetMailList(data) {
  return request({
    url: '/api/WhiteList/GetMailList',
    method: 'post',
    data
  })
}

// POST /api/mydata/updateUserPwd
// 修改密码
export function updateUserPwd(data) {
  return request({
    url: '/api/mydata/updateUserPwd',
    method: 'post',
    data
  })
}
