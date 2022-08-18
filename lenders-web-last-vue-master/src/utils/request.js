import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { baseURL } from '@/utils/config'
import router from '@/router'
// create an axios instance
/**
 *获取id
 */
function guid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		const r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
}

const service = axios.create({
	// baseURL: 'https://api.rocketcash.xyz', // url = base url + request url
	baseURL: 'http://185.105.1.245:6006', // 目标服务器
	// baseURL: 'http://185.105.1.245:6011', // 目标服务器
	// baseURL: 'http://185.105.1.166:6306', // 目标服务器
//   baseURL: 'http://185.105.1.245:6001', // url = base url + request url
//   baseURL: 'https://api.instantloan.io', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
	headers: {
		'Content-Type': 'application/json;charset=UTF-8'
	},
  	timeout: 200000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers.SessionToken = getToken();
    }
    // if (typeof config.data === 'string') {
	// 	config.data = JSON.parse(config.data);
	// }
	//   config.data = {
	// 	  ...config.data,
	// 	  GUID: guid
	//   };
    // console.warn(config);
    return config;
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
	//   console.warn(res.error.ErrorCode==1110);
    if (res.error.ErrorCode !== 0) {
		if(res.error.ErrorCode==1001){ 
			Message({
				message: res.error.ErrorMsg,
				type: 'error',
				duration: 5 * 1000
			})
			// MessageBox('接口调用失败, 是否跳转至登录页?', '提示', {
			// 	confirmButtonText: '确定',
			// 	cancelButtonText: '取消',
			// 	type: 'warning'
			// }).then(() => {
			// 	store.dispatch('user/resetToken').then(()=>{
			// 		router.push('/login')
			// 	})
			// }).catch(() => {
			// });
			return Promise.reject(new Error(res.error.ErrorMsg || 'Error'));
		}else if(res.error.ErrorCode==1110){
			Message({
				message: res.error.ErrorMsg,
				type: 'error',
				duration: 5 * 1000
			})
			// store.dispatch('user/resetToken').then(()=>{
			// 	router.push('/login')
			// })
			return Promise.reject(new Error(res.error.ErrorMsg || 'Error'));
		}else if(res.error.ErrorCode==1110){
			Message({
				message: res.error.ErrorMsg,
				type: 'error',
				duration: 5 * 1000
			});
			// store.dispatch('user/resetToken').then(()=>{
			// 	router.push('/login')
			// });
			return Promise.reject(new Error(res.error.ErrorMsg || 'Error'));
		}else{
			Message({
				message: res.error.ErrorMsg,
				type: 'error',
				duration: 5 * 1000
			});
			return Promise.reject(new Error(res.error.ErrorMsg || 'Error'));
		}
    } else {
      return res;
    }
  },
  error => {
  	// console.warn(error.response.data.error.ErrorCode==1110, typeof error, JSON.stringify(error));
    // console.log('er1111r' + error, error === 'Error: Request failed with status code 401') // for debug
	  if (error.response.data && error.response.data.error && error.response.data.error.ErrorCode==1110) {
		  store.dispatch('user/resetToken').then(()=>{
		    router.push('/login');
		  });
	  }
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    });
    return Promise.reject(error)
  }
);

export default service
