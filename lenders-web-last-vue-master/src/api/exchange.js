import request from '@/utils/request'
//获取借款申请列表
export function GetApplyMoneyList(data) {
  return request({
    url: '/api/Exchange/GetApplyMoneyList',
    method: 'post',
    data
  })
}
//POST /api/Exchange/GetRecordList
//获取放款记录列表
export function GetRecordList(data) {
  return request({
    url: '/api/Exchange/GetRecordList',
    method: 'post',
    data
  })
}
//POST /api/Exchange/GetPayList
//获取收支记录
export function GetPayList(data) {
  return request({
    url: '/api/Exchange/GetPayList',
    method: 'post',
    data
  })
}
//POST /api/Exchange/GetRepaymentList
//获取还款记录
export function GetRepaymentList(data) {
  return request({
    url: '/api/Exchange/GetRepaymentList',
    method: 'post',
    data
  })
}

//POST /api/Exchange/QueryRenewList
//获取展期记录
export function QueryRenewList(data) {
  return request({
    url: '/api/Exchange/QueryRenewList',
    method: 'post',
    data
  })
}

// POST /api/Exchange/GetLoanAuditList 借款审核列表
// 借款审核列表
export function GetLoanAuditList(data) {
  return request({
    url: '/api/Exchange/GetLoanAuditList',
    method: 'post',
    data
  })
}

// POST /api/Exchange/LoanAudit
// 借款审核
export function LoanAudit(data) {
  return request({
    url: '/api/Exchange/LoanAudit',
    method: 'post',
    data
  })
}

// POST /api/Exchange/ManualChargeOffs
// 手工销账
export function ManualChargeOffs(data) {
  return request({
    url: '/api/Exchange/ManualChargeOffs',
    method: 'post',
    data
  })
}

// POST api/Exchange/Rollover
// 展期
export function Rollover(data) {
  return request({
    url: 'api/Exchange/Rollover',
    method: 'post',
    data
  })
}

// POST /api/mydata/ChangeDeductionAmount
// 减免
export function ChangeDeductionAmount(data) {
  return request({
    url: '/api/mydata/ChangeDeductionAmount',
    method: 'post',
    data
  })
}

// POST /api/mydata/GetChangeDeductionInfo
// 获取减免信息接口
export function GetChangeDeductionInfo(data) {
  return request({
    url: '/api/mydata/GetChangeDeductionInfo',
    method: 'post',
    data
  })
}

// POST /api/Exchange/QueryLoanPayment
// 查询支付商放款状态
export function QueryLoanPayment(data) {
  return request({
    url: '/api/Exchange/QueryLoanPayment',
    method: 'post',
    data
  })
}

// POST /api/Exchange/QueryRepaymentList
// 查询支付商还款状态
export function QueryRepaymentList(data) {
  return request({
    url: '/api/Exchange/QueryRepaymentList',
    method: 'post',
    data
  })
}

// POST /api/Exchange/ApplyRejectUpdateInReview
// 将拒绝支付改成审核中
export function ApplyRejectUpdateInReview(data) {
  return request({
    url: '/api/Exchange/ApplyRejectUpdateInReview',
    method: 'post',
    data
  })
}

// POST /api/Exchange/ApplyApprovedUpdateInReview
// 审核通过且支付失败改为审核中
export function ApplyApprovedUpdateInReview(data) {
  return request({
    url: '/api/Exchange/ApplyApprovedUpdateInReview',
    method: 'post',
    data
  })
}