<template>
<div id="root">
	<!-- 过滤查询 -->
	<el-row>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
			<el-form :inline='true' :model='filters'>
				<!-- <el-form-item>
            <el-input v-model='filters.id' placeholder='ID' icon="circle-cross" :on-icon-click="handleIconClick_clearID" @keydown.native.prevent.enter='init' @change='init'></el-input>
          </el-form-item> -->
				<el-form-item>
					<el-input v-model='filters.name' placeholder='名称' icon="circle-cross" :on-icon-click="handleIconClick_clearName" @keydown.native.prevent.enter='init' @change='init'></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type='primary' @click='init'>查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type='primary' @click='handleAdd'>新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>
	</el-row>
	<!-- 列表 -->
	<el-table border :data="allData" highlight-current-row v-loading="initLoading" style="width: 100%;">
		<el-table-column prop="id" label="ID(家族)" width="125" align='center'></el-table-column>
		<el-table-column prop="backendId" label="ID(后台)" width="125" align='center'></el-table-column>
		<el-table-column prop="number" label="编号" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column prop="name" label="名字" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column prop="description" label="描述" min-width="200" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column prop="phone" label="手机号" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column label="操作" align="center" width="150">
			<template scope="scope">
          <el-button-group>
            <el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          </el-button-group>
        </template>
		</el-table-column>
	</el-table>

	<!-- 新增 更新 -->
	<el-dialog title='' v-model='formVisible' :close-on-click-modal='false' size="small">
		<el-form :model='form' :rules='formRules' label-width='80px' ref="form" label-position="right">
			<el-form-item label='ID' v-show="form.id">
				<el-input v-model='form.id' style="width: 100px;" disabled="disabled"></el-input>
			</el-form-item>
			<el-form-item label='名称'>
				<el-input v-model='form.name' style="width: 450px;"></el-input>
			</el-form-item>
			<el-form-item label='编号'>
				<el-input v-model='form.number' style="width: 450px;"></el-input>
			</el-form-item>
			<el-form-item label='描述'>
				<el-input type="textarea" v-model='form.description' style="width: 450px;"></el-input>
			</el-form-item>
			<el-form-item label='选择'>
				<el-select v-model="selOpUsers" style="width: 450px;" placeholder="请输入名称或ID查询" filterable clearable remote :remote-method="selOpUsersRemoteMethod" :loading='selOpUsersLoading'>
					<el-option v-for="item in selOpUsersOptions" :key="item.id" :label="'（' + item.id + '）' + item.name + '----' + item.displayName" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="formVisible = false">取消</el-button>
			<el-button type="primary" @click.native="handleSubmit" :loading="formLoading">提交</el-button>
		</div>
	</el-dialog>

	<!-- 分页条 -->
	<el-col :span='24' class='toolbar'>
		<el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='page_size' :total='totalCount' style='float: right'></el-pagination>
	</el-col>
</div>
</template>

<script>
import {
	getPromoterFamilyList,
	addPromoterFamily,
	updatePromoterFamily,
	getPromoterFamily_OpUser
} from "../../api/api";
export default {
	data() {
		return {
			filters: {
				id: "",
				name: ""
			},
			// 表单
			allData: [],
			initLoading: false,
			// 分页
			totalCount: 1,
			page_index: 1,
			page_size: 20,
			/**
			 * @description 表单 新增
			 * @description form 表单数据
			 * @description formRules 表单规则
			 * @description formVisible 是否显示表单
			 * @description formLoading 表单提交按钮的loading状态
			 */
			formVisible: false,
			formLoading: false,
			form: {
				english: ""
			},
			formRules: {
				name: [{
					required: true,
					message: "名称为必填项",
					trigger: "blur"
				}],
				status: [{
					required: true
				}]
			},
			// 远程选择
			selOpUsers: "",
			selOpUsersLoading: false,
			selOpUsersOptions: []
		};
	},
	methods: {
		/***
		 * @function handleIconClick_clearID 清除ID
		 * @function handleIconClick_clearName 清除名称
		 */
		handleIconClick_clearID() {
			this.filters.id = "";
		},
		handleIconClick_clearName() {
			this.filters.name = "";
		},
		/***
		 * @function 分页
		 */
		handleCurrentChange(val) {
			this.page_index = val;
			this.init();
		},

		/**
		 * @function 加载数据
		 */
		init() {
			let params = {
				page_index: this.page_index,
				page_size: this.page_size,
				id: this.filters.id,
				name: this.filters.name
			};
			this.initLoading = true;
			getPromoterFamilyList(params)
				.then(res => {
					if (res.data.success) {
						this.initLoading = false;
						this.allData = res.data.data.items;
						this.totalCount = res.data.data.totalCount;
					} else {
						this.$notify({
							title: "错误",
							message: res.data.msg,
							type: "error"
						});
					}
				})
				.catch(error => {
					this._catch(error);
				});
		},

		/**
		 * @function handleAdd 新增
		 * @function handleEdit 编辑
		 * @function handleSubmit 提交
		 */
		handleAdd() {
			this.form = {
				name: "",
				number: "",
				description: ""
			};
			this.selOpUsers = "";
			this.formVisible = true;
		},
		handleEdit(index, row) {
			this.selOpUsers = row.backendId;
			this.$set(this.selOpUsersOptions, 0, {
				id: row.backendId,
				name: row.name,
				displayName: row.backendName
			})
			this.form = Object.assign({}, row);
			this.formVisible = true;
			console.log(this.selOpUsers);
			console.log(this.selOpUsersOptions);
		},
		handleSubmit() {
			let submitFunc, para;

			if (this.form.id > 0) {
				para = {
					id: this.form.id,
					user_id: this.selOpUsers,
					name: this.form.name,
					number: this.form.number,
					description: this.form.description
				};
				submitFunc = updatePromoterFamily;
			} else {
				para = Object.assign({}, this.form);
				para["user_id"] = this.selOpUsers;
				submitFunc = addPromoterFamily;
			}

			this.$refs.form.validate(valid => {
				if (valid) {
					this.$confirm("确认提交吗?", "提示", {}).then(() => {
						submitFunc(para).then(res => {
							if (res.data.success) {
								this.$notify({
									title: "成功",
									type: "success",
									message: "操作成功"
								});
								this.formVisible = false;
								this.initLoading = true;
								this.init();
							} else {
								this.$notify({
									title: "错误",
									type: "error",
									message: res.data.msg
								});
							}
						})
						.catch(error => {
							this._catch(error);
						});
					});
				}
			});
		},

		/****
		 * @description 从素材库上传
		 * @augments query
		 */
		selOpUsersRemoteMethod(query) {
			if (query !== "") {
				this.selOpUsersLoading = true;
				let temp = Number(query);
				let parameter = {};
				temp ? (parameter["id"] = temp) : (parameter["name"] = query);
				getPromoterFamily_OpUser(parameter).then(res => {
					if (res.data.success && res.data.data.items) {
						this.selOpUsersOptions = res.data.data.items.map(item => {
							let tempObj = {
								id: item.id,
								name: item.name,
								displayName: item.displayName
							};
							return tempObj;
						});
					}
					this.selOpUsersLoading = false;
				})
				.catch(error => {
					this._catch(error);
				});
			} else {
				this.selOpUsersOptions = [];
			}
		},
		/**
		 * [_catch description]
		 * @param  {[type]} error [错误信息]
		 */
		_catch(error) {
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
		}
	},
	mounted() {
		this.init();
	}
};
</script>

<style lang="less" scoped>
</style>
