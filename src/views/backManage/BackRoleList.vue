<template lang="html">
    <section>

        <!-- 按钮  过滤  工具条-->
        <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
            <el-form :inline=true :model='filters'>
                <el-form-item>
                    <el-input v-model='filters.id' placeholder='ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" @keydown.native.prevent.enter='loadBackRoleList'></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' @click='loadBackRoleList'>查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' @click='handleAdd'>新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!-- 列表 -->
        <el-table :data='users' highlight-current-row v-loading='listLoading' style='width: 100%;' border>

            <el-table-column prop='id' label='ID' width='75' sortable align='center'></el-table-column>

            <el-table-column prop='name' label='角色名称' width='150' align='center'></el-table-column>

            <el-table-column prop='desc' label='角色描述' align='center'></el-table-column>

            <el-table-column prop='createTime' label='创建时间' :formatter='formatCreateTime' width='168'></el-table-column>

            <el-table-column label='操作' width='230' align='center'>
                <template scope='scope'>
                    <el-button-group>
                        <el-button size='small' type='success' @click='handleEdit(scope.$index, scope.row)'>编辑</el-button>
                        <el-button size='small' type='info' @click='showRolePermsPage(scope.$index, scope.row)'>权限管理</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增界面 -->
        <el-dialog title='新增' v-model='addFormVisible' :close-on-click-modal='false'>
            <el-form :model='addForm' label-width='100px' :rules='addFormRules' ref='addForm'>
                <el-form-item label='角色名' prop='name'>
                    <el-input v-model='addForm.name'></el-input>
                </el-form-item>
                <el-form-item label='角色描述' prop='describ'>
                    <el-input v-model='addForm.describ'></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible=false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
        </el-dialog>

        <!-- 编辑界面 -->
        <el-dialog title='编辑' v-model='editFormVisible' :close-on-click-modal='false'>
            <el-form :model='editForm' label-width='100px' :rules='editFormRules' ref='editForm'>
                <el-form-item label='ID' prop='id'>
                    <el-input v-model='editForm.id' disabled></el-input>
                </el-form-item>
                <el-form-item label='角色名' prop='name' >
                    <el-input v-model='editForm.name'></el-input>
                </el-form-item>
                <el-form-item label='角色描述' prop='desc'>
                    <el-input v-model='editForm.desc'></el-input>
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
// 引入工具包
import util from '../../common/js/util'
// axios
import {
	getBackRoleList,
	getBackRoleById,
	addRole,
	editRole
} from '../../api/api';

export default {
	data() {
		return {
			listLoading: false,
			filters: {
				id: '',
			},
			users: [],

			// 新增界面
			addFormVisible: false, //新增界面是否显示
			addLoading: false, //新增界面是否显示加载
			addFormRules: { //新增界面表单规则
				name: [{
					required: true,
					message: '请输入角色名',
					trigger: 'blur'
				}],
				describ: [{
					required: true,
					message: '请输入角色描述',
					trigger: 'blur'
				}]
			},
			addForm: { //新增界面表单数据类型
				// name: '',
				// describ: ''
			},

			// 编辑界面
			editFormVisible: false, //编辑界面是否显示
			editLoading: false, //编辑界面是否显示加载
			editFormRules: { //编辑界面表单规则
				name: [{
					required: true,
					message: '请输入角色名',
					trigger: 'blur'
				}],
				desc: [{
					required: true,
					message: '请输入角色描述',
					trigger: 'blur'
				}]
			},
			editForm: { //编辑页面表单数据类型
				// name: '',
				// describ: ''
			}
		}
	},
	methods: {
		// 清除过滤信息
		handleIconClick_clearId() {
			this.filters.id = '';
		},
		// 加载数据
		loadBackRoleList() {
			this.listLoading = true;
            let para = {
                id : this.filters['id']
            }
			if (this.filters['id'] == '') {
				getBackRoleList()
                    .then((res) => {
                        if (res.data.success) {
    					    this.users = res.data.data;
    					}else{
                            this.$notify({
                                title: '错误',
                                message: res.data.msg,
                                type: 'error'
                            })
                            this.users = [];
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
                        this.listLoading = false;
                    })
			} else {
				let para = {
					id: this.filters['id']
				};
				getBackRoleById(para)
                    .then((res) => {
    					this.users = [];
    					if (res.data.success) {
    						this.users.push(res.data.data);
    					}else{
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
                        this.listLoading = false;
                    })
			}
		},
		// 显示列表(createTime转换)
		formatCreateTime(row, column) {
			return util.formatDate.format(new Date(row.createTime), 'yyyy/MM/dd   hh:mm:ss');
		},
		// 增加数据
		handleAdd() { //开始新增
			this.addFormVisible = true;
			this.addForm = {
				name: '',
				describ: ''
			}
		},
		addSubmit() { // 新增页面提交
			this.$refs.addForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.addLoading = true;
						let para = Object.assign({}, this.addForm);
						addRole(para).then((res) => {
							this.addLoading = false;
							if (res.data.success) {
								this.$notify({
                                    title: '成功',
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.loadBackRoleList();
							} else {
                                this.$notify({
                                    title: '错误',
                                    message: res.data.msg,
                                    type: 'error'
                                })
							}
						});
					});
				}
			});
		},
		// 编辑界面
		handleEdit(index, row) { //开始编辑
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row); // 把对象的值插入
		},
		editSubmit() { // 编辑页面提交
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗?', '提示', {}).then(() => {
						this.editLoading = true;
						let para = Object.assign({}, this.editForm);
						para['role_id'] = para['id'];
                        para['describ'] = para['desc'];
						delete para['id'];
                        delete para['desc'];
						editRole(para).then((res) => {
							this.editLoading = false;
							if (res.data.success) {
								this.$notify({
                                    title: '成功',
									message: '编辑成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.loadBackRoleList();
							} else {
                                this.$notify({
                                    title: '错误',
									message: res.data.msg,
									type: 'error'
								});
							}
						})
					})
				}
			})
		},
        // 进入角色权限的页面
        showRolePermsPage(index, row){
            this.$router.push({ path: '/rolePerm', query: { role_id: row.id } });
        }
	},
	mounted() {
		this.loadBackRoleList();
	}
}
</script>

<style lang="less">
.permsContent{
    margin: 5px 0;
}
.permsGroup{
    margin: 20px 0 0 0;
}
</style>
