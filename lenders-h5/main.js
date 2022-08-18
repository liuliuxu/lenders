import Vue from 'vue'
import App from './App'
import APP_CONFIG from './app-config.js';
import DatePipe from './utils/pipe/date-pipe.js';
import HttpService from './utils/service/http-service.js';
import SessionService from './utils/service/session-service.js';

Vue.config.productionTip = false;
Vue.prototype.APP_CONFIG = APP_CONFIG;
Vue.prototype.datePipe = DatePipe;
Vue.prototype.http = HttpService;
Vue.prototype.sessionService = SessionService;

App.mpType = 'app';
if (process.env.NODE_ENV === 'development') {
	console.log('开发环境');
	// APP_CONFIG.domain = 'https://api.instantloan.io';
	// APP_CONFIG.domain = 'http://185.105.1.245:6001';
	// APP_CONFIG.domain = 'https://api.rocketcash.xyz';
	APP_CONFIG.domain = 'https://api.instantloan.pics';
} else {
	console.log('生产环境');
	// APP_CONFIG.domain = 'http://185.105.1.245:6006';
	// APP_CONFIG.domain = 'http://185.105.1.245:6011';
	// APP_CONFIG.domain = 'http://185.105.1.166:6306';
	// APP_CONFIG.domain = 'https://api.instantloan.ink';
	APP_CONFIG.domain = 'https://api.luckyloan.xyz';
	// APP_CONFIG.domain = 'https://api.rocketcash.pics';
	// APP_CONFIG.domain = 'https://api.instantloan.io';
	// APP_CONFIG.domain = 'http://api.instantloan.io';
	// APP_CONFIG.domain = 'http://121.196.20.0';
	// APP_CONFIG.domain = 'http://api.rupeesite.com';
}

const app = new Vue({
    ...App
})
app.$mount()
