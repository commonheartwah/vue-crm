<template>
    <section id="vue-event-calendar">

        <el-col :span='24' class='toolbar' style='padding-bottom: 10px;'>
            <el-button type="danger" @click='enterInHolidayPage'>停课</el-button>
            <el-button type="primary" @click='enterInPlanPage'>返回计划列表</el-button>
        </el-col>

        <vue-event-calendar style=" margin-top: 200px;" ref='calendar'
            :events="demoEvents"
        >
        </vue-event-calendar>
    </section>
</template>

<script>
// 引入axios
import { getPlanById } from '../../api/api'

// util工具包
import util from '../../common/js/util'

export default {
    data() {
        return {
            // demoEvents: [
            //     {
            //         date: '2017/05/01',
            //         title: '上课'
            //     }
            // ],
            demoEvents : [],
        }
    },
    methods:{
        load(){
            // 1 上课 2 放假 3 复习
            // 每次重新初始化
            this.demoEvents = [];
            // 定义参数para
            let para = {
                plan_id: this.$route.query.plan_id
            }
            // 获取列表
            getPlanById(para).then((res) => {
                // 临时数组接收课表日期
                var arr = new Array();
                if (res.data.data.data.conf.scheduleConf && res.data.data.data.conf.scheduleConf.days) {
                    let tempObj = res.data.data.data.conf.scheduleConf.days;
                    for(let key in tempObj){
                        arr.push(key);
                    }
                    // 日期排序
                    arr.sort(function(a, b) {
                        return a > b ? 1 : -1
                    })
                    let baseNum = 0
                    // demoEvents赋值
                    for(let date of arr){
                        let desc = ''
                        switch (tempObj[date]) {
                            case 1:
                                baseNum ++
                                desc = '今天上第' + baseNum + '节主课'
                                break;
                            case 2:
                                desc = '今天放假'
                                break;
                            case 3:
                                desc = '今天上复习课'
                                break;
                        }
                        this.demoEvents.push({
                            date: util.transformDate(date),
                            title: '上课',
                            desc: desc
                        })
                    }
                }else{
                    this.$notify({
                        title: '错误',
                        message: '无课表安排,请重新更新计划',
                        type: 'error'
                    })
                }
            })
        },
    // 进入课程holiday页面
        enterInHolidayPage(){
            this.$router.push({ path: '/planHoliday', query: { plan_id: this.$route.query.plan_id } })
        },
    // 返回计划列表
        enterInPlanPage(){
            this.$router.go(-1);
        }
    },
    mounted(){
        this.load();
    }
}
</script>

<style lang='less' scoped>

</style>
