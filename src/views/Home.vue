<template lang="html">
    <el-row class="container">

        <el-col :span="24" class="header">

			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
                {{collapsed?'':sysName}}
            </el-col>

			<el-col :span="4">
				<div class="tools" @click.prevent="collapse">
					<i :class=" collapsed? 'fa fa-align-justify fa-lg oIcon' : 'fa fa-align-justify fa-lg' "></i>
				</div>
			</el-col>
            <!-- 这是右侧的用户信息部分 -->
			<el-col :span="10" class="userinfo">
                <span>{{sysUserName}}，欢迎你！</span>
				<el-dropdown trigger="hover" style="color:white;margin-left:20px;">
					<span class="el-dropdown-link userinfo-inner">
                        <i class="fa fa-user" style="margin-right:4px;"></i>
                        <span>个人设置</span>
                    </span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item @click.native='handleChangePassword'>修改密码</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
                <span style="color:white;margin-left:20px;">
                    <i class="fa fa-power-off" style="margin-right:4px;"></i>
                    <el-button type="text" style="color:white;" @click.native="logout">注销</el-button>
                </span>
			</el-col>
		</el-col>

        <!-- Main部分 包括左侧的aside 以及 右侧的content -->
        <el-col :span="24" class="main">

            <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
                <!--导航菜单-->
                <el-menu
                    class="el-menu-vertical-demo"
                    :default-active="$route.path"
                    @open="handleopen"
                    @close="handleclose"
                    @select="handleselect"
                    unique-opened
                    router
                    v-show="!collapsed"
                    theme="dark"
                    style="overflow-y:scroll"
                >
                    <template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">

						<el-submenu :index="index+''" v-if="!item.leaf">

							<template slot="title">

								<i :class="item.iconCls"></i>{{item.name}}

							</template>

                			<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">
                    			{{child.name}}
                			</el-menu-item>

                		</el-submenu>

                		<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path">

                    		<i :class="item.iconCls"></i> {{item.children[0].name}}

                		</el-menu-item>

                    </template>

                </el-menu>

                <ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">

                    <li v-for="(item,index) in $router.options.routes" v-if="!item.hidden" class="el-submenu item">

                        <template v-if="!item.leaf">

							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                                <i :class="item.iconCls"></i>
                            </div>

							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
								<li
                                    class="el-menu-item"
                                    :class="$route.path==child.path?'is-active':''"
                                    style="padding-left: 40px;"
                                    v-for="child in item.children"
                                    v-if="!child.hidden" :key="child.path"
                                    @click="$router.push(child.path)"
                                >
                                    {{child.name}}
                                </li>
							</ul>

    					</template>

                        <template v-else>

							<li class="el-submenu">
								<div
                                    class="el-submenu__title el-menu-item"
                                    :class="$route.path==item.children[0].path?'is-active':''"
                                    style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;"
                                    @click="$router.push(item.children[0].path)"
                                >
                                    <i :class="item.iconCls"></i>
                                </div>
							</li>

    					 </template>

                    </li>

                </ul>

            </aside>

            <section class="content-container">

                <div class="grid-content bg-purple-light">

                    <el-col :span="24" class="breadcrumb-container">

                        <strong class="title">{{$route.name}}</strong>

                        <el-breadcrumb separator="/" class="breadcrumb-inner">
                            <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                                {{ item.name }}
                            </el-breadcrumb-item>
                        </el-breadcrumb>

                    </el-col>

                    <el-col :span="24" class="content-wrapper">
                        <transition name="fade" mode="out-in">
                            <router-view></router-view>
                        </transition>
                    </el-col>

                </div>

            </section>

        </el-col>

        <el-col :span="12" :offset="6" style="background-color:red;">

            <el-dialog title="修改密码" v-model='changePasswordFormVisible' :close-on-click-modal='false'>

                <el-form :model='changePasswordForm' label-width='100px' :rules='changePasswordFormRules' ref='changePasswordForm'>

                    <el-form-item label='原始密码' prop='old_password'>
                        <el-input v-model='changePasswordForm.old_password' auto-complete='off'></el-input>
                    </el-form-item>

                    <el-form-item label='新密码' prop='new_password'>
                        <el-input type="password" v-model='changePasswordForm.new_password' auto-complete='off'></el-input>
                    </el-form-item>

                    <el-form-item label='确认密码' prop='check_password'>
                        <el-input type="password" v-model='changePasswordForm.check_password' auto-complete='off'></el-input>
                    </el-form-item>

                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="changePasswordFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="changePasswordSubmit" :loading="changePasswordLoading">提交</el-button>
                </div>

            </el-dialog>

        </el-col>

    </el-row>

