export default{
	//洗牌算法
	shuffle:function (arr) {
		var len = arr.length;
		for(var i=len;i>1;i--){
			var t = Math.round(Math.random()*(i-1));
			//解构赋值
			[arr[i-1],arr[t]] = [arr[t],arr[i-1]]
		}
	},
	
	/*
	 * 逆序数数量
	 *
	 */
	revNum:function (arr,propName) {
		let count = 0;
		for(var i=0;i<arr.length;i++){
			for(var j=i+1;j<arr.length;j++){
				if(arr[i][propName]>arr[j][propName]) count+=1;
			}
		}
		console.log(count);
		return count;
	},
	
	/**
	 * 根据逆序数奇偶性判断能否有解
	 * http://blog.csdn.net/kaikai4/article/details/51426940
	 */
	test:function () {
		var arr = [];
		for(var i = 1; i<16;i++){
			arr.push(i);
		}
		console.log(this.revNum(arr));//pass
		[arr[11],arr[14]] = [arr[14],arr[11]];  // 11 , 15
		console.log(this.revNum(arr));//not pass   12
		[arr[11],arr[14]] = [arr[14],arr[11]];//   11 , 12
		console.log(this.revNum(arr));//pass       15
		[arr[10],arr[11]] = [arr[11],arr[10]];   // 12 , 11
		console.log(this.revNum(arr));//not pass    15
		[arr[11],arr[14]] = [arr[14],arr[11]];   // 12 ,15
		console.log(this.revNum(arr));//pass        11
	}
}