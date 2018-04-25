<template>
<div id="root">
	<!-- 过滤查询 -->
	<el-row>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
			<el-form :inline='true' :model='filters'>
				<el-form-item>
					<el-select v-model="filters.date_range_id" style="width: 280px;" placeholder="请输入名称日期段查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod"  @change='init' :loading='selDateRangeLoading'>
						<el-option v-for="item in selDateRangeOptions" :key="item" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.promoter_id" style="width: 280px;" placeholder="请输入推广人分站号或ID查询" filterable clearable remote :remote-method="selPromoterRemoteMethod" :loading='selPromoterLoading' @change='init'>
						<el-option v-for="item in selPromoterOptions" :key="item" :label="item.name + '----' + item.mobile" :value="item.id">
						</el-option>
					</el-select>
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
	<el-table border :data="allData" highlight-current-row v-loading="initLoading" @selection-change="handleSelectionChange" style="width: 100%;">
		<el-table-column type="selection" width="55"></el-table-column>
		<el-table-column prop="entity.id" label="ID" width="80" align='center'></el-table-column>
		<el-table-column prop="entity.userName" label="推广人名称" width="150" align='center'></el-table-column>
		<el-table-column prop="entity.position" label="推广人身份" width="120" align='center'></el-table-column>
		<el-table-column prop="entity.phone" label="推广人手机号" width="150" align='center'></el-table-column>
		<el-table-column prop="entity.rangeName" label="日期段名称" width="150" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column prop="entity.targetTransNumber" label="招生转化目标值" width="140" align='center'></el-table-column>
		<el-table-column prop="entity.truthTransNumber" label="真实的转化招生数" width="150" align='center'></el-table-column>
		<el-table-column prop="entity.targetTransRate" label="招生目标组转化率" width="160" align='center'></el-table-column>
		<el-table-column prop="entity.targetNumber" label="招生目标值" width="115" align='center'></el-table-column>
		<el-table-column prop="entity.description" label="描述" width="200" align='center'></el-table-column>
		<el-table-column label="操作" align="center" fixed="right" width="160">
			<template scope="scope">
	            <el-button-group>
				    <el-button type="info" size="small" @click="handleUserList(scope.$index, scope.row)">招生列表</el-button>
	                <el-button type="success" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
	            </el-button-group>
	        </template>
		</el-table-column>
	</el-table>

	<!-- 新增 更新 -->
	<el-dialog title='' v-model='formVisible' :close-on-click-modal='false' size="small">
		<el-form :model='form' :rules='formRules' label-width='80px' ref="form" label-position="right">
			<el-form-item label='推广人'>
				<el-select v-model="selPromoter" style="width: 450px;" placeholder="请输入分站号或ID查询" filterable clearable remote :remote-method="selPromoterRemoteMethod" :loading='selPromoterLoading'>
					<el-option v-for="item in selPromoterOptions" :key="item" :label="'（' + item.id + '）' + item.name + '----' + item.mobile" :value="item">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label='日期段'>
				<el-select v-model="selDateRange" style="width: 450px;" placeholder="请输入名称或ID查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" :loading='selDateRangeLoading'>
					<el-option v-for="item in selDateRangeOptions" :key="item" :label="'（' + item.id + '）' + item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label='描述'>
				<el-input type="textarea" v-model='form.description' style="width: 450px;"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="formVisible = false">取消</el-button>
			<el-button type="primary" @click.native="handleSubmit" :loading="formLoading">提交</el-button>
		</div>
	</el-dialog>

	<!-- 分页条 -->
	<el-col :span='24' class='toolbar'>
		<el-button type='success' @click='handleDelPromoterRange' :disabled="this.selsArr.length===0">批量删除</el-button>
		<el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='page_size' :total='totalCount' style='float: right'></el-pagination>
	</el-col>
</div>
</template>

