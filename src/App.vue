
<style>
	* {
		box-sizing: border-box;
	}
	.row:after {
		content: "";
		clear: both;
		display: block;
	}
	[class*="col-"] {
		float: left;
	}

	/* For mobile phones: */
	[class*="col-"] {
		width: 100%;
	}
	@media only screen and (min-width: 768px) {
		/* For desktop: */
		.col-1 {width: 8.33%;}
		.col-2 {width: 16.66%;}
		.col-3 {width: 25%;}
		.col-4 {width: 33.33%;}
		.col-5 {width: 41.66%;}
		.col-6 {width: 50%;}
		.col-7 {width: 58.33%;}
		.col-8 {width: 66.66%;}
		.col-9 {width: 75%;}
		.col-10 {width: 83.33%;}
		.col-11 {width: 91.66%;}
		.col-12 {width: 100%;}
	}

	body{
		font-family: Arial,"Microsoft YaHei UI";
	}

	/*puzzle*/
	.btn{
		/*box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);*/
	}
	.btn-reset {
		float:right;
		margin-right:15px;
	}

	.puzzle-type{

	}
	.puzzle-box{

	}
	.puzzle-box .box-title{
		padding:20px 30px;
	}
	.puzzle-box .box-content{
		width:100%;
		max-width:500px;
	}
	.puzzle-wrap{
		padding: 0;
		width:360px;
		background: #ccc;
		list-style: none;
	}
	/* li */
	.puzzle {
		float: left;
		width:90px;
		height:90px;
		box-shadow: 1px 1px 4px;
		text-shadow: 1px 1px 1px #B9B4B4;
		cursor: pointer;
	}
	.puzzle .number{
		font-size: 20px;
		background: #f90;
		text-align: center;
		width:100%;
		height:100%;
		border: 1px solid #ccc;
	}
	.puzzle-empty {
		background: #ccc;
		box-shadow: inset 2px 2px 18px;
	}

	.puzzle-history table{
		width: 100%;
	}
	.puzzle-history h2{

	}
</style>

<template>
<div id="app">
	<div class="puzzle-type col-3">
		<!--选择类型-->
		<ol>
			<li>
				<input id="type-num" name="type" value="0" v-model="type" type="radio">
				<label for="type-num">数字样式</label>
			</li>
			<li>
				<input id="type-pic1" name="type" value="1" v-model="type" type="radio">
				<label for="type-pic1">图片样式</label>
			</li>
		</ol>
		<div>
			<p v-if="type==1">
				<img src="src/assets/img/katong/katong_all.jpg" alt="" width="200px" height="200px">
			</p>
		</div>
	</div>
	<div class="puzzle-box col-6">
		<div class="row box-title">
			计时：<timer :time="beginTime"></timer>
			<button class="btn btn-reset" @click="render">重置游戏</button>
		</div>

		<div class="box-content">
			<ul class="puzzle-wrap" id="puzzle-warp">
				<li class="puzzle" :class="{'puzzle-empty':!puzzle}"
				    v-for="(puzzle,index) in puzzles"
				    @click="moveFn(index)">
					<!--数字样式-->
					<div class="number" v-if="type==0">
						{{puzzle.idx}}
					</div>
					<!--图片样式-->
					<template v-if="type==1">
						<img width="100%" height="100%" :src="puzzle.image" />
					</template>
				</li>
			</ul>
		</div>
	</div>
	<div class="puzzle-history col-3">
		<h2>历史记录</h2>
		<table>
			<thead>
			<tr>
				<th>排序</th>
				<th>名字</th>
				<th>耗时</th>
				<th>记录时间</th>
				<th>操作</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="(record,index) in records">
				<td>{{index+1}}</td>
				<td>{{record.name}}</td>
				<td>{{record.elapsedTime | fm('mm分ss秒')}}</td>
				<td>{{record.completedTime | fm('YYYY-MM-DD')}}</td>
				<td><button @click="deleteRecord(index,record)">删除记录</button></td>
			</tr>
			</tbody>
		</table>
	</div>
</div>
</template>


<script>
import Timer from './components/Timer.vue';
import Store from './store';
import Lib from './lib';

export default{
	data(){
		return {
			puzzles:[],
			loading:false,
			beginTime: null,
			type : 1,
			pass : false,
			records : [],
			STORE_KEY :'RECORDS'
		}
	},
	components:{
		'Timer' : Timer
	},
	methods:{
		//随机渲染
		render: function () {
			this.loading=true;//loading

			let puzzleArr = [];
			for(var i=1;i<16;i++){
				puzzleArr.push({idx:i,image:'src/assets/img/katong/katong_'+i+'.jpg'});
			}

			let invalid = true;//无法通关
			do{
				Lib.shuffle(puzzleArr);//shuffle
				let ret = Lib.revNum(puzzleArr,'idx');
				invalid = ret%2;//奇数 无效 无法通关
			}while(invalid);

			puzzleArr.push('');
			this.puzzles = puzzleArr;
			//更改计时器开始时间
			this.beginTime = new Date().getTime();

			this.passJudge();//天胡？

			this.loading=false;
			this.pass=false;
		},
		//点击方块移动
		moveFn:function (index) {

			if(this.loading || this.pass){
				console.log("loading... or passed")
				return;
			}
			let moveTos = [index-4,index+4,index-1,index+1];
			for(var i=0;i<moveTos.length;i++){
				this.move(index,moveTos[i]);
			}
		},
		move:function (index, moveTo) {
			let puzzleArr = this.puzzles;//$set无法使用，用splice替代
			if(moveTo>=0 && moveTo<puzzleArr.length && puzzleArr[moveTo]===''){
				this.loading = true;
				puzzleArr.splice(moveTo,1,puzzleArr[index]);
				puzzleArr.splice(index,1,'');
				this.passJudge();//judge pass
				this.loading = false;
				console.log('success move ',index,'->',moveTo,);
			}
		},
		//通关判断
		passJudge : function () {
			if (this.puzzles[15] === '') {
				const newPuzzles = this.puzzles.slice(0, 15);//取出每个元素,[0,15)
				const isPass = newPuzzles.every((e, i) => e.idx === i + 1);
				if (isPass) {
					var now = new Date().getTime();
					var completedTime =  now - this.beginTime;

					this.pass = true;

					var name= prompt('恭喜，闯关成功！请输入名字','Bill Gates');
					if(name){
						//保存记录
						this.records.push({
							name : name,
							elapsedTime : completedTime,
							completedTime : now
						});
						Store.set(this.STORE_KEY,this.records);
					}

				}
			}
		},
		//删除记录
		deleteRecord : function (index,record) {
			this.records.splice(index,1);
			Store.set(this.STORE_KEY,this.records);
		}
	},
	mounted(){
		//历史成绩
		this.records = Store.get(this.STORE_KEY) || [];
		this.records.sort(function (a, b) {
			return a.elapsedTime - b.elapsedTime;
		}).slice(0, 5);
		//初始化界面
		this.render();
	}
}
</script>
