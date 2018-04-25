<template>
<div id="root">
	<!-- 过滤查询 -->
	<el-row>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
			<el-form :inline='true' :model='filters'>
				<el-form-item>
					<el-select v-model="filters.pro_id" style="width: 250px;" placeholder="请输入推广人分站号或ID查询" filterable clearable remote :remote-method="selPromoterRemoteMethod" @change='init' :loading='selPromoterLoading'>
						<el-option v-for="item in selPromoterOptions" :key="item" :label="item.name + '----' + item.mobile" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item>
					<el-select v-model="filters.pro_date_id" style="width: 250px;" placeholder="请输入招生期段名称查询" filterable clearable remote :remote-method="selDateRangeEnrollRemoteMethod" @change='init' :loading='selDateRangeLoading'>
						<el-option v-for="item in selDateRangeOptions" :key="item" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item>
					<el-select v-model="filters.pro_sale_id" style="width: 250px;" placeholder="请输入销售期段名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" @change='init' :loading='selDateRangeLoading'>
						<el-option v-for="item in selDateRangeOptions" :key="item" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id">
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
		<el-table-column prop="entity.phone" label="推广人手机号" width="150" align='center'></el-table-column>
		<el-table-column prop="entity.position" label="推广人身份" width="120" align='center'></el-table-column>
		<!-- <el-table-column prop="entity.proRangeName" label="招生日期段名称" width="140" align='center' show-overflow-tooltip></el-table-column> -->
		<el-table-column prop="entity.saleDateRange" label="销售日期段名称" width="140" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column prop="entity.targetOrder" label="目标订单数" width="120" align='center'></el-table-column>
		<el-table-column prop="entity.truthOrder" label="真实销售订单数" width="135" align='center'></el-table-column>
		<el-table-column prop="entity.truthSaleVolume" label="真实销售额" width="120" align='center'></el-table-column>
		<el-table-column prop="entity.description" label="描述" min-width="200" align='center'></el-table-column>
		<el-table-column label="操作" align="center" fixed="right" width="130">
			<template scope="scope">
	            <el-button-group>
				    <el-button type="info" size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
	            	<el-button type="success" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          		</el-button-group>
        	</template>
		</el-table-column>
	</el-table>

	<!-- 新增 更新 -->
	<el-dialog title='' v-model='formVisible' :close-on-click-modal='false' size="small">
		<el-form :model='form' :rules='formRules' label-width='120px' ref="form" label-position="right">
			<el-form-item label='ID' v-show="form.id">
				<el-input v-model='form.id' style="width: 100px;" disabled="disabled"></el-input>
			</el-form-item>

			<el-form-item label='推广人'>
				<el-select v-model="selPromoter" style="width: 450px;" placeholder="请输入推广人分站号或ID查询" filterable clearable remote :remote-method="selPromoterRemoteMethod" :loading='selPromoterLoading'>
					<el-option v-for="item in selPromoterOptions" :key="item" :label="'（' + item.id + '）' + item.name + '----' + item.mobile" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label='招生日期段' v-show="form.id">
				<el-select v-model="selEnrollDateRange" style="width: 450px;" placeholder="请输入名称或ID查询" filterable clearable remote :remote-method="selDateRangeEnrollRemoteMethod" :loading='selDateRangeLoading'>
					<el-option v-for="item in selDateRangeOptions" :key="item" :label="'（' + item.id + '）' + item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label='销售日期段'>
				<el-select v-model="selDateRange" style="width: 450px;" placeholder="请输入名称或ID查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" :loading='selDateRangeLoading'>
					<el-option v-for="item in selDateRangeOptions" :key="item" :label="'（' + item.id + '）' + item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label='真实销售订单数' prop="order">
				<el-input v-model='form.order'></el-input>
			</el-form-item>

			<el-form-item label='真实销售额' prop="sale_volume">
				<el-input v-model='form.sale_volume'></el-input>
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
		<el-button type='success' @click='handledelSaleRange' :disabled="this.selsArr.length===0">批量删除</el-button>
		<el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='page_size' :total='totalCount' style='float: right'></el-pagination>
	</el-col>
