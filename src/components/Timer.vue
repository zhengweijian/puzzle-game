/**
 * 计时器组件
 * setTimeout只执行一次，setInterval会一直执行
 * @author dimhat
 */
<template>
    <div class="timer">
        <span v-if="hours!=0" class="timer-hours">{{hours}}小时</span>
        <span v-if="minutes!=0" class="timer-minutes">{{minutes}}分钟</span>
        <span class="timer-seconds">{{seconds}}秒</span>
        <br>
        <template v-if="admin">
            <button @click="stop">停止计时</button>
            <button @click="clear">重新计时</button>
        </template>
    </div>
</template>

<script>
export default{
    data(){
        return {
            timer : null,
            admin : false,
            now : new Date().getTime()
        }
    },
    props:['time'],
    watch:{

    },
    computed:{
        interval : function () {
            //console.log(this.now,'--',this.time);
            return (this.now - this.time)/1000;
        },
        hours : function () {
            return parseInt(this.interval/3600);
        },
        minutes : function () {
            return parseInt((this.interval%3600)/60);
        },
        seconds : function () {
            return Math.round(this.interval%60);
        }
    },
    methods:{
        start:function () {
            var self = this;
            this.timer = setInterval(function () {
                self.now = new Date().getTime();
            },1000);
        },
        stop:function () {
            clearInterval(this.timer);
            console.log('stop interval ',this.timer);
        },
        clear:function () {
            if(this.timer){
                clearInterval(this.timer);
                console.log('clear interval ',this.timer);
            }
            this.start();
        }
    },
    mounted:function () {
        this.start();
        console.log('Timer start');
    }
}
</script>

<style>
    /*time*/
    .timer{
        display: inline-block;
    }
    .timer-seconds{
        color:lawngreen;
    }
    .timer-minutes{
        color: cyan;
    }
    .timer-hours{
        color:lightcoral;
    }
</style>