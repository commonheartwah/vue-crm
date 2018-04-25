<template>
<div id="root">
	<!-- 过滤查询 -->
	<el-row>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
			<el-form :inline='true' :model='filters'>
				<el-form-item>
					<el-select v-model="filters.type" placeholder="请选择类型" @change="changeType">
						<el-option label="请选择" :value="0"></el-option>
						<el-option label="家族" :value="1"></el-option>
						<el-option label="小组" :value="2"></el-option>
						<el-option label="小队" :value="3"></el-option>
				  	</el-select>
			  	</el-form-item>
				<el-form-item>
					<el-select v-model="filters.date_range_id" style="width: 260px;" placeholder="请输入批次名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" @change='changeDateRangeId' :loading='selDateRangeLoading'>
						<el-option v-for="item in selDateRangeOptions" :key="item" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item v-if="filters.type">
					<el-select v-model="filters.rank_id" style="width: 220px;" :placeholder="filters.type | formatPlace" filterable clearable remote :remote-method="organizationRemoteMethod" :loading='organizationLoading' @change='init'>
						<el-option v-for="item in organizationOptions" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item>
					<el-select v-model="filters.date_type" style="width: 80px">
						<el-option label="日期" :value="0"></el-option>
						<el-option label="节点" :value="1" v-if="filters.date_range_id"></el-option>
				  	</el-select>
			  	</el-form-item>
				<el-form-item v-if="filters.date_type === 0">
					<el-date-picker v-model="filters.date" @change='init' type="date" placeholder="选择日期" :picker-options="pickerOptions">
				    </el-date-picker>
			  	</el-form-item>
				<el-form-item v-if="filters.date_range_id && filters.date_type === 1">
					<el-select v-model="filters.date_node" @change='init'>
						<el-option v-for="item in selDateNodeOptions" :key="item" :label="item.entity.name" :value="item.entity.id">
						</el-option>
					</el-select>
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

		<el-table-column prop="familyName" label="家族" width="120" align='center' show-overflow-tooltip v-if="filters.type"></el-table-column>
		<el-table-column prop="groupName" label="小组" width="120" align='center' show-overflow-tooltip v-if="filters.type === 2 || filters.type === 3"></el-table-column>
		<el-table-column prop="teamName" label="小队" width="120" align='center' show-overflow-tooltip v-if="filters.type === 3"></el-table-column>

		<el-table-column prop="dateRangeName" label="销售期" width="120" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column prop="promoterNum" label="有效推广人数" width="100" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="promoterWorthyNum" label="有销售推广人数" width="100" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="participationRate" label="销售参与率" width="110" align='center'></el-table-column>
		<el-table-column label="环比" width="100" align='center' v-if="filters.date_type !== 0">
			<template scope="scope">
				<div v-html="formatLinkRelative(scope.row.linkRelative)"></div>
			</template>
		</el-table-column>

		<el-table-column prop="fishCourseNum" label="日商品销量（见习）" width="120" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="newCourseNum" label="日商品销量（新）" width="100" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="oldCourseNum" label="日商品销量（老）" width="100" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="dayTotalCourse" label="日商品销量（总计）" width="110" align='center' :formatter="formatNumber"></el-table-column>

		<el-table-column prop="fishCourseRangeNum"z label="累计商品销量（见习）" width="120" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="newCourseRangeNum" label="累计商品销量（新）" width="120" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="oldCourseRangeNum" label="累计商品销量（老）" width="120" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="rangeTotalCourse" label="累计商品销量（总计）" width="120" align='center' :formatter="formatNumber"></el-table-column>

		<el-table-column prop="fishOrderNum" label="日订单数量（见习）" width="120" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="newOrderNum" label="日订单数量（新）" width="100" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="oldOrderNum" label="日订单数量（老）" width="100" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="dayTotalOrder" label="日订单数量（总计）" width="120" align='center' :formatter="formatNumber"></el-table-column>

		<el-table-column prop="fishOrderRangeNum" label="累计订单数量（见习）" width="120" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="newOrderRangeNum" label="累计订单数量（新）" width="120" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="oldOrderRangeNum" label="累计订单数量（老）" width="120" align='center' :formatter="formatNumber"></el-table-column>
		<el-table-column prop="rangeTotalOrder" label="累计订单数量（总计）" width="120" align='center' :formatter="formatNumber"></el-table-column>

		<el-table-column prop="fishMoneyNum" label="日销售额（见习）" width="120" align='center' :formatter="formatMoney"></el-table-column>
		<el-table-column prop="newMoneyNum" label="日销售额（新）" width="100" align='center' :formatter="formatMoney"></el-table-column>
		<el-table-column prop="oldMoneyNum" label="日销售额（老）" width="100" align='center' :formatter="formatMoney"></el-table-column>
		<el-table-column prop="dayTotalMoney" label="日销售额（总计）" width="100" align='center' :formatter="formatMoney"></el-table-column>

		<el-table-column prop="fishMoneyRangeNum" label="累计销售额（见习）" width="120" align='center' :formatter="formatMoney"></el-table-column>
		<el-table-column prop="newMoneyRangeNum" label="累计销售额（新）" width="100" align='center' :formatter="formatMoney"></el-table-column>
		<el-table-column prop="oldMoneyRangeNum" label="累计销售额（老）" width="100" align='center' :formatter="formatMoney"></el-table-column>
		<el-table-column prop="rangeTotalMoney" label="累计销售额（总计）" width="110" align='center' :formatter="formatMoney"></el-table-column>
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
	statisticsSale,
	statisticsSaleExport,
	getDateRangeList,
	getDateNodeList,
	getPromoterFamilyList,
	getPromoterGroupList,
	getPromoterTeamList
} from "../../api/api";
export default {
	data() {
		return {
			filters: {
				date: "",
				date_range_id: "",
				type: 0,
				rank_id: '',
				date_type: 0,
				date_node: ''
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
			selDateRangeOptions: [],

			selDateNodeOptions: [],

			pickerOptions: {},
			organizationOptions: [],
			organizationLoading: false
		};
	},
	methods: {
		/***
		 * @function handleIconClick_clearID 清除ID
		 * @function handleIconClick_clearDateId 清除招生期 ID
		 * @function handleIconClick_clearSaleId 清除销售期 ID
		 */
		handleIconClick_clearSaleId() {
			this.filters.date_range_id = {};
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
			if (this.filters.date_type === 0) {
				this.filters.date_node = '';
			}
			if (this.filters.date_type === 1) {
				this.filters.date = '';
			}
			let params = {
				page_index: this.page_index,
				page_size: this.page_size,
				date: this.filters.date ? Date.parse(this.filters.date) : '',
				date_range_id: this.filters.date_range_id.id,
				type: this.filters.type,
				rank_id: this.filters.rank_id,
				date_node: this.filters.date_node,
				date_type: this.filters.date_type
			};
			this.initLoading = true;
			statisticsSale(params)
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
		changeDateRangeId(value) {
			let _this = this
			if (!value) {
				this.filters.date_type = 0
				this.pickerOptions = {
					disabledDate(time) {
						return false
					}
				}
			} else {
				this.pickerOptions = {
					disabledDate(time) {
						if (_this.filters.date_range_id) {
							let startTime = _this.filters.date_range_id.time[0],
							endTime = _this.filters.date_range_id.time[1];
							if (time.getTime() < startTime) { 	// 这个时间比开始时间早
								return true
							} else {		// 这个时间比开始时间晚，有可能在这个区间内
								if (time.getTime() < endTime) {
									return false
								} else {
									return true
								}
							}
						} else {
							return false
						}
		          	}
				}
				let params = {
					date_range_id: this.filters.date_range_id.id,
					type: this.filters.type,
					position: this.filters.position
				};
				this.initLoading = true;
				getDateNodeList(params)
					.then(res => {
						if (res.data.success) {
							this.selDateNodeOptions = res.data.data.items;
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
			}
			this.init();
		},
		changeType() {
			this.organizationRemoteMethod(' ');
			this.init()
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
								time: [item.entity.startTime, item.entity.endTime]
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
		organizationRemoteMethod(query) {
			let searchApi;
			switch (this.filters.type) {
				case 1:
					searchApi = getPromoterFamilyList
					break;
				case 2:
					searchApi = getPromoterGroupList
					break;
				case 3:
					searchApi = getPromoterTeamList
					break;
				default:
			}
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
		formatLinkRelative(linkRelative) {
			if (linkRelative) {
				if (linkRelative.indexOf('-') > -1) {
					return '<span style="color:red;">' + linkRelative + '</span>'
				} else {
					return '<span>' + linkRelative + '</span>'
				}
			}
		},
		handleExport() {
			if (this.filters.date_type === 0) {
				this.filters.date_node = '';
			}
			if (this.filters.date_type === 1) {
				this.filters.date = '';
			}
			let params = "?page_index=" + this.page_index + '&page_size=' + this.page_size + "&date=" + (this.filters.date ? Date.parse(this.filters.date) : '')
						+ "&date_range_id=" + (this.filters.date_range_id ? this.filters.date_range_id.id : '') + "&type=" + this.filters.type + "&rank_id="
						+ this.filters.rank_id + "&date_node=" + this.filters.date_node + "&date_type=" + this.filters.date_type;
			// 借用隐藏的form表单提交数据 请求到excel进行下载
			this.$refs['oForm'].action = "/op/promoter/statistics/export/sale" + params;
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
					return '请填写家族名称搜索'
					break;
				case 2:
					return '请填写小组名称搜索'
					break;
				case 3:
					return '请填写小队名称搜索'
					break;
				default:
					return;
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