<script>
import util from '../../common/js/util'
import {
	addPromoterRange,
	addUserToProRange,
	delPromoterRange,
	getPromoterRangeList,
	getDateRangeList,
	getPromoterList
} from "../../api/api";
export default {
	data() {
		return {
			filters: {
				date_range_id: "",
				promoter_id: ""
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
			selsArr: [],
			// 远程选择
			selPromoter: "",
			selPromoterLoading: false,
			selPromoterOptions: [],

			selDateRange: "",
			selDateRangeLoading: false,
			selDateRangeOptions: []
		};
	},
	methods: {
		/***
		 * @function handleIconClick_clearID 清除ID
		 * @function handleIconClick_clearPromoterId 清除名称
		 */
		handleIconClick_clearID() {
			this.filters.date_range_id = "";
		},
		handleIconClick_clearPromoterId() {
			this.filters.promoter_id = "";
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
				date_range_id: this.filters.date_range_id,
				promoter_id: this.filters.promoter_id
			};
			this.initLoading = true;
			getPromoterRangeList(params)
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
		 * @function handleDel 删除
		 * @function handleSubmit 提交
		 */
		handleAdd() {
			this.form = {
				description: ""
			};
			this.selPromoter = "";
			this.selDateRange = "";
			this.formVisible = true;
		},
		handleUserList(index, row) {
			this.$router.push({
				name: '招生成员列表',
				query: {
					promoterRangeId: row.entity.id
				}
			})
		},
		handleDel(index, row) {
			this.$confirm("确认删除吗?", "提示", {}).then(() => {
				let para = {
					ids: row.entity.id
				}
				delPromoterRange(para).then(res => {
					if (res.data.success) {
						this.$notify({
							title: "成功",
							type: "success",
							message: "操作成功"
						});
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
			})
		},
		handleSelectionChange(val) {
			this.selsArr = val;
		},
		handleDelPromoterRange() {
			let para = { ids: '' }
			for (var i = 0; i < this.selsArr.length; i++) {
				let item = this.selsArr[i]
				para.ids += item.entity.id + ','
			}
			this.$confirm("确认删除吗?", "提示", {}).then(() => {
				delPromoterRange(para).then(res => {
					if (res.data.success) {
						this.$notify({
							title: "成功",
							type: "success",
							message: "操作成功"
						});
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
			})
		},
		handleSubmit() {
			if (!this.selPromoter) {
				this.$notify({
					title: "警告",
					type: "warning",
					message: "请选择推广人"
				});
				return
			}
			if (!this.selDateRange) {
				this.$notify({
					title: "警告",
					type: "warning",
					message: "请选择时间段"
				});
				return
			}
			let para = {
				pro_id: this.selPromoter.id,
				date_range_id: this.selDateRange.id,
				description: this.form.description
			};
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$confirm("确认提交吗?", "提示", {}).then(() => {
						addPromoterRange(para).then(res => {
							if (res.data.success) {
								this.$notify({
									title: "成功",
									type: "success",
									message: "操作成功"
								});
								this.selPromoter = '';
								this.selDateRange = '';
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
		selPromoterRemoteMethod(query) {
			if (query !== "") {
				this.selPromoterLoading = true;
				let temp = Number(query);
				let parameter = {};
				if (temp) {
					if (temp.toString().length === 11 && /^1[3456789]\d{9}$/.test(temp)) {
						parameter["phone"] = temp
					} else {
						parameter["station_number"] = temp
					}
				}
				getPromoterList(parameter).then(res => {
					if (res.data.success && res.data.data.items) {
						this.selPromoterOptions = res.data.data.items.map(item => {
							let tempObj = {
								id: item.userWithInfo.user.id,
								name: item.userWithInfo.user.name,
								mobile: item.userWithInfo.user.mobile
							};
							return tempObj;
						});
					}
					this.selPromoterLoading = false;
				})
				.catch(error => {
					this._catch(error);
				});
			} else {
				this.selPromoterOptions = [];
			}
		},
		selDateRangeRemoteMethod(query) {
			if (query !== "") {
				this.selDateRangeLoading = true;
				let parameter = {
					name: query,
					type: 2
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
	filters: {
		formatTime(time) {
			if (time === 0) {
				return '？'
			}
			return util.formatDate.format(new Date(time), 'yyyy/MM/dd');
		},
	},
	mounted() {
		this.init();
	}
};
</script>

<style scoped>
</style>
