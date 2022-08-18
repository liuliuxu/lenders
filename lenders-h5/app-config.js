const APP_CONFIG = {
    tokenKey: 'token', // 后端验证令牌字段
//     domain: 'http://192.168.1.109:6003', // 本地请求地址
	domain: '', // HTTPS请求地址
//	 domain: 'https://wx.51renwu.net', // HTTPS请求地址
    storageKeys: {
        token: 'token',
        userInfo: 'userInfo',
        historicRecords: 'historicRecords',
		userName: 'userName',
		currentCity: 'currentCity',
		positionAddress: 'positionAddress',
		workAddress: 'workAddress'
    }
};
export default APP_CONFIG;