</template>

<script>
import { changePassword, requestLogout } from '../api/api';

export default {
    data() {
        return {
            sysName:'启萌后台管理',
            collapsed:false,
            sysUserName: '',

            // 修改密码部分
            changePasswordFormVisible: false,
            changePasswordLoading: false,
            changePasswordForm: {
                old_password: '',
                new_password: '',
                check_password: '',
            },
            changePasswordFormRules: {
                old_password: [
                    { required: true, message: '请输入原始密码', trigger: 'blur' }
                ],
                new_password: [
                    { required: true, message: '请输入新密码', trigger: 'blur' }
                ],
                check_password: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        onSubmit() {
            console.log('submit!');
        },
        // 是否展开当前导航
        handleopen() {
            // console.log('handleopen');
        },
        // 是否关闭当前导航
        handleclose() {
            // console.log('handleclose');
        },
        handleselect (a, b) {
            if (this.$route.path == a) {
                history.go(0);
                return;
            };
            this.$router.push(a)
        },
        // 修改密码
        handleChangePassword(){
            this.changePasswordForm = {
                old_password: '',
                new_password: '',
                check_password: '',
            },
            this.changePasswordFormVisible = true;
        },
        changePasswordSubmit(){
            this.$refs.changePasswordForm.validate((valid) => {
                if (valid) {
                    if (this.changePasswordForm.new_password == this.changePasswordForm.check_password) {
                        this.$confirm('确认提交吗?', '提示', {}).then(() => {

                            this.changePasswordLoading = true;

                            let para = Object.assign({}, this.changePasswordForm);
                            delete para['check_password'];

                            changePassword(para).then((res) => {
                                this.changePasswordLoading = false;
                                if (res.data.success) {
                                    this.$notify({
                                        title: '成功',
    									message: '修改成功',
    									type: 'success'
    								});
                                    this.$refs['changePasswordForm'].resetFields();
                                    this.changePasswordFormVisible = false;
                                }else{
                                    this.$message.error(res.data.msg);
                                }
                            })
                        })
                    }else{
                        this.$notify({
                            title: '错误',
                            message: '两次密码不一致',
                            type: 'error'
                        });
                    }
                }
            })
        },
        //退出登录
        logout: function () {
            var _this = this;
            this.$confirm('确认退出吗?', '提示', {
                type: 'warning'
            }).then(() => {
                requestLogout().then((res) => {
                    if (res.data.success) {
                        _this.$router.push('/login');
                    }else{
                        this.$notify({
                            title: '错误',
                            message: res.data.msg,
                            type: 'error'
                        })
                    }
                })

            }).catch((e) => {
                console.log(e);
            });
        },
        //折叠导航栏
        collapse:function(){
            this.collapsed=!this.collapsed;
        },
        showMenu(i, status) {
            this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
        }
    },
    mounted() {
        var user = localStorage.getItem('userInfo');
        if (user) {
            user = JSON.parse(user);
            this.sysUserName = user.displayName || user.name;
        }
    }
}

</script>

<style lang="less" scoped>
body{
    .container{
        position: absolute;
        top: 0;
        bottom : 0;
        width: 100%;
        .header{
            height: 60px;
            line-height: 60px;
            background-color: #36b3b3;
            color: #fff;
            .logo{
                // width:180px;
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
                img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
                .txt {
					color:#fff;
				}
            }
            .logo-width{
				width:180px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
            .oIcon{
                transform: rotate(90deg);
            }
            .userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
        }
        .main{
            display: flex;
            // background-color: #fff;
            position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
            aside{
                flex: 0 0 230px;
                width: 230px;
                .el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
            }
            .menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 180px;
				width: 230px;
			}
            .content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: scroll;
				padding: 20px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
            }
        }
    }
}
</style>
