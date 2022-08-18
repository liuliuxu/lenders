import http from './http-service.js';
import App from '../../App';
import APP_CONFIG from '../../app-config.js';
import DatePipe from '../../utils/pipe/date-pipe.js';

class SessionService {
    constructor(arg) {}
	
	fetchNewsInfo(id) {
		return new Promise((resolve, reject) => {
		    http.get(`/api/Backstage/News/Get/${id}`, {})
		        .then((res) => {
		            if (res.data) {
		                resolve(res.data);
		            }
		        })
		        .catch((err) => {
		            reject(err);
		        });
		}).then((res) => {
		    return res;
		});
	}
	
	fetchAgreementInfo(id) {
		return new Promise((resolve, reject) => {
		    http.get(`/api/Backstage/Agreement/Get/${id}`, {})
		        .then((res) => {
		            if (res.data) {
		                resolve(res.data);
		            }
		        })
		        .catch((err) => {
		            reject(err);
		        });
		}).then((res) => {
		    return res;
		});
	}
	
	fetchCustomerServiceInfo() {
		return new Promise((resolve, reject) => {
		    http.get(`/api/Backstage/Set/GetCustomerServiceInformation`, {})
		        .then((res) => {
					if (res.code === 200) {
						if (res.data) {
						    resolve({
								email: res.data.customer_service_email,
								phone: res.data.customer_service_telephone_numbers,
								time: res.data.service_time
							});
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg,
							duration: 2000
						});
					}
		        })
		        .catch((err) => {
		            reject(err);
		        });
		}).then((res) => {
		    return res;
		});
	}
	
	submitFeedback(data) {
		return new Promise((resolve, reject) => {
				http.post(`/api/App/ComplaintFeedback/Add`, data).then(res => {
					console.log(res);
					if (res.code === 200) {
						resolve(res);	
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg,
							duration: 2000
						});
					}
				}).catch(err => {
					reject(err);
				});
			})
			.then(res => {
				return res;
			});
	}
	
	fetchLoanContractInfo(data) {
		return new Promise((resolve, reject) => {
		    http.post(`/app/AppInfo/GetLoanMoneySinge`, data)
		        .then((res) => {
		            if (res.data) {
		                resolve(res.data);
		            }
		        })
		        .catch((err) => {
		            reject(err);
		        });
		}).then((res) => {
		    return res;
		});
	}
	
	
	/** 发送验证码
	 * @param {Object} data
	 */
	sendCellphoneVerfiyCode(data) {
		return new Promise((resolve, reject) => {
				http.post(`/api/Common/Sms/SendLoginSms`, data).then(res => {
					console.log(res);
					resolve(res);
				}).catch(err => {
					reject(err);
				});
			})
			.then(res => {
				return res;
			});
	}
	
	/**
	 * 登录
	 */
	login(data) {
		return new Promise((resolve, reject) => {
				http.post(`/api/App/User/Login`, data).then(res => {
					if (res.code === 200) {
						uni.showToast({
							title: '注册成功',
							duration: 2000
						});
						resolve(true);
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg,
							duration: 2000
						});
					}
				}).catch(err => {
					reject(err);
				});
			})
			.then(res => {
				return res;
			});
	}
}

const sessionService = new SessionService();
export default sessionService;
