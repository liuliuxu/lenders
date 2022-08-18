// export const baseURL = 'http://47.106.208.228:6060/' //192.168.1.124
var topURL = 'http://api.instantloan.io/' //192.168.1.124
if(window.location.origin&&window.location.origin.indexOf('http')>-1&&window.location.origin.indexOf('localhost')==-1){
	topURL=window.location.origin+'/';
}

export const baseURL = topURL
