<template lang="html">
	<section>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px'>
		    <el-form :inline='true' :model='filters'>
				<el-form-item>
					<el-select v-model="filters.group_id" style="width: 220px;" placeholder="请填写小组名称搜索" filterable clearable remote :remote-method="organizationRemoteMethod" :loading='organizationLoading' @change='init'>
						<el-option v-for="item in organizationOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-select v-model="filters.date_range" style="width: 300px;" placeholder="请输入期次名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" :loading='selDateRangeLoading'>
						<el-option v-for="item in selDateRangeOptions" :key="item.id" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type='primary' @click='init'>查询</el-button>
					<el-button type='primary' @click='handleAdd'>新增</el-button>
				</el-form-item>
		    </el-form>
		</el-col>

		<el-table border :data="allData" highlight-current-row v-loading="initLoading" style="width: 100%;">
			<el-table-column prop="entity.id" label="ID" width="80" align='center'></el-table-column>
			<el-table-column prop="entity.groupName" label="小组" min-width="120" align='center' show-overflow-tooltip></el-table-column>
			<el-table-column prop="entity.dateRangeName" label="销售期" min-width="150" align='center' show-overflow-tooltip></el-table-column>
			<el-table-column prop="entity.target" label="目标" width="80" align='center'></el-table-column>
			<el-table-column :prop="'parsed.dateNodeTargets.' + index + '.target'" :formatter="formatTarget" :label="'节点' + (index + 1) + '目标'" width="100" align='center' v-for="(tit, index) in flexible_title" :key="index"></el-table-column>
			<el-table-column :prop="'parsed.sprintTargets.' + index + '.target'" :formatter="formatTarget" :label="'节点' + (flexible_title.length + 1) + '第' + (index + 1) + '天目标'" width="100" align='center' v-for="(tit, index) in flexible_length" :key="index + 'index'"></el-table-column>
			<el-table-column fixed="right" label='操作' width='130' align='center'>
				<template scope="scope">
					<el-button-group>
						<el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button type="warning" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
					</el-button-group>
		    	</template>
			</el-table-column>
		</el-table>

		<!-- 分页条 -->
		<el-col :span='24' class='toolbar'>
			<el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='page_size' :total='totalCount' style='float: right'></el-pagination>
		</el-col>

		<el-dialog :title="form.id ? '编辑' : '新增'" :visible.sync="dialogPromoterTarget" :close-on-click-modal="false">
			<el-form :model='form' label-width='120px' ref="form" label-position="right">
				<el-form-item label='ID' v-show="form.id">
					<el-input v-model='form.id' style="width: 100px;" disabled="disabled"></el-input>
				</el-form-item>

				<el-form-item label='推广人组'>
					<el-select v-model="form.group_id" style="width: 330px;" placeholder="请填写小组名称搜索" filterable clearable remote :remote-method="organizationRemoteMethod" :loading='organizationLoading'>
						<el-option v-for="item in organizationOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label='推广人期次'>
					<el-select v-model="form.date_range" style="width: 330px;" placeholder="请输入期次名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" @change='changeRangeFunc' :loading='selDateRangeLoading'>
						<el-option v-for="item in selDateRangeOptions" :key="item.id" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item v-if="!dateRangeList.length">
					<div>当前未选择批次或批次下无有效节点</div>
				</el-form-item>

				<!-- 只有编辑状态才会出现 -->
				<div v-if="form.date_range">
					<el-form-item label="总目标值">
						<el-input v-model="form.target" style="width: 330px;"></el-input>
					</el-form-item>
					<div v-if="dateRangeList.length">
						<el-form-item v-show="dateRangeList.length" :label="node.name + '目标值'" v-for="(node, i) in dateRangeList" :key="i + 'dateRangeList'">
							<el-input v-model="node.target" style="width: 330px;"></el-input>
						</el-form-item>
					</div>

					<el-form-item v-if="type === 3" v-show="sprintTarget.length" :label="'第' + (i + 1) + '天冲刺目标值'" v-for="(item, i) in sprintTarget" :key="i + 'sprintTarget'">
						<el-input v-model="item.target" style="width: 330px; margin-right: 15px;"></el-input>
						<el-button type="text" icon="close" size="mini" @click="sprintTarget.splice(i, 1)"></el-button>
					</el-form-item>

					<el-form-item>
						<el-button v-if="type === 3" type="success" size="mini" icon="plus" @click="sprintTarget.push({ target: '' })">添加目标</el-button>
					</el-form-item>
				</div>

			</el-form>

			<span slot="footer" class="dialog-footer">
  		    	<el-button @click="dialogPromoterTarget = false">取 消</el-button>
  		    	<el-button type="primary" @click="submitFunc">确 定</el-button>
  		  	</span>
  		</el-dialog>
	</section>
</template>

