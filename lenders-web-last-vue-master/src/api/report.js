import request from '@/utils/request'

// POST /api/mydata/GetOperateReportInfo
// 简化运营报表
export function GetOperateReportInfo(data) {
    return request({
        url: '/api/mydata/GetOperateReportInfo',
        method: 'post',
        data
    })
}

// POST /api/mydata/GetFineceReportInfo
// 财务报表
export function GetFineceReportInfo(data) {
    return request({
        url: '/api/mydata/GetFineceReportInfo',
        method: 'post',
        data
    })
};

// POST /api/mydata/GetLoaningReportInfo
// 贷中报表
export function GetLoaningReportInfo(data) {
    return request({
        url: '/api/mydata/GetLoaningReportInfo',
        method: 'post',
        data
    })
}

// POST /api/mydata/GetD0CollectionReportInfo
// D0催收报表
export function GetD0CollectionReportInfo(data) {
    return request({
        url: '/api/mydata/GetD0CollectionReportInfo',
        method: 'post',
        data
    })
}

// POST /api/mydata/GetS1CollectionReportInfo
// D0催收报表
export function GetS1CollectionReportInfo(data) {
    return request({
        url: '/api/mydata/GetS1CollectionReportInfo',
        method: 'post',
        data
    })
}

// POST /api/mydata/GetCollectionTags
// 获取催收S1T0标签列表
export function GetCollectionTags(data) {
    return request({
        url: '/api/mydata/GetCollectionTags',
        method: 'post',
        data
    })
}


// POST api/mydata/GetD_1CollectionReportInfo
// D-1业绩报表
export function GetF1CollectionReportInfo(data) {
    return request({
        url: 'api/mydata/GetD_1CollectionReportInfo',
        method: 'post',
        data
    })
}