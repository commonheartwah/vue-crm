<template lang="html">
    <div class="screenPage" v-loading="listLoading" element-loading-text="努力加载中...">
        <section class="screenEdit" style="width: 500px;">
            <el-form :model='editForm' label-width='100px' :rules='editFormRules' ref='editForm'>

                <el-form-item label='显示时长' prop='duration_time'>
                    <el-input v-model='editForm.duration_time' style="width: 100px;" placeholder="只能为整数"></el-input>
                </el-form-item>

                <el-form-item label='是否启用' prop='stat'>
                    <el-radio-group v-model="editForm.stat">
                        <el-radio class="radio" :label="0">否</el-radio>
    					<el-radio class="radio" :label="1">是</el-radio>
    				</el-radio-group>
                </el-form-item>

                <el-form-item label="是否跳过" prop='is_skip'>
    				<el-radio-group v-model="editForm.is_skip">
    					<el-radio class="radio" :label="0">否</el-radio>
                        <el-radio class="radio" :label="1">是</el-radio>
    				</el-radio-group>
    			</el-form-item>

                <el-form-item label='图片URL' prop='image_url'>
                    <el-input v-model='editForm.image_url' style="width: 400px;"></el-input>
                </el-form-item>

                <el-form-item label='跳转类型' prop='redirect_type'>
                    <el-radio-group v-model="editForm.redirect_type">
    					<el-radio class="radio" :label="0">链接</el-radio>
                        <el-radio class="radio" :label="1">为以后扩展字段</el-radio>
    				</el-radio-group>
                </el-form-item>

                <el-form-item label='跳转链接' prop='redirect_link'>
                    <el-input v-model='editForm.redirect_link' style="width: 400px;"></el-input>
                </el-form-item>

                <el-form-item label='追踪链接' prop='track_link'>
                    <el-input v-model='editForm.track_link' style="width: 400px;"></el-input>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer" style="float: right" v-if="!listLoading">
                <el-button @click="resetForm('editForm')">重置</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </section>
    </div>
</template>

<script>
// 引入axios实例
import {
    getScreenConf,
    editScreenConf
} from '../../api/api'

export default {
    data(){
        return {
            listLoading: false,
            /*
                编辑
            */
            editLoading: false, //编辑界面是否显示加载
            editFormRules: {//编辑界面表单规则
                duration_time: [
                    { required: true, message: '请输入显示时长' }
                ],
                stat: [
                    { required: true }
                ],
                is_skip : [
                    { required: true }
                ],
                image_url: [
                    { required: true, message: '请输入启动画面配置图片的url', trigger: 'blur' }
                ],
                redirect_type : [
                    { required: true }
                ],
                redirect_link: [
                    { required: true, message: '请输入跳转链接', trigger: 'blur' }
                ],
            },
            editForm: {
                duration_time: '',
                is_skip: 0,
                stat: 0,
                image_url: '',
                redirect_type: 0,
                redirect_link: '',
                track_link: '',
            },
        }
    },
    methods:{
        loadData(){
            this.listLoading = true;
            getScreenConf()
                .then((res) => {
                    if (res.data.success && res.data.data) {
                        this.editForm['duration_time'] = res.data.data['durationTime'];
                        this.editForm['is_skip'] = res.data.data['skip']?1:0;
                        this.editForm['stat'] = res.data.data['stat']?1:0;
                        this.editForm['image_url'] = res.data.data['imageUrl'];
                        this.editForm['redirect_type'] = res.data.data['redirectType'];
                        this.editForm['redirect_link'] = res.data.data['redirectLink'];
                        this.editForm['track_link'] = res.data.data['trackLink'];
                    }else {
                        this.$notify({
                            title: '错误',
                            message: res.data.msg,
                            type: 'error'
                        })
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
                            type: 'error'
                        })
                    }
                })
        },
    // 编辑页面提交
        editSubmit(){
            this.$refs.editForm.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗?', '提示', {})
                        .then(() => {
                            this.editLoading = true;
                            let temp = Object.assign({}, this.editForm);
                            temp['stat'] = temp['stat']?true:false;
                            temp['skip'] = temp['is_skip']?true:false;
                            delete temp['is_skip'];
                            let para = {
                                value: '',
                            }
                            para['value'] = JSON.stringify(temp);
                            editScreenConf(para).then((res) => {
                                this.editLoading = false;
                                if (res.data.success) {
                                    this.$notify({
                                        title: '成功',
                                        message: '编辑成功',
                                        type: 'success'
                                    });
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
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
            })
        },
        resetForm(formName){
            this.$refs[formName].resetFields();
        }
    },
    mounted(){
        this.loadData();
    }
}
</script>

<style lang="less" scoped>
.screenEdit{
    margin-top: 20px;
}
</style>
