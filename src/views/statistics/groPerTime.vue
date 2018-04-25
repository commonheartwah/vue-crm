<template lang="html">
    <section>
        <!-- <el-row>
            <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
                <el-form :inline='true' :model='filters'>
                    <el-form-item>
                        <el-select v-model="filters.date_range_id" style="width: 250px;" placeholder="请输入批次名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" @change='changeDateRangeId' :loading='selDateRangeLoading'>
                            <el-option v-for="item in selDateRangeOptions" :key="item.id" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-if="filters.date_range_id">
                        <el-date-picker v-model="filters.date" type="datetimerange" placeholder="选择时间范围" @change='loadData' :picker-options="pickerOptions"></el-date-picker>
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type='primary' @click='loadData'>查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row> -->
        <el-table :data="dataList" border  style="width: 100%" v-if='jumpFromType == 2'>
            <el-table-column prop="titleName" label="分站号" width="150" fixed></el-table-column>
            <el-table-column label="招生" align='center'>
                <el-table-column prop="recruitTarget" label="总招生目标" width="120" :formatter='showJudge'></el-table-column>
                <el-table-column prop="recruitReport" label="招生上报" width="120" :formatter='showJudge'></el-table-column>
                <el-table-column prop="recruitBinding" label="总招生完成" width="120" :formatter='showJudge'></el-table-column>
                <el-table-column prop="recruitOffset" label="总招生偏差" width="120" :formatter='showJudge'></el-table-column>
                <el-table-column prop="recruitFinishRate" label="招生完成率" width="120" :formatter='showJudge'></el-table-column>
                <!-- <el-table-column prop="recruitFinishAllRate" label="招生完成占比" width="130" :formatter='showJudge'></el-table-column>
                <el-table-column prop="recruitPerBinding" label="人均完成" width="120" :formatter='showJudge'></el-table-column> -->
            </el-table-column>
        </el-table>
        <el-table :data="dataList" border  style="width: 100%" v-if='jumpFromType == 3'>
            <el-table-column prop="titleName" label="分站号" width="150" fixed></el-table-column>
            <el-table-column label="销售" align='center'>
                <el-table-column prop="saleTarget" label="总销售目标" width="120" :formatter='showJudge'></el-table-column>
                <el-table-column prop="saleBinding" label="总销售完成" width="120" :formatter='showJudge'></el-table-column>
                <el-table-column prop="saleOffset" label="总销售偏差" width="120" :formatter='showJudge'></el-table-column>
                <el-table-column prop="saleFinishRate" label="销售完成率" width="120" :formatter='showJudge'></el-table-column>
                <!-- <el-table-column prop="saleFinishAllRate" label="销售完成占比" width="130" :formatter='showJudge'></el-table-column> -->
                <!-- <el-table-column prop="salePerBinding" label="人均完成" width="120" :formatter='showJudge'></el-table-column> -->
                <!-- <el-table-column prop="saleConvertRate" label="转化率" width="120" :formatter='showJudge'></el-table-column> -->
                <!-- <el-table-column prop="saleZero" label="零销售人数" width="120" :formatter='showJudge'></el-table-column> -->
                <el-table-column prop="totalRank" label="组排名" sortable width="120" :formatter='showJudge'></el-table-column>
            </el-table-column>
        </el-table>

        <!-- <el-col :span='24' class='toolbar'>
    		<el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='page_size' :total='totalCount' style='float: right'></el-pagination>
    	</el-col> -->
    </section>
</template>

<script>
import {
	getDateNodeList,
	statisticsGroPersRecruitSaleTime
} from '../../api/api'
export default {
	data() {
		return {
			selDateRangeOptions: [],
			selDateRangeLoading: true,
			filters: {
				date_range_id: '',
				date: ''
			},
			dataList: [],
			date_range_id: '',
			promoter_group_id: '',
			jumpFromType: '',
            // 分页
			totalCount: 1,
			page_index: 1,
			page_size: 20,
		}
	},
	methods: {
		loadData() {
			let para = {
				type: this.$route.query.type,
                start_date: this.$route.query.start_date,
				end_date: this.$route.query.end_date,
				promoter_group_id: this.$route.query.promoter_group_id,
				date_range_id: this.$route.query.date_range_id,
                // page_index: this.page_index,
                // page_size: this.page_size,
			}
			statisticsGroPersRecruitSaleTime(para).then(res => {
					if (res.data.success) {
                        this.dataList = res.data.data;
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
					this.errorFunction(error);
				})
		},
        /***
		 * @function 分页
		 */
		handleCurrentChange(val) {
			this.page_index = val;
			this.loadData();
		},
		selDateRangeRemoteMethod(query) {
			if (query !== "") {
				this.selDateRangeLoading = true;
				let parameter = {
					name: query,
					type: this.jumpFromType
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
		changeDateRangeId() {

		},
        showJudge(row, col) {
            let property = col.property;
			let num = row[property];
			return (num !== '' && num) || num === 0 ? num : '/'
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
		}
	},
	mounted() {
		this.date_range_id = this.$route.query.date_range_id;
		this.promoter_group_id = this.$route.query.promoter_group_id;
		this.jumpFromType = this.$route.query.type
		this.loadData()
	}
}
</script>

<style lang="css">
</style>
