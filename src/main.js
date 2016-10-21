import Vue from 'vue'
import App from './App.vue'
import moment from 'moment';

Vue.filter('fm',function (timestamp, format) {
	var result;
	timestamp = parseInt(timestamp);
	if (!timestamp){
		result = '-';
	} else if (format) {
		result = moment(timestamp).format(format);
	} else {
		result = moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
	}
	//console.log(result);
	return result;
});

var vm = new Vue({
	el: '#app',
	render: h => h(App)
});

