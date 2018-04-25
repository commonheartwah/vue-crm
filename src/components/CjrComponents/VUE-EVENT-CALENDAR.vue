<template>
    <section id="vue-event-calendar">
        <el-col :span='24' class='toolbar' style='padding-bottom: 10px;'>
            <el-button @click='handleReset'>停课</el-button>
        </el-col>
        <vue-event-calendar style=" margin-top: 200px;"
            :events="demoEvents"
        ></vue-event-calendar>
        <!-- 选择停课时间的界面 -->
        <el-dialog title='选择停课周期' v-model='editFormVisible' :close-on-click-modal='false'>
            <el-form :model='editForm' label-width='100px' ref='editForm'>
                <el-form-item label='停课周期'>
                    <el-date-picker v-model="validPeriod" type="daterange" placeholder=" 选择日期范围" style="width: 50%;"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
        </el-dialog>
    </section>
</template>

<script>
// 引入axios实例
// import { getSchemeForPlan, sendStopPeriodForPlan } from '../../api/api'

// util工具包
import util from '../../common/js/util'

export default {
    data() {
        return {
            // demoEvents: [
            //     {
            //         date: '2017/05/01',
            //         title: '上课'
            //     },
            //     {
            //         date: '2017/05/03',
            //         title: '上课'
            //     },
            // ],
            demoEvents : [],
            /*
                编辑页面 (选择停课周期)
             */
            editFormVisible: false, //编辑界面是否显示
            editLoading: false, //编辑界面是否显示加载
            editForm: {},
            // 有效期选择 数组中[0]开始时间[1]结束时间
            validPeriod: [],
        }
    },
    methods:{
        load(){
            let arr = ['2017/05/01','2017/05/03','2017/05/05','2017/05/08','2017/05/10','2017/05/12','2017/05/15','2017/05/17','2017/05/19','2017/05/22','2017/05/24','2017/05/26','2017/05/29','2017/05/31','2017/06/02','2017/06/05'];
            arr.forEach((item) => {
                // console.log(item);
                this.demoEvents.push({
                    date: item,
                    title: '上课'
                })
            })
            console.log(this.demoEvents);
        },
    // 显示编辑界面
        handleReset(index, row){
            console.log('____开始选择停课周期');
            this.editFormVisible = true;
        },
    // 编辑页面提交
        editSubmit(){
            let route = {
                plan_id: '20'
            }
            let para = Object.assign({}, route);
            if (this.validPeriod.length != 0) {
                para['start_time'] = util.formatDate.format(this.validPeriod[0], 'yyyy-MM-dd');
                para['end_time'] = util.formatDate.format(this.validPeriod[1], 'yyyy-MM-dd');
            }
            console.log(para);
            // jiekoumingzi(para).then((res) => {
            //     this.editLoading = false;
            //     // console.log(res);
            //     if (res.data.success) {
            //         this.$message({
            //             message: '提交成功',
            //             type: 'success'
            //         });
            //         this.$refs['editForm'].resetFields();
            //         this.editFormVisible = false;
            //         this.load();
            //     }else{
            //         this.$message.error(res.data.msg);
            //     }
            //     // console.log(this.validPeriod);
            //     this.validPeriod.length = 0;
            // })
        },
    },
    mounted(){
        this.load();
    }
}
</script>

<style lang='less' scoped>

</style>
