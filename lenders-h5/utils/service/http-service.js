import APP_CONFIG from '../../app-config.js';

class HttpService {
	constructor(arg) {

	}
	/**请求封装
	 * @param {Object} method
	 * @param {Object} url
	 * @param {Object} data
	 */
	request(method, url, data) {
		let $$header = Object.assign({}, this.setHeaders());
		let blank = false;
		if (!blank) {
			uni.showLoading({
				title: 'Loading···',
				mask: false,
			});
		}
		return new Promise((resolve, reject) => {
				uni.request({
					url: `${APP_CONFIG.domain}${url}`,
					method: method,
					data: data || {},
					header: $$header,
					dataType: 'json',
					responseType: 'text',
					success: res => {
						if (!blank) uni.hideLoading();
						resolve(res);
					},
					fail: (err) => {
						if (!blank) uni.hideLoading();
						reject(err);
					},
					complete: () => {}
				});
			})
			.then(res => {
				if (res.statusCode === 200 && res.data && !res.data.err) {
					const result = res.data;
					return result;
				} else if (res.data.err) {
					this.showToast(res.data.err.errmessage);
					throw new Error(`后端接口请求发生异常,请联系服务端处理,请求地址为:${APP_CONFIG.domain}${url}${JSON.stringify(data)}`);
					// return res.data;
				}
				// else if (res.data.code === 1001 || res.data.code === 1002 || res.data.code === 1005 || res.data.code === 3001 || res.data.code === 201) {
				// 	uni.reLaunch({
				// 		url: '/pages/index/index'
				// 	});
				// }
				// if (result.code === 200) {
				// 	return result;
				// } else {
				// 	throw new Error(result);
				// }
			});
	}
	/**
	 * 设置请求的 header , header 中不能设置 Referer
	 */
	setHeaders() {
		return {
			'content-type': 'application/x-www-form-urlencoded', // 默认值
			'Authorization': `${uni.getStorageSync(APP_CONFIG.tokenKey)}`
			 // 'X-Requested-With': 'XMLHttpRequest',
			 // 'Content-Type': 'application/json; charset=UTF-8'
		}
	}

	get(url, params = {}) {
		Object.keys(params).forEach((key, index) => {
			url += index === 0 ? '?' : '&';
			url += `${key}=${encodeURIComponent(params[key])}`;
		});
		return this.request(`GET`, url, '');
	}

	post(url, data) {
		return this.request(`POST`, url, data);
	}

	put(url, data) {
		return this.request(`PUT`, url, data);
	}

	delete(url, data) {
		return this.request(`DELETE`, url, data);
	}

	uploadImageFile(formData) {
		let blank = false;
		if (!blank) {
			uni.showLoading({
				title: 'Loading···',
				mask: false,
			});
		}
		console.log(formData);

		return new Promise((resolve, reject) => {
				uni.uploadFile({
					url: `${APP_CONFIG.domain}`,
					method: 'POST',
					header: {
						"Content-Type": "multipart/form-data",
						// 'Authorization': `${uni.getStorageSync(APP_CONFIG.tokenKey)}`
					},
					name: 'file',
					// filePath: filePath,
					formData: formData || {},
					success: res => {
						if (!blank) uni.hideLoading();
						resolve(res);
					},
					fail: (err) => {
						if (!blank) uni.hideLoading();
						reject(err);
					},
					complete: () => {}
				});
			})
			.then(res => {
				if (typeof res.data === "string") {
					res.data = JSON.parse(res.data);
				}
				if (res.statusCode === 200 && res.data.code === 200) {
					const result = res.data.data;
					return result;
				} else {
					throw new Error(`后端接口请求发生异常,请联系服务端处理,请求地址为:${APP_CONFIG.domain}/api/File/UploadFile`);
				}
			});
	}

	/** 消息弹出框-为提示错误信息用
	 * @param {Object} errorInfo
	 */
	showToast(errorInfo) {
		uni.showToast({
			title: errorInfo,
			icon: 'none',
			duration: 2000,
			success() {
				errorInfo = null;
			}
		});
	}


}
const httpService = new HttpService();
export default httpService;
