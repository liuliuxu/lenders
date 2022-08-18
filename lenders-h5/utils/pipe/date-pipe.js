import moment from 'moment';
class DatePipe {
	constructor() {
	    // console.log(moment());
	}
	dateFilter(date, format = 'YYYY-MM-DD HH:mm:ss') {
		if (!date) {
			throw new Error(`必须传递日期对象`);
		}
		const formatFilterStr = moment(date).format(format);
		return formatFilterStr;
	}
	/**
	 * 获取时间差
	 */
	getTimeDifference(op, time1, time2 = new Date()) {
	  let num1 = Number(new Date(time1));
	  let num2 = Number(new Date(time2));
	  let diff = op === 1 ? (num1 - num2) : (num2 - num1);
	  let days = parseInt(diff / (1000 * 60 * 60 * 24));
	  let hours = parseInt((diff - (1000 * 60 * 60 * 24 * days)) / (1000 * 60 * 60));
	  let mins = parseInt((diff - (1000 * 60 * 60 * 24 * days) - (1000 * 60 * 60 * hours)) / (1000 * 60));
	  if (days >= 30) {
	    return '30天前';
	  } else if (days > 0 && days < 30) {
	    return days + '天前';
	  } else if (hours > 0) {
	    return hours + '小时前';
	  } else if (mins > 0) {
	    return mins + '分钟前';
	  } else {
	    return '1分钟内';
	  }
	}
}
const datePipe = new DatePipe();
export default datePipe;