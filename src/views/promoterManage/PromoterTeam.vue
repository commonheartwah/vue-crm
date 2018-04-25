<template lang="html">
	<section>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px'>
		  <el-form :inline='true' :model='filters' style='float: right'>
			  <el-form-item>
				  <el-button type='primary' @click='handleAdd'>新增</el-button>
			  </el-form-item>
		  </el-form>
		</el-col>

		<el-table border :data="formData" highlight-current-row v-loading="listLoading" style="width: 100%">
			<el-table-column prop='id' label='ID' width='100' sortable align='center'></el-table-column>
			<el-table-column prop='name' label='名称' align='center'></el-table-column>
			<el-table-column prop='num' label='编号' width='150' align='center'></el-table-column>
			<el-table-column prop='userName' label='队长' width='150' align='center' :formatter='formatUserName'></el-table-column>
			<el-table-column fixed="right" label='操作' width='220' align='center'>
				<template scope="scope">
					<el-button-group>
						<el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="info" size="small" @click="checkMembers(scope.$index, scope.row)">成员详情</el-button>
						<el-button type="warning" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</el-button-group>
		    </template>
			</el-table-column>
		</el-table>

		<el-col :span='24' class='toolbar'>
			<el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='filters.page_size' :total='filters.total' style='float: right'></el-pagination>
		</el-col>

		<el-dialog title='新增' v-model='addFormVisible'>
			<el-form :model='addForm' label-width='100px' :rules='formRules' ref='addForm'>
				<el-form-item label='小队编号' prop='pro_tm_num'>
					<el-input v-model='addForm.pro_tm_num'></el-input>
				</el-form-item>
				<el-form-item label='小队名称' prop='name'>
					<el-input v-model='addForm.name'></el-input>
				</el-form-item>
				<el-form-item label="选择队长">
					<el-select v-model="addForm.pro_id" placeholder="请输入成员手机号或分站号查询" style="width:340px;" filterable clearable remote :remote-method="selectMembersMethod" :loading='selectMembersLoading'>
						<el-option
						  v-for="item in Members"
						  :key="item.id"
						  :label="item.name + ' --> ' +  item.mobile"
						  :value="item.id">
						</el-option>
					</el-select>
		    	</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click="addTeamSubmit">提交</el-button>
			</div>
		</el-dialog>

		<el-dialog title='编辑' v-model='editFormVisible'>
			<el-form :model='editForm' label-width='100px' :rules='formRules' ref='editForm'>
				<el-form-item label='小队编号' prop='pro_tm_num'>
						<el-input v-model='editForm.pro_tm_num'></el-input>
				</el-form-item>
				<el-form-item label='小队名称' prop='name'>
						<el-input v-model='editForm.name'></el-input>
				</el-form-item>
				<el-form-item label="选择队长">
					<el-select v-model="checkType" placeholder="请输入成员手机号查询" style="width:100px;">
						<el-option label="分站号" :value="0"></el-option>
						<el-option label="手机号" :value="1"></el-option>
					</el-select>
					<el-select v-model="editForm.pro_id" placeholder="请输入成员手机号或分站号查询" style="width:340px;" filterable clearable remote :remote-method="selectMembersMethod" :loading='selectMembersLoading'>
						<el-option
						  v-for="item in Members"
						  :key="item.id"
						  :label="item.name + ' --> ' +  item.mobile"
						  :value="item.id">
						</el-option>
					</el-select>
		    	</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click="editTeamSubmit">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import {
	getPromoterTeamList,
	newPromoterTeam,
	updatePromoterTeam,
	delPromoterTeam,
	geUsersById,
	getTeamMemb,
	getProGroupMember
} from '../../api/api'
export default {
	data() {
		return {
			filters: {
				page_index: 1,
				page_size: 20,
				total: 0,
			},
			// 列表数据
			formData: [],
			listLoading: false,
			// 新增 相关
			addFormVisible: false,
			addForm: {},
			formRules: {
				pro_tm_num: [{
					required: true,
					message: '请输入计划编号',
					trigger: 'blur'
				}],
				name: [{
					required: true,
					message: '请输入计划名称',
					trigger: 'blur'
				}],
			},
			// 编辑 相关
			editFormVisible: false,
			editForm: {},
			// 选择组长
			Members: [], // 成员列表
			selectMembersLoading: false,

			checkType: 0
		}
	},
	methods: {
		catchFunc(error) {
			if (error.response) {
				this.$notify({
					title: error.response.status,
					message: '网络请求错误',
					type: 'error'
				})
			} else if (error.request) {
				this.$notify({
					title: error.request,
					message: '网络请求错误',
					type: 'error'
				})
			} else {
				this.$notify({
					title: '错误',
					message: error.message,
					type: 'error'
				})
			}
		},
		loadData() {
			let params = {
				page_index: this.filters.page_index,
				page_size: this.filters.page_size,
				pro_gp_id: this.$route.query.pro_gp_id,
			}
			getPromoterTeamList(params)
				.then((res) => {
					if (res.data.success) {
						this.formData = res.data.data.items
						this.filters.total = res.data.data.totalCount
					} else {
						this.$notify({
							title: '错误',
							message: res.data.msg,
							type: 'error'
						})
					}
					this.listLoading = false;
				})
				.catch((error) => {
					this.catchFunc(error)
				})
		},
		// 查找方法
		handleSeek() {
			this.loadData()
		},
		// 点击 name 输入框内错号按钮
		handleIconClickName() {
			this.filters.name = ''
			this.handleSeek()
		},
		// 点击 number 输入框内错号按钮
		handleIconClickNumber() {
			this.filters.number = ''
			this.handleSeek()
		},
		// 分页
		handleCurrentChange(val) {
			this.listLoading = true
			this.filters.page_index = val
			this.loadData()
		},
		// 新增页面
		// 显示新增界面
		handleAdd() {
			this.addFormVisible = true
			this.addForm = {
				pro_gp_id: this.$route.query.pro_gp_id,
				pro_tm_num: '',
				name: '',
				pro_id: '',
			}
		},
		addTeamSubmit() {
			this.$refs.addForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗?', '提示', {})
						.then(() => {
							newPromoterTeam(this.addForm)
								.then((res) => {
									if (res.data.success) {
										this.addFormVisible = false
									} else {
										this.$notify({
											title: '错误',
											message: res.data.msg,
											type: 'error'
										})
									}
									this.loadData()
								})
								.catch((error) => {
									this.catchFunc(error)
								})
						})
				}
			})
		},
		handleEdit(index, row) {
			this.editFormVisible = true
			this.$set(this.editForm, 'id', row.id)
			this.$set(this.editForm, 'pro_gp_id', this.$route.query.pro_gp_id)
			this.$set(this.editForm, 'name', row.name)
			this.$set(this.editForm, 'pro_tm_num', row.num)
			this.$set(this.editForm, 'pro_id', row.promoterId?row.promoterId:'')
			if (row.promoterId) {
				geUsersById({ user_ids: row.promoterId })
					.then((res) => {
						if (res.data.success) {
							let item = res.data.data[0]
							this.$set(this.Members, 0, {
								id: item.id,
								name: item.name,
								mobile: item.mobile,
							})
						} else {
							this.$notify({
								title: '错误',
								message: res.data.msg,
								type: 'error'
							})
						}
					})
					.catch((error) => {
						this.catchFunc(error)
					})
			}
		},
		selectMembersMethod(query) {
			if (query !== '') {
				let parameter = {
					pro_gp_id: this.$route.query.pro_gp_id
				};
				if (this.checkType) {
					parameter['phone'] = query
				} else {
					parameter['station_number'] = query
				}
				this.selectMembersLoading = true;
				getProGroupMember(parameter)
					.then((res) => {
						console.log(res);
						if (res.data.success) {
							if (res.data.data.items) {
								this.Members = res.data.data.items.map((item) => {
									let tempObj = {
										id: item.userWithInfo.user.id,
										name: item.userWithInfo.user.name,
										mobile: item.userWithInfo.user.mobile
									}
									return tempObj
								});
							}
						} else {
							// this.$notify.error(res.data.msg);
						}
						this.selectMembersLoading = false;
					})
					.catch((error) => {
						this.catchFunc(error)
					})
			} else {
				this.Members = [];
			}
		},
		editTeamSubmit() {
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗?', '提示', {})
						.then(() => {
							updatePromoterTeam(this.editForm)
								.then((res) => {
									if (res.data.success) {
										this.$notify({
											title: '成功',
											message: '修改成功',
											type: 'success',
											duration: 1500
										})
										this.editFormVisible = false
									} else {
										this.$notify({
											title: '错误',
											message: res.data.msg,
											type: 'error'
										})
									}
									this.loadData()
								})
								.catch((error) => {
									this.catchFunc(error)
								})
						})
				}
			})
		},
		checkMembers(index, row) {
			this.$router.push({
				path: '/ProMemberList',
				query: {
					from: 'Team',
					name: row.name,
					pro_tm_id: row.id
				}
			})
		},
		handleDel(index, row) {
			this.$confirm('确认删除吗?', '提示', {})
				.then(() => {
					let params = {
						id: row.id
					}
					delPromoterTeam(params)
						.then((res) => {
							if (res.data.success) {
								this.$notify({
									title: '成功',
									message: '删除成功',
									type: 'success',
									duration: 1500
								})
							} else {
								this.$notify({
									title: '错误',
									message: res.data.msg,
									type: 'error'
								})
							}
							this.loadData()
						})
						.catch((error) => {
							this.catchFunc(error)
						})
				})
				.catch(() => {})
		},
		formatUserName(row, column) {
			let property = column.property
            let name = row[property]
			if (name) {
				return name
			} else {
				return '无'
			}
		}
	},
	mounted() {
		this.loadData()
	}
}
</script>

<style lang="css">
</style>
