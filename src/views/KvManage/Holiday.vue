<template lang="html">
    <div class="holidayPage" v-loading="listLoading" element-loading-text="努力加载中...">
    <section id="holidayPage">
        <!-- 查询现有节假日 -->
        <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
            <el-form :inline=true :model='filters'>

                <el-form-item>
                    <el-input v-model='filters.year' placeholder='年,格式为yyyy' icon="circle-cross" :on-icon-click="handleIconClick_clearYear" @keydown.native.prevent.enter='loadData'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type='primary' @click='loadData'>查询</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type='primary' @click='handleAdd'>批量新增</el-button>
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
            <el-button type='primary' @click='storeConf' style="float: right">保存配置</el-button>
        </el-col>

        <!-- 新增节假日配置 -->
        <el-dialog title='新增节假日配置' v-model='addFormVisible' :close-on-click-modal='false'>
            <el-form :model='addForm' label-width='100px' :rules='addFormRules' ref='addForm'>

                <el-form-item label='选择年份' prop='year'>
                    <el-input style="width:130px;" v-model='addForm.year' placeholder="输入格式为2017"></el-input>
                </el-form-item>

                <el-form-item label='选择月日' prop='date'>
                    <el-input type="textarea" :autosize="{ minRows: 3 }" v-model='addForm.date' placeholder="输入格式为05-01,05-02,05-03(多个以英文逗号分隔)"></el-input>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
    			<el-button @click.native="addFormVisible = false">取消</el-button>
    			<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
    		</div>

        </el-dialog>

    </section>
    </div>
</template>

<script>
// 引入axios实例
import {
    getHolidayConf,
    editHolidayConf
} from '../../api/api.js'
// 引入工具类
import util from '../../common/js/util.js'

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
                year: [
                    { required: true, message: '请输入年份', trigger: 'blur' }
                ],
                date: [
                    { required: true, message: '请输入月日', trigger: 'blur' }
                ],
            },
            addForm: { //新增界面表单数据类型
                year: '',
                date: '',
            },
            //
            listLoading: false
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
            if (this.filters.year == '') {
                var para = {
                    year: new Date().getFullYear()
                }
            }else{
                var para = {
                    year: this.filters.year
                }
            }
            this.listLoading = true;
            getHolidayConf(para)
                .then((res) => {
                    if (res.data.success) {
                        if (res.data.data) {
                            this.dynamicTags = [];
                            for(let key in res.data.data.days){
                                this.dynamicTags.push(key);
                            }
                            // 日期进行从小到大的排序
                            this.dynamicTags.sort((a,b) => {
                                return a > b ? 1 : -1
                            })
                        }else{
                            this.dynamicTags = [];
                        }
                    }else{
                        this.$notify({
                            title: '错误',
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                    this.listLoading = false;
                })
                .catch((error) => {
                    if (error.response) {
                        this.$notify({
                            title: error.response.status,
                            message: '网络请求错误',
                            type: 'error'
                        })
                    }else if(error.request){
                        this.$notify({
                            title: error.request,
                            message: '网络请求错误',
                            type: 'error'
                        })
                    }else{
                        this.$notify({
                            title: '错误',
                            message: error.message,
                            type: 'error',
                        })
                    }
                })
        },
// 新增页面
    //显示批量新增界面
        handleAdd() {
            this.addFormVisible = true;
            this.addForm = {
                year: '',
                date: '',
            }
        },
    //批量新增提交
        addSubmit() {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', { type: 'warning' })
                    .then(() => {
                        this.addLoading = true;
                        let para = Object.assign({}, this.addForm);
                        // 替换textArea里的换行符号\中英文逗号\分号 为 英文字符的逗号
                        para['date'] = util.ReplaceSeperator(para['date']);
                        editHolidayConf(para).then((res) => {
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
                    });
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
            let year = '';
            this.filters.year==""?year=new Date().getFullYear().toString():year=this.filters.year;
            let date = this.dynamicTags.map((item) => {
                item = item.slice(5);
                return item;
            })
            let para = {
                year: year,
                date: date.join(',')
            }
            editHolidayConf(para).then((res) => {
                this.addLoading = false;
                if (res.data.success) {
                    this.$notify({
                        title: '成功',
                        message: '提交成功',
                        type: 'success'
                    });
                    try {
                        this.$refs['addForm'].resetFields();
                    } catch (e) {
                        console.log(e);
                    } finally {

                    }
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
        }
    },
    mounted(){
        this.loadData();
    }
}
</script>

<style lang="less" scoped>
.holidayPage{
    height: 550px;
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
}
</style>
