<template>
	<div class="box">
		<ul class="puzzle-wrap">
			<li class="puzzle" :class="{'puzzle-empty':!puzzle}"
				v-for="(puzzle,index) in puzzles"
				v-text="puzzle"
				@click="moveFn(index)">
			</li>
		</ul>
		<br>
		<!-- btn-reset-->
		<button class="btn btn-warning btn-block" @click="render">重置游戏</button>
	</div>
</template>


<script>
export default{
	data(){
		return {
			puzzles:[],
			loading:false
		}
	},
	methods:{
		//随机渲染
		render: function () {
			let puzzleArr = [];
			for(var i=1;i<16;i++){
				puzzleArr.push(i);
			}

			//shuffle
			var len = puzzleArr.length;
			for(var i=len;i>1;i--){
				var t = Math.round(Math.random()*(i-1));
				[puzzleArr[i-1],puzzleArr[t]] = [puzzleArr[t],puzzleArr[i-1]]
			}
			console.log(puzzleArr);
			puzzleArr.push('');
			this.puzzles = puzzleArr;
		},
		//点击方块移动
		moveFn:function (index) {

			if(this.loading){
				console.log("loading...")
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
		passJudge : function () {
			if (this.puzzles[15] === '') {
				const newPuzzles = this.puzzles.slice(0, 15);
				console.log(newPuzzles,"--1");//取出每个元素,[0,15)
				const isPass = newPuzzles.every((e, i) => e === i + 1)
				if (isPass) {
					alert ('恭喜，闯关成功！')
				}
			}
		}
	},
	mounted(){
		this.render();
	}
}
</script>

<style>

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

