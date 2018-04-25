<template lang="html">
    <section>
        <el-row>
            <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
                <el-form :inline='true' :model='filters'>
                    <el-form-item>
                        <el-select v-model="filters.date_range_id" style="width: 230px;" placeholder="请输入期次名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" @change='loadList' :loading='selDateRangeLoading'>
                            <el-option v-for="item in selDateRangeOptions" :key="item.id" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.station_number" placeholder="请输入分站号" clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker editable v-model="filters.date" @change='loadList' type="date" placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type='primary' @click='loadList'>查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type='primary' @click='handleExport'>导出excel</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <!-- 数据表格 -->
        <el-table border :data="allData" highlight-current-row v-loading="initLoading" style="width: 100%;">
            <el-table-column prop="id" label="ID" width="80" align='center'></el-table-column>
            <el-table-column prop="familyName" label="家族" width="120" align='center'></el-table-column>
            <el-table-column prop="groupName" label="小组" width="120" align='center'></el-table-column>
            <el-table-column prop="stationNumber" label="分站号" align='center'></el-table-column>
            <el-table-column prop="batchName" label="批次" align='center'></el-table-column>
            <el-table-column prop="enrollNumber" label="招生数" align='center'></el-table-column>
            <el-table-column prop="daySaleNumber" label="当日销售数" align='center'></el-table-column>
            <el-table-column prop="rangeSaleNumber" label="当期销售数" align='center'></el-table-column>
            <el-table-column prop="transRate" label="当期转化率" align='center'></el-table-column>
            <el-table-column prop="createDate" label="日期" align='center'></el-table-column>
        </el-table>

        <!-- 分页条 -->
    	<el-col :span='24' class='toolbar'>
    		<el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='page_size' :total='totalCount' style='float: right'></el-pagination>
    	</el-col>

        <!-- 隐藏的form表单 接收服务器发来的excel文件 用form表单的post进行请求 浏览器会自动下载 别的方式暂时不可以 -->
    	<section>
    		<form method="post" ref="oForm"></form>
    	</section>
    </section>
</template>

<script>
import {
	getDateNodeList,
	getDateRangeList,
	salePersonalList
} from '../../api/api'
import util from '../../common/js/util'
export default {
	data() {
		return {
			filters: {
				date_range_id: '',
				date: '',
				station_number: ''
			},
			selDateRangeOptions: [],
			stationNumberOptions: [],
			selDateNodeOptions: [],
			selDateRangeLoading: true,
			selStationNumberLoading: true,
			selDateNodeLoading: true,
			allData: [],
			initLoading: true,
            page_index: 1,
			page_size: 20,
			totalCount: 0,
		}
	},
	methods: {
		// 初始化数据
		loadList() {
			let para = {
				date_range_id: this.filters.date_range_id.id,
				date: Date.parse(this.filters.date),
				station_number: this.filters.station_number,
                page_index: this.page_index,
                page_size: this.page_size,
			}
			salePersonalList(para).then(res => {
					if (res.data.success) {
						this.totalCount = res.data.data.totalCount;
						this.allData = res.data.data.items;
						this.initLoading = false;
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
				})
		},
		// 销售期期次数据
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
		// // 招生期节点
		// selDateNodeRemoteMethod(query) {
		// 	let params = {
		// 		date_range_id: this.filters.date_range_id.id,
		// 		type: 2,
		// 	};
		// 	this.selDateNodeLoading = true;
		// 	getDateNodeList(params)
		// 		.then(res => {
		// 			if (res.data.success) {
		// 				this.selDateNodeOptions = res.data.data.items;
		// 			} else {
		// 				this.$notify({
		// 					title: "错误",
		// 					message: res.data.msg,
		// 					type: "error"
		// 				});
		// 			}
		// 			this.selDateNodeLoading = false;
		// 		})
		// 		.catch(error => {
		// 			this.errorFunction(error);
		// 		});
        //
		// },
		// 导出excel
		handleExport() {
            let params = "?page_index=" + this.page_index + '&page_size=' + this.page_size + "&date=" + (this.filters.date ? Date.parse(this.filters.date) : '') +
				"&date_range_id=" + (this.filters.date_range_id ? this.filters.date_range_id.id : '') + "&station_number=" + this.filters.station_number;

            console.log(params);

            // 借用隐藏的form表单提交数据 请求到excel进行下载
			this.$refs['oForm'].action = "/op/promoter/stat_man/personal/export" + params;
			this.$refs['oForm'].methods = 'post';
			this.$refs['oForm'].submit();
		},
		/**
		 * 分页相关操作
		 */
		handleCurrentChange(page) {
			this.page_index = page;
			this.loadList()
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
	},
	mounted() {
		this.loadList();
	}
}
</script>

<style lang="css">
</style>
