<template>
<div id="app">
	<div class="left">
		<!--选择类型-->
		<ol>
			<li>
				<input name="type" value="0" v-model="type" type="radio">
				<label for="">数字样式</label>
			</li>
			<li>
				<input name="type" value="1" v-model="type" type="radio">
				<label for="">图片样式</label>
			</li>
		</ol>
		<div>
			<p v-if="type==1">
				<img src="/src/assets/img/katong/katong_all.jpg" alt="" width="200px" height="200px">
			</p>
		</div>
		<div>
			<p>历史记录</p>
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

	<div class="box">
		计时：<timer :time="beginTime"></timer>

		<ul class="puzzle-wrap">
			<li class="puzzle" :class="{'puzzle-empty':!puzzle}"
				v-for="(puzzle,index) in puzzles"
				@click="moveFn(index)">
				<!--数字样式-->
				<template  v-if="type==0">
					{{puzzle.idx}}
				</template>
				<!--图片样式-->
				<template v-if="type==1">
					<img width="100px" height="100px" :src="puzzle.image" />
				</template>
			</li>
		</ul>


		<!-- btn-reset-->
		<button class="btn btn-warning btn-block" @click="render">重置游戏</button>
	</div>
</div>
</template>


<script>
import Timer from './components/Timer.vue';
import Store from './store';

export default{
	data(){
		return {
			puzzles:[],
			loading:false,
			beginTime: null,
			type : 1,
			pass : false,
			records : [],
			recordsOrder : [],
			STORE_KEY :'RECORDS'
		}
	},
	components:{
		'Timer' : Timer
	},
	watch:{

	},
	computed:{

	},
	methods:{
		//随机渲染
		render: function () {
			let puzzleArr = [];
			for(var i=1;i<16;i++){
				puzzleArr.push({idx:i,image:'/src/assets/img/katong/katong_'+i+'.jpg'});
			}

			//shuffle fixme 存在无法完成可能性
			var len = puzzleArr.length;
			for(var i=len;i>1;i--){
				var t = Math.round(Math.random()*(i-1));
				[puzzleArr[i-1],puzzleArr[t]] = [puzzleArr[t],puzzleArr[i-1]]
			}
			console.log(puzzleArr);

			puzzleArr.push('');
			this.puzzles = puzzleArr;
			//更改计时器开始时间
			this.beginTime = new Date().getTime();

			this.passJudge();
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
			let puzzleArr = [ ].concat(this.puzzles);//$set无法使用，只能拷贝新数组

			if(moveTo>=0 && moveTo<puzzleArr.length && puzzleArr[moveTo]===''){
				console.log('success move ',index,'->',moveTo,);
				this.loading = true;
				puzzleArr[moveTo] = this.puzzles[index];
				puzzleArr[index] = '';
				this.puzzles = puzzleArr;//refresh ui
				this.passJudge();//judge pass
				this.loading = false;
			}
		},
		//通关判断
		passJudge : function () {
			if (this.puzzles[15] === '') {
				const newPuzzles = this.puzzles.slice(0, 15);//取出每个元素,[0,15)
				const isPass = newPuzzles.every((e, i) => e.idx === i + 1)
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
		this.records = Store.get(this.STORE_KEY) || [];
		this.records.sort(function (a, b) {
			return a.elapsedTime - b.elapsedTime;
		}).slice(0, 5);
		this.render();
	}
}
</script>

<style>
	.left{
		width:400px;
		float:left;
	}

	body{
		font-family: Arial,"Microsoft YaHei UI";
	}

	.box{
		width:400px;
		margin: 50px auto 0;
	}

	.puzzle-wrap{
		width: 408px;
		height: 408px;
		margin-bottom: 40px;
		padding: 0;
		background: #ccc;
		list-style: none;
	}

	.puzzle {
		float: left;
		width: 100px;
		height: 100px;
		font-size: 20px;
		background: #f90;
		text-align: center;
		line-height: 100px;
		border: 1px solid #ccc;
		box-shadow: 1px 1px 4px;
		text-shadow: 1px 1px 1px #B9B4B4;
		cursor: pointer;
	}

	.puzzle-empty {
		background: #ccc;
		box-shadow: inset 2px 2px 18px;
	}

	.btn-reset {
		box-shadow: inset 2px 2px 18px;
	}
</style>

