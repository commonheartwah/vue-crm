<template lang='html'>

    <el-form :model='ruleForm2' :rules='rules2' ref='ruleForm2' label-position='left' label-width='0px' class='demo-ruleForm login-container'>

        <h3 class='title'>系统登录</h3>

        <el-form-item prop='account'>

            <el-input type='text' v-model='ruleForm2.account' auto-complete='off' placeholder='请输入您的账号'>
                <i class="fa fa-camera-retro"></i>
            </el-input>

        </el-form-item>

        <el-form-item prop='checkPass'>

            <el-input type='password' v-model='ruleForm2.checkPass' auto-complete='off' placeholder='请输入您的密码' @keydown.native.enter='handleSubmit2'></el-input>

        </el-form-item>

        <!-- 是否需要记住密码 后续补充 -->

        <el-form-item style='width:100%;text-align:center;'>

            <el-button type='primary' style='width:100%;margin-top:25px;' @click.native.prevent='handleSubmit2' :lording='loging'>登录</el-button>

        </el-form-item>

    </el-form>

</template>

<script>
import { requestLogin } from '../api/api'

export default {
    data() {
        return {
            loging: false,
            ruleForm2: {
                account: '',
                checkPass: ''
            },
            rules2: {
                account: [
                    { required: true, message: '请输入账号', trigger: 'blur' }
                ],
                checkPass: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        // 点击之后登录
        handleSubmit2(ev){
            var _this = this;
            this.$refs.ruleForm2.validate( valid => {
                if (valid) {
                    this.loging = true;

                    let loginParams = {
                        username: this.ruleForm2.account,
                        password: this.ruleForm2.checkPass
                    };

                    requestLogin(loginParams).then( res => {
                        this.loging = false;

                        if (res.data.success) {

                            localStorage.setItem("userInfo", JSON.stringify(res.data.data.user));
                            this.$notify({
                                title: '成功',
                                message: '登录成功',
                                type: 'success'
                            });
                            this.$router.push({ path: '/videoMaterial' });
                        }else{
                            if (res.data == '') {
                                this.$notify({
                                    title: '错误',
                                    message: '登录失败',
                                    type: 'error'
                                })
                            }else{
                                this.$notify({
                                    title: '错误',
                                    message: res.data.msg,
                                    type: 'error'
                                })
                            }
                        }
                    });
                }else{
                    console.log('error submit!!');
                    return false;
                }
            })
        }
    }
}
</script>

<style lang='less' scoped>
.login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }
}
</style>
