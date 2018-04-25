<template lang="html">
    <section id="holidayPage">
        <!-- 查询现有节假日 -->
        <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>

            <el-form :inline=true :model='filters'>

                <el-form-item>
                    <el-button type='danger' @click='handleAdd'>批量新增</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type='primary' @click='enterInCalendarPage'>返回课表页面</el-button>
                </el-form-item>

            </el-form>

        </el-col>

        <el-col :span='24' class='toolbar' style='padding-bottom: 10px;'>

            <el-tag
                class="oElTags"
                v-for="tag in dynamicTags"
                :key="tag" type="primary"
                :closable="true"
                :close-transition="false"
                @close="handleClose(tag)"
            >
            {{tag}}
            </el-tag>

            <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
            >
            </el-input>

            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

        </el-col>

        <el-col :span='24' class='toolbar' style='padding-bottom: 10px;'>
            <el-button type='primary' @click='storeConf' style="float: right" :loading="storeLoading">保存配置</el-button>
        </el-col>

        <!-- 新增节假日配置 -->
        <el-dialog title='新增节假日配置' v-model='addFormVisible' :close-on-click-modal='false'>

            <el-form :model='addForm' label-width='100px' :rules='addFormRules' ref='addForm'>
                <el-form-item label='选择年月日' prop='holiday_conf'>
                    <el-input type="textarea" :autosize="{ minRows: 3 }" v-model='addForm.holiday_conf' placeholder="输入格式为2017-05-01,2017-05-02,2017-05-03(多个以换行或者英文逗号分隔)"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
    			<el-button @click.native="addFormVisible = false">取消</el-button>
    			<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
    		</div>

        </el-dialog>
    </section>
</template>

<script>
// 引入工具
import util from '../../common/js/util.js'
// 引入axios
import {
    getPlanById,
    sendStopPeriodForPlan
} from '../../api/api.js'

export default {
    data(){
        return {
            // tag标签显示全局假日信息
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            /*
                filter
             */
            filters: {
                year: '',
            },
            /*
                新增
             */
            addFormVisible: false, //新增界面是否显示
            addLoading: false, //新增界面是否显示加载
            addFormRules: { //新增界面表单规则
                holiday_conf: [
                    { required: true, message: '请输入月日', trigger: 'blur' }
                ],
            },
            addForm: { //新增界面表单数据类型
                holiday_conf: '',
            },
            /*
                store
             */
            storeLoading: false
        }
    },
    methods:{
    // filters 过滤查询栏
        // 点击input后面的icon 清除内容
        handleIconClick_clearYear(){
            this.filters.year = '';
        },
    // 加载数据
        loadData(){
            let para = {
                plan_id: this.$route.query.plan_id
            }
            getPlanById(para).then((res) => {
                if (res.data.success) {
                    if (res.data.data) {
                        this.dynamicTags = [];
                        if (res.data.data.data.conf.holidayConf && res.data.data.data.conf.holidayConf.days) {
                            for(let key in res.data.data.data.conf.holidayConf.days){
                                this.dynamicTags.push(key);
                            }
                            // 日期排序
                            this.dynamicTags.sort((a,b) => {
                                return a > b ? 1 : -1;
                            })
                        }
                    }else{
                        this.dynamicTags = [];
                    }
                }else{
                    this.$notify({
                        title: '错误',
                        message: res.data.msg,
                        type: 'error'
                    })
                }
            })
        },
// 新增页面
    //显示批量新增界面
        handleAdd() {
            this.addFormVisible = true;
            this.addForm = {
                plan_id: this.$route.query.plan_id,
                holiday_conf: '',
            }
        },
    //批量新增提交
        addSubmit() {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {
                        type: 'warning'
                    })
                    .then(() => {
                        this.addLoading = true;
                        let para = Object.assign({}, this.addForm);
                        // 替换textArea里的换行符号\中英文逗号\分号 为 英文字符的逗号
                        para['holiday_conf'] = util.ReplaceSeperator(para['holiday_conf']);
                        sendStopPeriodForPlan(para).then((res) => {
                            this.addLoading = false;
                            if (res.data.success) {
                                this.$notify({
                                    title: '成功',
									message: '提交成功',
									type: 'success'
								});
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.loadData();
                            }else{
                                this.$notify({
                                    title: '错误',
									message: res.data.msg,
									type: 'error'
								});
                            }
                        })
                    })
                    .catch(() => {
                        this.$notify({
                            title: '提示',
                            message: '取消操作',
                            type: 'info'
                        });
                    })
                }
            });
        },
    // tag标签
        // 移除
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.dynamicTags.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        // 保存tag配置
        storeConf(){
            let para = {
                plan_id: this.$route.query.plan_id,
                holiday_conf: this.dynamicTags.join(',')
            }
            sendStopPeriodForPlan(para)
            .then((res) => {
                this.storeLoading = true;
                if (res.data.success) {
                    this.$notify({
                        title: '成功',
                        message: '提交成功',
                        type: 'success'
                    });
                    this.storeLoading = false;
                    this.loadData();
                }else{
                    this.$notify({
                        title: '错误',
                        message: res.data.msg,
                        type: 'error'
                    })
                    this.storeLoading = false;
                    this.loadData();
                }
            })
        },
        // 返回课程课表页面
        enterInCalendarPage(){
            this.$router.go(-1);
        }
    },
    mounted(){
        this.loadData();
    }
}
</script>

<style lang="less" scoped>
#holidayPage{
    .oElTags,.input-new-tag{
        margin: 10px;
        width: 150px;
        text-align: center;
        height: 40px;
        line-height: 40px;
        font-size: 16px;
    }
}
</style>
