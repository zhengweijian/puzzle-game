export default{
	/**
	 * 洗牌算法
	 */
	shuffle:function (arr) {
		var len = arr.length;
		for(var i=len;i>1;i--){
			var t = Math.round(Math.random()*(i-1));
			//解构赋值
			[arr[i-1],arr[t]] = [arr[t],arr[i-1]]
		}
	},
	
	/**
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
		return count;
	}

}