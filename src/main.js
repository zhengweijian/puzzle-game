import Vue from 'vue'
import App from './App.vue'
import moment from 'moment';

Vue.filter('fm',function (timestamp, format) {
	var result;

	timestamp = parseInt(timestamp);
	console.log(timestamp,format);

	if (!timestamp){
		result = '-';
	} else if (format) {
		result = moment(timestamp).format(format);
	} else {
		result = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
	}
	console.log(result);
	return result;
});

//语法改变 youvalue | wrap('begin','after')
Vue.filter('wrap', function (value, begin, end) {
	return begin + value + end
})
Vue.filter('reverse', function (value) {
	console.log('reverse');
	return value.split('').reverse().join('')
})

var vm = new Vue({
	el: '#app',
	render: h => h(App)
});

