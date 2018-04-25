<template lang="html">
	<section>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px'>
		  <el-form :inline='true' :model='filters'>
			  <el-form-item>
				  <el-input v-model='filters.name' placeholder='请输入推广组名称'  @keydown.enter.native.prevent @change="handleSeek" icon="circle-cross" :on-icon-click="handleIconClickName"></el-input>
			  </el-form-item>
				<el-form-item>
				  <el-input v-model='filters.number' placeholder='请输入推广组编号'  @keydown.enter.native.prevent @change="handleSeek" icon="circle-cross" :on-icon-click="handleIconClickNumber"></el-input>
			  </el-form-item>
			  <el-form-item>
					<el-button type='primary' @click='handleSeek'>查询</el-button>
				  <el-button type='primary' @click='handleAdd'>新增</el-button>
			  </el-form-item>
		  </el-form>
		</el-col>

		<el-table border :data="formData" highlight-current-row v-loading="listLoading" style="width: 100%">
			<el-table-column prop='id' label='ID' width='75' sortable align='center'></el-table-column>
			<el-table-column prop='name' label='名称' width='200' align='center'></el-table-column>
			<el-table-column prop='number' label='编号' width='100' align='center'></el-table-column>
			<el-table-column prop='userName' label='组长' width='180' align='center' :formatter='formatUserName' show-overflow-tooltip></el-table-column>
			<el-table-column prop='description' label='描述' align='center'></el-table-column>
			<el-table-column fixed="right" label='操作' width='220' align='center'>
				<template scope="scope">
					<el-button-group>
						<el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="info" size="small" @click="checkMembers(scope.$index, scope.row)">成员详情</el-button>
						<el-button type="warning" size="small" @click="checkTeams(scope.$index, scope.row)">小队详情</el-button>
					</el-button-group>
		    </template>
			</el-table-column>
		</el-table>

		<el-col :span='24' class='toolbar'>
			<el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='filters.page_size' :total='filters.total' style='float: right'></el-pagination>
		</el-col>

		<el-dialog title='新增' v-model='addFormVisible'>
			<el-form :model='addForm' label-width='100px' :rules='formRules' ref='addForm'>
				<el-form-item label='推广组编号' prop='number'>
						<el-input v-model='addForm.number'></el-input>
				</el-form-item>
				<el-form-item label='推广组名称' prop='name'>
						<el-input v-model='addForm.name'></el-input>
				</el-form-item>
				<el-form-item label='推广组描述' prop='description'>
						<el-input type="textarea" v-model='addForm.description'></el-input>
				</el-form-item>
				<el-form-item label="选择家族长">
					<el-select v-model="addForm.family_id" placeholder="请输入家族名称搜索" style="width:340px;" filterable clearable remote :remote-method="selectFamilyMethod" :loading='selectFamilyLoading'>
						<el-option
						  v-for="item in Family"
						  :key="item.id"
						  :label="'（' + item.id + '）' + item.name + ' --> ' +  item.mobile"
						  :value="item.id">
						</el-option>
					</el-select>
		    	</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click="addGroupSubmit">提交</el-button>
			</div>
		</el-dialog>

		<el-dialog title='编辑' v-model='editFormVisible'>
			<el-form :model='editForm' label-width='100px' :rules='formRules' ref='editForm'>
				<el-form-item label='推广组编号' prop='number'>
						<el-input v-model='editForm.number'></el-input>
				</el-form-item>
				<el-form-item label='推广组名称' prop='name'>
						<el-input v-model='editForm.name'></el-input>
				</el-form-item>
				<el-form-item label='推广组描述'>
						<el-input type="textarea" v-model='editForm.desc'></el-input>
				</el-form-item>
				<el-form-item label="选择组长">
					<el-select v-model="editForm.leader" placeholder="请输入成员用户名或手机号" style="width:340px;" filterable clearable remote :remote-method="selectMembersMethod" :loading='selectMembersLoading'>
						<el-option
						  v-for="item in Members"
						  :key="item.id"
						  :label="'（' + item.id + '）' + item.name + ' --> ' +  item.mobile"
						  :value="item.id">
						</el-option>
					</el-select>
		    	</el-form-item>
				<el-form-item label="选择家族长">
					<el-select v-model="editForm.family_id" placeholder="请输入家族名称搜索" style="width:340px;" filterable clearable remote :remote-method="selectFamilyMethod" :loading='selectFamilyLoading'>
						<el-option
						  v-for="item in Family"
						  :key="item.id"
						  :label="'（' + item.id + '）' + item.name + ' --> ' +  item.mobile"
						  :value="item.id">
						</el-option>
					</el-select>
		    	</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click="editGroupSubmit">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import {
	getPromoterGroupList,
	addPromoterGroup,
	updatePromoterGroup,
	geUsersById,
	getGroupMemb,
	getPromoterFamilyList
} from '../../api/api'
export default {
	data() {
		return {
			filters: {
				page_index: 1,
				page_size: 20,
				total: 0,
				name: '',
				number: ''
			},
			// 文章列表数据
			formData: [],
			listLoading: false,
			// 新增组 相关
			addFormVisible: false,
			addForm: {},
			formRules: {
				number: [{
					required: true,
					message: '请输入计划编号',
					trigger: 'blur'
				}],
				name: [{
					required: true,
					message: '请输入计划名称',
					trigger: 'blur'
				}]
			},
			// 编辑组 相关
			editFormVisible: false,
			editForm: {},
			// 选择组长
			Members: [], // 成员列表
			selectMembersLoading: false,
			// 选择家族
			Family: [], // 成员列表
			selectFamilyLoading: false,
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
			this.listLoading = true
			let params = {
				page_index: this.filters.page_index,
				page_size: this.filters.page_size,
				name: this.filters.name,
				number: this.filters.number
			}
			getPromoterGroupList(params)
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
					this.listLoading = false;
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
			this.filters.page_index = val
			this.loadData()
		},
		// 新增页面
		// 显示新增界面
		handleAdd() {
			this.addFormVisible = true
			this.addForm = {
				number: '',
				name: '',
				description: '',
				family_id: '',
			}
		},
		addGroupSubmit() {
			this.$refs.addForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗?', '提示', {})
						.then(() => {
							addPromoterGroup(this.addForm)
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
			this.$set(this.editForm, 'name', row.name)
			this.$set(this.editForm, 'number', row.number)
			this.$set(this.editForm, 'desc', row.description)
			this.$set(this.editForm, 'leader', row.leader ? row.leader : '')
			this.$set(this.editForm, 'family_id', row.familyId ? row.familyId : '')
			if (row.familyId) {
				this.selectFamilyMethod(row.familyName)
			}
			if (row.leader) {
				geUsersById({
						user_ids: row.leader
					})
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
				let temp = Number(query);
				let parameter = {
					promoter_group_id: this.editForm.id
				};
				if (temp) {
					parameter['phone'] = temp
				} else {
					parameter['username'] = query
				};
				this.selectMembersLoading = true;
				getGroupMemb(parameter)
					.then((res) => {
						if (res.data.success) {
							this.Members = res.data.data.map((item) => {
								let tempObj = {
									id: item.id,
									name: item.name,
									mobile: item.mobile
								}
								return tempObj
							});
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
		selectFamilyMethod(query) {
			if (query !== '') {
				let parameter = {
					name: query
				};
				this.selectFamilyLoading = true;
				getPromoterFamilyList(parameter)
					.then((res) => {
						if (res.data.success) {
							this.Family = res.data.data.items.map((item) => {
								let tempObj = {
									id: item.id,
									name: item.name,
									mobile: item.phone
								}
								return tempObj
							});
						} else {
							// this.$notify.error(res.data.msg);
						}
						this.selectFamilyLoading = false;
					})
					.catch((error) => {
						this.catchFunc(error)
					})
			} else {
				this.Family = [];
			}
		},
		editGroupSubmit() {
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗?', '提示', {})
						.then(() => {
							updatePromoterGroup(this.editForm)
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
					from: 'group',
					promoter_group_id: row.id,
					name: row.name
				}
			})
		},
		checkTeams(index, row) {
			this.$router.push({
				path: '/PromoterTeam',
				query: {
					pro_gp_id: row.id
				}
			})
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