<script>
import util from '../../../common/js/util'
import {
	addProGroupTarget,
	updateProGroupTarget,
	getProGroupTarget,
	delProGroupTarget,
	getPromoterGroupList,
	getDateRangeList,
	getDateNodeList
} from '../../../api/api'
export default {
	props: {
		type: {
			type: Number,
			required: true,
		}
	},
	data() {
		return {
			filters: {
				group_id: "",
				type: "",
				date_range: '',
			},
			page_index: 1,
			totalCount: 1,
			page_size: 20,
			allData: [],
			initLoading: false,

			organizationOptions: [],
			organizationLoading: false,

			selDateRangeLoading: false,
			selDateRangeOptions: [],

			flexible_title: [],
			flexible_length: [],

			dialogPromoterTarget: false,
			form: {},

			dateRangeList: [],
			sprintTarget: []
		}
	},
	methods: {
		/**
		 * [dateRangeSelect 如果检索条件里的销售期为空必须携带默认参数，此为请求默认参数id的方法]
		 * @return {[type]} [description]
		 */
		dateRangeSelect() {
			let parameter = {
				name: '',
				type: this.type
			};
			getDateRangeList(parameter).then(res => {
					if (res.data.success && res.data.data.items) {
						this.selDateRangeOptions = res.data.data.items.map(item => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
								startTime: util.formatDate.format(new Date(item.entity.startTime), 'yyyy/MM/dd'),
								endTime: util.formatDate.format(new Date(item.entity.endTime), 'yyyy/MM/dd'),
							};
							return tempObj;
						});
						this.$set(this.filters, 'date_range', this.selDateRangeOptions[0].id);
						// 加载列表数据
						this.init()
					}
					this.selDateRangeLoading = false;
				})
				.catch(error => {
					this._catch(error);
				});
		},
		/**
		 * [init 初始化]
		 * @return {[type]} [description]
		 */
		init() {
			if (!this.filters.date_range) {
				this.dateRangeSelect();
				return;
			}
			let params = {
				page_index: this.page_index,
				page_size: this.page_size,
				group_id: this.filters.group_id,
				type: this.type,
				date_range_id: this.filters.date_range
			};
			this.initLoading = true;
			this.flexible_title = [];
			this.flexible_length = [];
			this.allDat = [];
			getProGroupTarget(params)
				.then(res => {
					if (res.data.success) {
						this.allData = res.data.data.data.items;
						this.totalCount = res.data.data.data.totalCount;
						if (this.allData.length) {
							this.flexible_title = this.allData[0].parsed.dateNodeTargets;
							this.flexible_length = this.allData[0].parsed.sprintTargets;
						}
					} else {
						this.$notify({
							title: "错误",
							message: res.data.msg,
							type: "error"
						});
					}
					this.initLoading = false;
				})
				.catch(error => {
					this._catch(error);
					this.initLoading = false;
				});
		},
		/**
		 * [handleCurrentChange 分页]
		 * @param  {[type]} val [页数]
		 * @return {[type]}     [description]
		 */
		handleCurrentChange(val) {
			this.page_index = val;
			this.init();
		},
		/**
		 * [organizationRemoteMethod 查找小组的方法]
		 * @param  {[type]} query [输入值]
		 * @return {[type]}       [description]
		 */
		organizationRemoteMethod(query) {
			let searchApi;
			searchApi = getPromoterGroupList;
			if (query !== "") {
				this.organizationLoading = true;
				let parameter = {
					name: query
				};
				searchApi(parameter).then(res => {
						if (res.data.success && res.data.data.items) {
							this.organizationOptions = res.data.data.items.map(item => {
								let tempObj = {
									id: item.id,
									name: item.name,
								};
								return tempObj;
							});
						}
						this.organizationLoading = false;
					})
					.catch(error => {
						this._catch(error);
					});
			} else {
				this.organizationOptions = [];
			}
		},
		/**
		 * [selDateRangeRemoteMethod 选择批次的方法]
		 * @param  {[type]} query [输出值]
		 * @return {[type]}       [description]
		 */
		selDateRangeRemoteMethod(query) {
			if (query !== "") {
				this.selDateRangeLoading = true;
				let parameter = {
					name: query,
					type: this.type
				};
				getDateRangeList(parameter).then(res => {
						if (res.data.success && res.data.data.items) {
							this.selDateRangeOptions = res.data.data.items.map(item => {
								let tempObj = {
									id: item.entity.id,
									name: item.entity.name,
									startTime: util.formatDate.format(new Date(item.entity.startTime), 'yyyy/MM/dd'),
									endTime: util.formatDate.format(new Date(item.entity.endTime), 'yyyy/MM/dd'),
								};
								return tempObj;
							});
						}
						this.selDateRangeLoading = false;
					})
					.catch(error => {
						this._catch(error);
					});
			} else {
				this.selDateRangeOptions = [];
			}
		},
		/**
		 * [handleAdd 点击新增时候的方法]
		 * @return {[type]} [description]
		 */
		handleAdd() {
			this.j = false
			this.dialogPromoterTarget = true;
			this.form = {
				group_id: '',
				date_range: '',
				node_target: '',
				sprint_target: '',
				target: ''
			}

			this.dateRangeList = [];
			this.sprintTarget = [];
		},
		/**
		 * [handleEdit 点击编辑时候的方法]
		 * @param  {[type]} index [索引]
		 * @param  {[type]} row   [当前行的数据]
		 * @return {[type]}       [description]
		 */
		handleEdit(index, row) {
			this.$set(this.$data, 'dateRangeList', [])
			this.$set(this.$data, 'sprintTarget', [])

			this.j = true
			this.dialogPromoterTarget = true;
			this.form = {
				id: row.entity.id,
				group_id: row.entity.groupId,
				date_range: row.entity.dateRangeId,
				target: row.entity.target
			};
			if (row.parsed && row.parsed.dateNodeTargets && row.parsed.dateNodeTargets.length) {
				for (var i = 0; i < row.parsed.dateNodeTargets.length; i++) {
					let item = row.parsed.dateNodeTargets[i];
					this.$set(this.dateRangeList, i, {
						id: item.nodeId,
						name: item.nodeName,
						target: item.target
					})
				}
			}
			if (row.parsed && row.parsed.sprintTargets && row.parsed.sprintTargets.length) {
				for (var i = 0; i < row.parsed.sprintTargets.length; i++) {
					let item = row.parsed.sprintTargets[i];
					this.$set(this.sprintTarget, i, {
						target: item.target
					})
				}
			}
			this.selDateRangeRemoteMethod(row.entity.dateRangeName);
			this.organizationRemoteMethod(row.entity.groupName);
		},
		handleDel(index, row) {
			this.$confirm('此操作将永久删除, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				delProGroupTarget({ ids: row.entity.id })
					.then(res => {
						if (res.data.success) {
							this.$message({
								type: 'success',
								message: '删除成功!',
							});
							this.init();
						} else {
							this.$notify({
								type: 'error',
								message: res.data.msg,
								title: '失败'
							});
						}
					})
					.catch(error => {
						this._catch(error);
					});

			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		/**
		 * [changeRangeFunc 当改变表单内推广人销售期时的回调]
		 * @param  {[type]} value [销售期ID]
		 * @return {[type]}       [description]
		 */
		changeRangeFunc(value) {
			if (this.j) {
				this.j = false
				return
			}
			this.form.target = '';
			this.$set(this.$data, 'dateRangeList', [])
			this.$set(this.$data, 'sprintTarget', [])
			if (value) {
				let params = {
					date_range_id: this.form.date_range,
				};
				getDateNodeList(params)
					.then(res => {
						if (res.data.success) {
							this.dateRangeList = res.data.data.items.map(item => {
								return {
									id: item.entity.id,
									name: item.entity.name,
									target: ''
								}
							});
							this.dateRangeList.reverse();
							for (var i = 0; i < 7; i++) {
								this.sprintTarget.push({
									target: ''
								})
							}
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
			} else {
				this.dateRangeList = [];
				this.sprintTarget = [];
			}

		},
		/**
		 * [submitFunc 提交表单]
		 * @return {[type]} [description]
		 */
		submitFunc() {
			if (!this.form.group_id) {
				this.$message({
					title: "错误",
					message: '请选择一个小组',
					type: "error"
				});
				return;
			}
			if (!this.form.target) {
				this.$message({
					title: "错误",
					message: '请填写总目标值',
					type: "error"
				});
				return;
			}
			this.form['node_target'] = '';
			this.form['sprint_target'] = '';
			for (var i = 0; i < this.dateRangeList.length; i++) {
				let item = this.dateRangeList[i];
				if (item.target !== null && item.target !== '') {
					this.form['node_target'] += item.id + ':' + item.target + ',';
				} else {
					this.$message({
						message: '请填写节点目标值',
						type: "error"
					});
					return
				}
			}
			if (this.type === 3) {
				for (var i = 0; i < this.sprintTarget.length; i++) {
					let item = this.sprintTarget[i];
					if (item.target !== null && item.target !== '') {
						this.form['sprint_target'] += item.target + ',';
					} else {
						this.$message({
							message: '请填写冲刺目标值',
							type: "error"
						});
						return
					}
				}
			}
			let submitFunc;
			let param = {
				group_id: this.form.group_id,
				date_range_id: this.form.date_range,
				node_target: this.form.node_target,
				target: this.form.target,
				sprint_target: this.form.sprint_target
			}
			if (this.form.id) {
				// param['group_id'] = this.form.group_id;
				param['id'] = this.form.id;
				submitFunc = updateProGroupTarget;
			} else {
				submitFunc = addProGroupTarget
			}
			submitFunc(param)
				.then(res => {
					if (res.data.success) {
						this.$message({
							message: '已成功添加或修改',
							type: "success"
						});
						this.init();
						this.dialogPromoterTarget = false;
					} else {
						this.$notify({
							message: res.data.msg,
							type: "error"
						});
					}
				})
				.catch(error => {
					this._catch(error);
				})
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
		},
		formatTarget(row, column) {
			let property = column.property.split('.');
			if (!row[property[0]][property[1]].length) {
				return '';
			} else {
				return row[property[0]][property[1]][property[2]][property[3]];
			};
		},
	},
	created() {
		this.dateRangeSelect();
	}
}
</script>

<style lang="css">
</style>
