<template>
<div id="root">
	<!-- 过滤查询 -->
	<el-row>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
			<el-form :inline='true' :model='filters'>
				<el-form-item>
					<el-select v-model="filters.type" placeholder="请选择类型" @change="init">
						<el-option label="请选择" :value="0"></el-option>
						<el-option label="批次" :value="1"></el-option>
				  	</el-select>
			  	</el-form-item>
				<el-form-item v-if="filters.type">
					<el-select v-model="filters.date_range_id" style="width: 250px;" placeholder="请输入批次名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" @change='init' :loading='selDateRangeLoading'>
						<el-option v-for="item in selDateRangeOptions" :key="item" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-date-picker v-model="filters.date" type="date" placeholder="选择日期" @change='init'>
				    </el-date-picker>
			  	</el-form-item>
				<el-form-item>
					<el-button type='primary' @click='init'>查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type='primary' @click='handleExport'>导出excel</el-button>
				</el-form-item>
			</el-form>
		</el-col>
	</el-row>
	<!-- 列表 -->
	<el-table border :data="allData" highlight-current-row v-loading="initLoading" style="width: 100%;">
		<el-table-column prop="id" label="ID" width="80" align='center'></el-table-column>
		<el-table-column prop="createDate" label="日期" width="120" align='center'></el-table-column>
		<el-table-column prop="dateRangeName" label="批次" align='center' v-if="filters.type === 1"></el-table-column>
		<el-table-column prop="entryNum" label="日增推广人数" width="100" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="fishNum" label="留存人数（见习）" width="100" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="newNum" label="留存人数（新）" width="110" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="oldNum" label="留存人数（老）" width="110" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="dayTotal" label="留存人数（总计）" width="120" align='center' :formatter="formatNumber"></el-table-column>

		<el-table-column prop="leaveFishNum" label="日离职推广人数（见习）" width="130" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="leaveNewNum" label="日离职新推广人数（新）" width="130" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="leaveOldNum" label="日离职老推广人数（老）" width="130" align='center' :formatter="formatNumber"></el-table-column>

		<el-table-column prop="leaveFishRangeNum" label="累计离职推广人数（见习）" width="130" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="leaveNewRangeNum" label="累计离职推广人数（新）" width="130" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="leaveOldRangeNum" label="累计离职推广人数（老）" width="130" align='center' :formatter="formatNumber"></el-table-column>

	</el-table>

	<!-- 分页条 -->
	<el-col :span='24' class='toolbar'>
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
	statisticsPromoter,
	getDateRangeList
} from "../../api/api";
export default {
	data() {
		return {
			filters: {
				date: "",
				date_range_id: "",
				type: 0,
				rank_id: '',
				date: ''
			},
			// 表单
			allData: [],
			initLoading: false,
			// 分页
			totalCount: 1,
			page_index: 1,
			page_size: 20,

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
				date: this.filters.date ? Date.parse(this.filters.date) : '',
				date_range_id: this.filters.date_range_id,
				type: this.filters.type,
			};
			this.initLoading = true;
			statisticsPromoter(params)
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
		/****
		 * @description 调取日期配置数据列表
		 * @augments query
		 */
		selDateRangeRemoteMethod(query) {
			if (query !== "") {
				this.selDateRangeLoading = true;
				let parameter = {
					name: query,
					type: 1
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
			let property = column.property;
			let money = row[property];
			return (money/100).toFixed(2);
		},
		formatNumber(row, column) {
			let property = column.property;
			let num = row[property];
			return num && (num
				.toString().indexOf('.') != -1 ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
					return $1 + ",";
				}) : num.toString().replace(/(\d)(?=(\d{3})+\b)/g, function($0, $1) {
					return $1 + ",";
				}));
		},
		handleExport() {
			if (this.filters.genre === 1) {
				this.filters.date_node = '';
			}
			if (this.filters.genre === 2) {
				this.filters.date = '';
			}
			let params = "?page_index=" + this.page_index + '&page_size=' + this.page_size + "&date=" + (this.filters.date ? Date.parse(this.filters.date) : '')
						+ "&date_range_id=" + (this.filters.date_range_id ? this.filters.date_range_id.id : '') + "&type=" + this.filters.type;
			// 借用隐藏的form表单提交数据 请求到excel进行下载
			this.$refs['oForm'].action = "/op/promoter/statistics/export/promoter" + params;
			this.$refs['oForm'].methods = 'post';
			this.$refs['oForm'].submit();
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
		formatPlace(type) {
			switch (type) {
				case 1:
					return '请填写批次 ID'
					break;
				default:
					return
			}
		},
	},
	mounted() {
		this.init();
	}
};
</script>

<style scoped>
</style>
