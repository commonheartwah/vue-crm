<template>
<div id="root">
	<!-- 过滤查询 -->
	<el-row>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
			<el-form :inline='true' :model='filters'>
				<el-form-item>
					<el-select v-model="filters.pro_id" style="width: 250px;" placeholder="请输入推广人分站号或ID查询" filterable clearable remote :remote-method="selPromoterRemoteMethod" @change='init' :loading='selPromoterLoading'>
						<el-option v-for="item in selPromoterOptions" :key="item.id" :label="item.name + '----' + item.mobile" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.date_range_id" style="width: 250px;" placeholder="请输入销售期段名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" @change='init' :loading='selDateRangeLoading'>
						<el-option v-for="item in selDateRangeOptions" :key="item.id" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.status" placeholder="请选择状态" @change="init">
						<el-option label="有效" :value="0"></el-option>
					    <el-option label="无效" :value="1"></el-option>
				  	</el-select>
			  	</el-form-item>
				<el-form-item>
					<el-button type='primary' @click='init'>查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type='primary' @click='handleAdd'>新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type='primary' @click='handleExport'>导出excel</el-button>
				</el-form-item>
			</el-form>
		</el-col>
	</el-row>
	<!-- 列表 -->
	<el-table border :data="allData" highlight-current-row v-loading="initLoading" @selection-change="handleSelectionChange" style="width: 100%;">
		<el-table-column type="selection" width="55"></el-table-column>
		<el-table-column prop="entity.id" label="ID" width="80" align='center'></el-table-column>
		<el-table-column prop="entity.promoterId" label="推广人 ID" width="100" align='center'></el-table-column>
		<el-table-column prop="entity.userName" label="推广人名称" width="150" align='center'></el-table-column>
		<el-table-column prop="entity.phone" label="推广人手机号" width="150" align='center'></el-table-column>
		<el-table-column prop="entity.dateRangeName" label="销售期名称" width="160" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column prop="entity.orderStat" label="订单状态" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column prop="entity.actualMoney" label="订单销售额" width="110" align='center' :formatter="formatMoney"></el-table-column>
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

			<el-form-item label='推广人' v-if="!form.id">
				<el-select v-model="selPromoter" style="width: 450px;" placeholder="请输入推广人分站号或ID查询" filterable clearable remote :remote-method="selPromoterRemoteMethod" :loading='selPromoterLoading'>
					<el-option v-for="item in selPromoterOptions" :key="item.id" :label="'（' + item.id + '）' + item.name + '----' + item.mobile" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label='订单 ID' prop="order" v-if="!form.id">
				<el-input v-model='form.order_id' style="width:200px"></el-input>
			</el-form-item>

			<el-form-item label="修改状态：" v-if="form.id">
				<el-radio-group v-model="form.status">
					<el-radio-button label="0">有效</el-radio-button>
					<el-radio-button label="1">无效</el-radio-button>
			  </el-radio-group>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="formVisible = false">取消</el-button>
			<el-button type="primary" @click.native="handleSubmit" :loading="formLoading">提交</el-button>
		</div>
	</el-dialog>

	<!-- 分页条 -->
	<el-col :span='24' class='toolbar'>
		<el-button type='success' @click='handledelOrder' :disabled="this.selsArr.length===0">批量删除</el-button>
		<el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='page_size' :total='totalCount' style='float: right'></el-pagination>
	</el-col>
	<!-- 隐藏的form表单 接收服务器发来的excel文件 用form表单的post进行请求 浏览器会自动下载 别的方式暂时不可以 -->
	<section>
		<form method="post" ref="oForm"></form>
	</section>
</div>
</template>

<script>
import util from '../../common/js/util'
import {
	getPromoterOrderList,
	promoterOrderAdd,
	promoterOrderUpdate,
	promoterOrderDel,
	getDateRangeList,
	getPromoterList
} from "../../api/api";
export default {
	data() {
		return {
			filters: {
				pro_id: "",
				date_range_id: "",
				status: 0
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
				order_id: ""
			},
			formRules: {
				order_id: [{
					required: true,
					message: "请填写销售订单 ID",
					trigger: "blur"
				}],
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
		 * @function handleIconClick_clearDateId 清除招生期 ID
		 * @function handleIconClick_clearSaleId 清除销售期 ID
		 */
		handleIconClick_clearID() {
			this.filters.pro_id = "";
		},
		handleIconClick_clearSaleId() {
			this.filters.date_range_id = "";
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
				date_range_id: this.filters.date_range_id,
				status: this.filters.status,
			};
			this.initLoading = true;
			getPromoterOrderList(params)
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
				order_id: '',
			};
			this.selPromoter = "";
			this.formVisible = true;
		},
		handleEdit(index, row) {
			this.form = {
				id: row.entity.id,
				status: row.entity.stat,
			};
			this.formVisible = true;
		},
		handleDel(index, row) {
			this.$confirm("确认删除吗?", "提示", {}).then(() => {
				let para = {
					ids: row.entity.id
				}
				promoterOrderDel(para).then(res => {
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
		handledelOrder() {
			let para = {
				ids: ''
			}
			for (var i = 0; i < this.selsArr.length; i++) {
				let item = this.selsArr[i]
				para.ids += item.entity.id + ','
			}
			this.$confirm("确认删除吗?", "提示", {}).then(() => {
				promoterOrderDel(para).then(res => {
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
		handleExport() {
			let params = "?status=" + (this.filters.status?this.filters.status:'') + '&date_range_id=' + (this.filters.date_range_id?this.filters.date_range_id:'') + "&pro_id=" + (this.filters.pro_id?this.filters.pro_id:'');
			// 借用隐藏的form表单提交数据 请求到excel进行下载
			this.$refs['oForm'].action = "/op/promoter/order/export" + params;
			this.$refs['oForm'].methods = 'post';
			this.$refs['oForm'].submit();
		},
		handleSubmit() {
			let para, submitFunc;
			if (this.form.id > 0) {
				para = {
					id: this.form.id,
					status: this.form.status
				}
				submitFunc = promoterOrderUpdate
			} else {
				if (!this.selPromoter) {
					this.$notify({
						title: "警告",
						type: "warning",
						message: "请选择推广人"
					});
					return
				}
				para = {
					pro_id: this.selPromoter,
					order_id: this.form.order_id,
				}
				submitFunc = promoterOrderAdd
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
				let parameter = {};
				if (query.length === 11 && /^1[3456789]\d{9}$/.test(query)) {
					parameter["phone"] = query
				} else {
					parameter["station_number"] = query
				}
				console.log(parameter);
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
		formatMoney(row, column) {
			let property = column.property.split('.');
			let money = row[property[0]][property[1]];
			return (money/100).toFixed(2);
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