</div>
</template>

<script>
import util from '../../common/js/util'
import {
	addSaleRange,
	delSaleRange,
	getSaleRangeList,
	updateSaleRange,
	getDateRangeList,
	getPromoterList
} from "../../api/api";
export default {
	data() {
		return {
			filters: {
				pro_id: "",
				pro_date_id: "",
				pro_sale_id: ""
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
				order: [{
					required: true,
					message: "请填写真实销售订单数",
					trigger: "blur"
				}],
				sale_volume: [{
					required: true,
					message: "请填写真实销售额",
					trigger: "blur"
				}]
			},
			selsArr: [],
			// 远程选择
			selPromoter: "",
			selPromoterLoading: false,
			selPromoterOptions: [],

			selDateRange: "",
			selEnrollDateRange: "",
			selDateRangeLoading: false,
			selDateRangeOptions: []
		};
	},
	methods: {
		/***
		 * @function handleIconClick_clearID 清除ID
		 * @function handleIconClick_clearDateId 清除招生期 ID
		 * @function handleIconClick_clearSaleId 清除销售期 ID
		 */
		handleIconClick_clearID() {
			this.filters.pro_id = "";
		},
		handleIconClick_clearDateId() {
			this.filters.pro_date_id = "";
		},
		handleIconClick_clearSaleId() {
			this.filters.pro_sale_id = "";
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
				pro_id: this.filters.pro_id,
				pro_date_id: this.filters.pro_date_id,
				pro_sale_id: this.filters.pro_sale_id
			};
			this.initLoading = true;
			getSaleRangeList(params)
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
		 * @function handleEdit 删除
		 * @function handleSubmit 提交
		 */
		handleAdd() {
			this.form = {
				description: "",
				order: '',
				sale_volume: '',
			};
			this.selPromoter = "";
			this.selDateRange = "";
			this.selEnrollDateRange = "";
			this.formVisible = true;
		},
		handleEdit(index, row) {
			this.form = {
				id: row.entity.id,
				order: row.entity.truthOrder ? row.entity.truthOrder : '',
				sale_volume: row.entity.truthSaleVolume ? row.entity.truthSaleVolume : '',
				description: row.entity.description ? row.entity.description : ''
			};
			this.selPromoter = row.entity.promoterId;
			this.selDateRange = row.entity.saleDateRangeId;
			this.selEnrollDateRange = row.entity.proDateRangeId;
			this.selPromoterRemoteMethod(row.entity.phone)
			this.selDateRangeRemoteMethod(row.entity.saleRangeName)
			this.selDateRangeEnrollRemoteMethod(row.entity.proRangeName)
			this.formVisible = true;
		},
		handleDel(index, row) {
			this.$confirm("确认删除吗?", "提示", {}).then(() => {
				let para = {
					ids: row.entity.id
				}
				delSaleRange(para).then(res => {
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
		handledelSaleRange() {
			let para = {
				ids: ''
			}
			for (var i = 0; i < this.selsArr.length; i++) {
				let item = this.selsArr[i]
				para.ids += item.entity.id + ','
			}
			this.$confirm("确认删除吗?", "提示", {}).then(() => {
				delSaleRange(para).then(res => {
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
				pro_id: this.selPromoter,
				order: this.form.order,
				sale_volume: this.form.sale_volume,
				description: this.form.description,
			}, submitFunc;
			if (this.form.id > 0) {
				para['id'] = this.form.id
				para['sale_date_range_id'] = this.selDateRange
				para['pro_date_range_id'] = this.selEnrollDateRange
				submitFunc = updateSaleRange
			} else {
				para['date_range_id'] = this.selDateRange
				submitFunc = addSaleRange
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
								this.selPromoter = '';
								this.selDateRange = '';
								this.selEnrollDateRange = '';
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
		 * @description 调取推广人列表
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
		/****
		 * @description 调取日期配置数据列表
		 * @augments query
		 */
		selDateRangeRemoteMethod(query) {
			if (query !== "") {
				this.selDateRangeLoading = true;
				let parameter = {
					name: query,
					type: 3
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
		selDateRangeEnrollRemoteMethod(query) {
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
