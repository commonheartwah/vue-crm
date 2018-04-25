<template lang="html">
    <div class="root-contianer">
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
    					<el-select v-model="filters.date_range_id" style="width: 250px;" placeholder="请输入批次名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" @change='changeDateRangeId' :loading='selDateRangeLoading'>
    						<el-option v-for="item in selDateRangeOptions" :key="item.id" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item">
    						</el-option>
    					</el-select>
    				</el-form-item>
                    <el-form-item v-if="filters.type">
    					<el-select v-model="filters.rank_id" style="width: 220px;" :placeholder="filters.type | formatPlace" filterable clearable remote :remote-method="organizationRemoteMethod" :loading='organizationLoading' @change='initDataList'>
    						<el-option v-for="item in organizationOptions" :key="item.id" :label="item.name" :value="item.id">
    						</el-option>
    					</el-select>
    				</el-form-item>
                    <el-form-item>
    					<el-select v-model="filters.date_type" style="width: 80px" @change='changeDateType'>
    						<el-option label="日期" :value="0"></el-option>
    						<el-option label="节点" :value="1" v-if="filters.date_range_id"></el-option>
    				  	</el-select>
    			  	</el-form-item>
                    <el-form-item v-if="filters.date_type === 0">
    					<el-date-picker v-model="filters.date" @change='initDataList' type="date" placeholder="选择日期" :picker-options="pickerOptions">
    				    </el-date-picker>
    			  	</el-form-item>
                    <el-form-item v-if="filters.date_range_id && filters.date_type === 1">
    					<el-select v-model="filters.date_node" @change='initDataList'>
    						<el-option v-for="item in selDateNodeOptions" :key="item.id" :label="item.entity.name" :value="item.entity.id">
    						</el-option>
    					</el-select>
    				</el-form-item>
                    <el-form-item>
    					<el-button type='primary' @click='initDataList'>查询</el-button>
    				</el-form-item>
    				<el-form-item>
    					<el-button type='primary' @click='handleExport'>导出excel</el-button>
    				</el-form-item>
                </el-form>
    		</el-col>
    	</el-row>
        <!-- 展示列表 -->
        <el-table border :data="allData" highlight-current-row v-loading="initLoading" style="width: 100%;">
            <el-table-column prop="id" label="ID" width="80" align='center'></el-table-column>
            <el-table-column prop="createDate" label="日期" width="120" align='center'></el-table-column>
            <el-table-column prop="familyName" label="家族" width="120" align='center' v-if='filters.type==1 || filters.type==2 || filters.type==3'></el-table-column>
            <el-table-column prop="groupName" label="小组" width="120" align='center' v-if='filters.type==2 || filters.type==3'></el-table-column>
            <el-table-column prop="teamName" label="小队" width="120" align='center' v-if='filters.type==3'></el-table-column>

            <el-table-column prop="dateRangeName" label="销售期" width="120" align='center'></el-table-column>
            <el-table-column prop="promoterNum" label="有效推广人数" width="120" align='center' ></el-table-column>
            <el-table-column prop="promoterWorthyNum" label="有销售推广人数" width="120" align='center'></el-table-column>
            <el-table-column prop="participationRate" label="精品课销售参与率" width="120" align='center'></el-table-column>

            <el-table-column prop="fishDaySale" label="日精品课销量（见习）" width="120" align='center' :formatter="formatNumber"></el-table-column>
            <el-table-column prop="newDaySale" label="日精品课销量（新）" width="120" align='center' :formatter="formatNumber"></el-table-column>
            <el-table-column prop="oldDaySale" label="日精品课销量（老）" width="120" align='center' :formatter="formatNumber"></el-table-column>
            <el-table-column prop="totalDaySale" label="日精品课销量（总计）" width="120" align='center' :formatter="formatNumber"></el-table-column>

            <el-table-column prop="fishSaleTarget" label="精品课销量目标（见习）" width="120" align='center' :formatter="formatNumber"></el-table-column>
            <el-table-column prop="fishRangeSale" label="累计精品课销量（见习）" width="120" align='center' :formatter="formatNumber"></el-table-column>
            <el-table-column prop="fishTransforRate" label="转化率（见习）" width="120" align='center'></el-table-column>
            <el-table-column prop="fishFinishRate" label="完成率（见习）" width="120" align='center'></el-table-column>

            <el-table-column prop="newSaleTarget" label="精品课销量目标（新）" width="120" align='center' :formatter="formatNumber"></el-table-column>
            <el-table-column prop="newRangeSale" label="累计精品课销量（新）" width="120" align='center' :formatter="formatNumber"></el-table-column>
            <el-table-column prop="newTransforRate" label="转化率（新）" width="120" align='center'></el-table-column>
            <el-table-column prop="newFinishRate" label="完成率（新）" width="120" align='center'></el-table-column>

            <el-table-column prop="oldSaleTarget" label="精品课销量目标（老）" width="120" align='center' :formatter="formatNumber"></el-table-column>
            <el-table-column prop="oldRangeSale" label="累计精品课销量（老）" width="120" align='center' :formatter="formatNumber"></el-table-column>
            <el-table-column prop="oldTransforRate" label="转化率（老）" width="120" align='center'></el-table-column>
            <el-table-column prop="oldFinishRate" label="完成率（老）" width="120" align='center'></el-table-column>

            <el-table-column prop="totalSaleTarget" label="精品课销量目标（总计）" width="120" align='center' :formatter="formatNumber"></el-table-column>
            <el-table-column prop="totalRangeSale" label="累计精品课销量（总计）" width="120" align='center' :formatter="formatNumber"></el-table-column>
            <el-table-column prop="totalTransforRate" label="转化率（总计）" width="120" align='center' ></el-table-column>
            <el-table-column prop="totalFinishRate" label="完成率（总计）" width="120" align='center'></el-table-column>

            <el-table-column label="环比" width="100" align='center' v-if="filters.date_type !== 0">
    			<template scope="scope">
    				<div v-html="formatLinkRelative(scope.row.linkRelative)"></div>
    			</template>
    		</el-table-column>

            <el-table-column prop="classAvgRate" label="精品课客单价" width="120" align='center' :formatter="formatMoney"></el-table-column>

            <el-table-column prop="fishDaySaleMoney" label="日精品课销售额（见习）" width="120" align='center' :formatter="formatMoney"></el-table-column>
            <el-table-column prop="newDaySaleMoney" label="日精品课销售额（新）" width="120" align='center' :formatter="formatMoney"></el-table-column>
            <el-table-column prop="oldDaySaleMoney" label="日精品课销售额（老）" width="120" align='center' :formatter="formatMoney"></el-table-column>
            <el-table-column prop="totalDaySaleMoney" label="日精品课销售额（总计）" width="120" align='center' :formatter="formatMoney"></el-table-column>

            <el-table-column prop="fishRangeSaleMoney" label="累计精品课销售额（见习）" width="120" align='center' :formatter="formatMoney"></el-table-column>
            <el-table-column prop="newRangeSaleMoney" label="累计精品课销售额（新）" width="120" align='center' :formatter="formatMoney"></el-table-column>
            <el-table-column prop="oldRangeSaleMoney" label="累计精品课销售额（老）" width="120" align='center' :formatter="formatMoney"></el-table-column>
            <el-table-column prop="totalRangeSaleMoney" label="累计精品课销售额（总计）" width="120" align='center' :formatter="formatMoney"></el-table-column>

            <el-table-column prop="fishRangeRecruit" label="招生数量（见习）" width="120" align='center' :formatter="formatNumber"></el-table-column>
            <el-table-column prop="newRangeRecruit" label="招生数量（新）" width="120" align='center' :formatter="formatNumber"></el-table-column>
            <el-table-column prop="oldRangeRecruit" label="招生数量（老）" width="120" align='center' :formatter="formatNumber"></el-table-column>
            <el-table-column prop="totalRangeRecruit" label="招生数量（总计）" width="120" align='center' :formatter="formatNumber"></el-table-column>
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
import {
	statisticsClassic,
	statisticsClassicExport,
	getDateRangeList,
	getDateNodeList,
	getPromoterFamilyList,
	getPromoterGroupList,
	getPromoterTeamList
} from '../../api/api'
import util from '../../common/js/util'
export default {
	data() {
		return {
			allData: [],
			initLoading: true,
			selDateRangeLoading: true,
			organizationLoading: true,
			filters: {
				type: 0,
				date_range_id: '',
				date_type: 0,
				date: '',
				date_node: '',
				rank_id: ''
			},
			// 分页相关数据
			page_size: 20,
			totalCount: 0,
			page_index: 1,
			organizationOptions: [],
			selDateRangeOptions: [],
			selDateNodeOptions: [],
			pickerOptions: {
				disabledDate(time) {
					return false
				}
			},
		}
	},
	methods: {
		// 初始化加载数据
		initDataList() {
			let date;
			if (this.filters.date_type == 0) {
				this.filters.data_node = ''
				if (this.filters.date) {
					date = new Date(this.filters.date).getTime();
				} else {
					date = ''
				}
			} else {
				this.filters.date = ''
			}


			let para = {
				type: this.filters.type,
				date_range_id: this.filters.date_range_id.id,
				rank_id: this.filters.rank_id,
				date: date,
				date_node: this.filters.date_node,
				page_size: 20,
				page_index: this.page_index,
				date_type: this.filters.date_type
			}
			statisticsClassic(para).then(res => {
					if (res.data.success) {
						this.allData = res.data.data.items;
						this.initLoading = false;
						this.totalCount = res.data.data.totalCount;
					} else {
						this.$notify({
							title: "错误",
							message: res.data.msg,
							type: "error"
						});
					}
				})
				.catch(err => {
					this.errorFunction(err)
				})
		},
		errorFunction(error) {
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
		// 查询type值
		changeType(val) {
			this.organizationRemoteMethod('');
			this.initDataList();
		},
		// 根据id查询
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
						this.errorFunction(error);
					});
			} else {
				this.organizationOptions = [];
			}
		},
		// 处理钱数
		formatMoney(row, column) {
			let property = column.property;
			let money = row[property];
			return (money / 100).toFixed(2);
		},
		// 处理数字
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
						this.errorFunction(error);
					});
			} else {
				this.selDateRangeOptions = [];
			}
		},
		changeDateRangeId(value) {
			let _this = this
			if (!value) {
				this.filters.date_type = 0;
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
							if (time.getTime() < startTime) { // 这个时间比开始时间早
								return true
							} else { // 这个时间比开始时间晚，有可能在这个区间内
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
					type: 3,
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
						this.errorFunction(error);
					});
			}
			this.initDataList();
		},
		// 环比
		formatLinkRelative(linkRelative) {
			if (linkRelative) {
				if (linkRelative.indexOf('-') > -1) {
					return '<span style="color:red;">' + linkRelative + '</span>'
				} else {
					return '<span>' + linkRelative + '</span>'
				}
			}
		},
		// 导出excel
		handleExport() {
			if (this.filters.date_type === 0) {
				this.filters.date_node = '';
			}
			if (this.filters.date_type === 1) {
				this.filters.date = '';
			}
			let params = "?page_index=" + this.page_index + '&page_size=' + this.page_size + "&date=" + (this.filters.date ? Date.parse(this.filters.date) : '') +
				"&date_range_id=" + (this.filters.date_range_id ? this.filters.date_range_id.id : '') + "&type=" + this.filters.type + "&rank_id=" +
				this.filters.rank_id + "&date_node=" + this.filters.date_node + "&date_type=" + this.filters.date_type;
			// 借用隐藏的form表单提交数据 请求到excel进行下载
			this.$refs['oForm'].action = "/op/promoter/statistics/export/classic" + params;
			this.$refs['oForm'].methods = 'post';
			this.$refs['oForm'].submit();
		},
		// date置空
		changeDateType() {
			this.filters.date = '';
			this.filters.date_node = '';
			this.initDataList();
		},
		// 分页数据处理
		handleCurrentChange(page) {
			this.page_index = page;
			this.initDataList()
		}
	},
	mounted() {
		this.initDataList(1);
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
}
</script>

<style lang="less" scoped>

</style>
