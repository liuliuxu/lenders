import request from '@/utils/request'
//POST /api/Channel/AddSingelChannel
//新增
export function AddSingelChannel(data) {
  return request({
    url: '/api/Channel/AddSingelChannel',
    method: 'post',
    data
  })
}
//POST /api/Channel/DeleteSingelChannel
//删除
export function DeleteSingelChannel(data) {
  return request({
    url: '/api/Channel/DeleteSingelChannel',
    method: 'post',
    data
  })
}
//POST /api/Channel/UpdateSingelChannel
//修改
export function UpdateSingelChannel(data) {
  return request({
    url: '/api/Channel/UpdateSingelChannel',
    method: 'post',
    data
  })
}
//POST /api/Channel/AddSingleUser
//查询
export function AddSingleUser(data) {
  return request({
    url: '/api/Channel/AddSingleUser',
    method: 'post',
    data
  })
}


// 推荐产品管理
//POST  /api/RecommendProduct/AddRecommendProduct
//新增
export function AddProduct(data) {
  return request({
    url: '/api/RecommendProduct/AddRecommendProduct',
    method: 'post',
    data,
    headers: { "content-type": "application/x-www-form-urlencoded" },
  })
}
//POST /api/RecommendProduct/DeleteRecommendProduct
//删除
export function DeleteProduct(data) {
  return request({
    url: '/api/RecommendProduct/DeleteRecommendProduct',
    method: 'post',
    data
  })
}
//POST /api/Channel/UpdateSingelChannel
//修改
export function UpdateProduct(data) {
  return request({
    url: '/api/RecommendProduct/UpdateRecommendProduct',
    method: 'post',
    data,
    headers: { "content-type": "application/x-www-form-urlencoded" },
  })
}
//POST /api/RecommendProduct/QueryRecommendProduct
//查询
export function CheckProduct(data) {
  return request({
    url: '/api/RecommendProduct/QueryRecommendProduct',
    method: 'post',
    data
  })
}