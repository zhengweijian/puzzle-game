# puzzles

> A puzzle game

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```


## 介绍
一款基于vue.js的拼图小游戏

使用技术：vue + vue-router + webpack

[网页 Live Demo](https://zhengweijian.github.io/puzzle-game/)
在手机中打开
![](http://7xilgj.com1.z0.glb.clouddn.com/puzzle-erweima.png)

## 拼图技巧
对于2*2的拼图，只要顺着同一个方向转就能完成。
对于3*3的拼图，可以看成4个2*2。我们可以将问题转化为 2*2的外圈 + 2*2，先拼完1、2、3、4、7，剩下的5、6、8就是一个2*2的问题。
同理，4*4可以看成 3*3的外圈+2*2的外圈+2*2。
n*n都可以先完成最外圈，转化成(n-1)*(n-1)问题。

## 洗牌算法
shuffle算法，时间复杂度O(n)
随机从剩余牌堆抽一张，按顺序放入新牌堆，直至抽完

## 逆序数
在实践中发现有时候拼图永远无法完成，如下列情况（x代表空的格子）：
```
1 3
2 X
```
经过同学提醒，发现跟逆序数有关。

（1）交换序列的任意两元素，序列的逆序数的奇偶性必定发生改变。
线性代数知识，证明过程：
1. 交换相邻两个元素，逆序数奇偶性改变。 如3和4交换， [1,2,3,4,5] -> [1,2,4,3,5]
2. 交换非相邻两个元素，如2和4交换，[1,2,3,4,5] -> 1,2,4,3,5 -> 1,4,2,3,5 -> [1,4,3,2,5] 等价于进行了3次相邻交换
3. 推广到第i个和第j个元素交换，需要交换 (j-i) + (j-i) -1 = 2(j-i)-1 次，所以奇偶性一定改变。

如果我们把矩阵看成一个特殊的序列，如：
```
1 2
3 X    看成 [1,2,3,X]，X为无穷大
```
（2）对于任一矩阵，通过任意次移动后，如果X回到原位置，则逆序数的奇偶性保持不变。（每次移动限制为只能移动X并只能与存在的上、下、左或右交换）
证明过程：
由于X回到了原位置，所以X与上下方向的交换次数的和为偶数，左右同理，那么总交换次数也为偶数。
根据（1）可得，每次交换奇偶性都会改变，那么经过偶数次的奇偶性变换，序列最终的奇偶性不会改变。

（3）对于任一矩阵，无法通过任意次移动后使得第i个元素和第j个元素交换，且其他元素（包括X）位置不改变。
反证法：
假设可以通过任意次移动后，第i个元素和第j个元素交换，其他元素（包括X）位置不改变。
根据（2）可得，由于X回到原位置，所以序列的奇偶性不改变。但是根据（1）可知奇偶性一定改变，两者存在冲突，假设不成立。

对于任一矩阵，通过任意次移动后，在X回到原位置的情况下：
根据（2）可得，奇偶性相同的序列可以相互转换；根据（3）可得，奇偶性不同的序列不可以相互转换。


## 参考
vue-puzzle-game https://github.com/luozhihao/vue-puzzle

逆序数 http://blog.csdn.net/kaikai4/article/details/51426940