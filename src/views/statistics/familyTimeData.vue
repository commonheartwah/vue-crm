<template lang="html">
    <section>
        <el-tabs v-model="activeName" @tab-click="handleClickTabs">
			<el-tab-pane label="招生期" name="2">
                <el-row>
            		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
                        <el-form :inline='true' :model='filters'>
                            <el-form-item>
            					<el-select v-model="filters.date_range_id" style="width: 400px;" placeholder="请输入期次名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" @change='changeDateRangeId' :loading='selDateRangeLoading'>
            						<el-option v-for="item in selDateRangeOptions" :key="item.id" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="JSON.stringify(item)">
            						</el-option>
            					</el-select>
            				</el-form-item>
                            <el-form-item v-if="filters.date_range_id">
                                <el-date-picker v-model="filters.date" type="daterange" placeholder="选择时间范围" @change='loadData' :picker-options="pickerOptions"></el-date-picker>
            				    </el-date-picker>
            			  	</el-form-item>
                            <el-form-item>
            					<el-button type='primary' @click='loadData'>查询</el-button>
            				</el-form-item>
                        </el-form>
            		</el-col>
            	</el-row>
                <el-table :data="dataList" border  style="width: 100%" :row-class-name="tableRowClassName">
                    <el-table-column prop="titleName" label="架构" width="150" fixed></el-table-column>
                    <el-table-column label="招生" align='center'>
                        <el-table-column prop="recruitTarget" label="总招生目标" width="120" :formatter='showJudge'></el-table-column>
                        <el-table-column prop="recruitReport" label="招生上报" width="120" :formatter='showJudge'></el-table-column>
                        <el-table-column prop="recruitBinding" label="总招生完成" width="120" :formatter='showJudge'></el-table-column>
                        <el-table-column prop="recruitOffset" label="总招生偏差" width="120" :formatter='showJudge'></el-table-column>
                        <el-table-column prop="recruitFinishRate" label="招生完成率" width="120" :formatter='showJudge'></el-table-column>
                        <el-table-column prop="recruitFinishAllRate" label="招生完成占比" width="130" :formatter='showJudge'></el-table-column>
                        <el-table-column prop="recruitPerBinding" label="人均完成" width="120" :formatter='showJudge'></el-table-column>
                    </el-table-column>
                    <el-table-column  label="操作" width="120">
                        <template scope="scope">
                            <el-button @click.native.prevent="showGroPerDetail(scope.row)" type="info" size="small" v-if='scope.row.titleType == 2'>查看详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
			</el-tab-pane>
			<el-tab-pane label="销售期" name="3">
                <el-row>
            		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
                        <el-form :inline='true' :model='filters'>
                            <el-form-item>
            					<el-select v-model="filters.date_range_id" style="width: 400px;" placeholder="请输入期次名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" @change='changeDateRangeId' :loading='selDateRangeLoading'>
            						<el-option v-for="item in selDateRangeOptions" :key="item.id" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="JSON.stringify(item)">
            						</el-option>
            					</el-select>
            				</el-form-item>
                            <el-form-item v-if="filters.date_range_id">
                                <el-date-picker v-model="filters.date" type="daterange" placeholder="选择时间范围" @change='loadData' :picker-options="pickerOptions"></el-date-picker>
            				    </el-date-picker>
            			  	</el-form-item>
                            <el-form-item>
            					<el-button type='primary' @click='loadData'>查询</el-button>
            				</el-form-item>
                        </el-form>
            		</el-col>
            	</el-row>
                <el-table :data="dataList" border  style="width: 100%" :row-class-name="tableRowClassName">
                    <el-table-column prop="titleName" label="架构" width="150" fixed></el-table-column>
                    <el-table-column label="销售" align='center'>
                        <el-table-column prop="saleTarget" label="总销售目标" width="120" :formatter='showJudge'></el-table-column>
                        <el-table-column prop="saleBinding" label="总销售完成" width="120" :formatter='showJudge'></el-table-column>
                        <el-table-column prop="saleOffset" label="总销售偏差" width="120" :formatter='showJudge'></el-table-column>
                        <el-table-column prop="saleFinishRate" label="销售完成率" width="120" :formatter='showJudge'></el-table-column>
                        <el-table-column prop="saleFinishAllRate" label="销售完成占比" width="130" :formatter='showJudge'></el-table-column>
                        <el-table-column prop="salePerBinding" label="人均完成" width="120" :formatter='showJudge'></el-table-column>
                        <!-- <el-table-column prop="saleConvertRate" label="转化率" width="120" :formatter='showJudge'></el-table-column> -->
                        <!-- <el-table-column prop="saleZero" label="零销售人数" width="120" :formatter='showJudge'></el-table-column> -->
                        <el-table-column prop="familyRank" label="家族排名" width="120" :formatter='showJudge'></el-table-column>
                        <!-- <el-table-column prop="totalRank" label="总排名" width="120" :formatter='showJudge'></el-table-column> -->
                    </el-table-column>
                    <el-table-column  label="操作" width="120">
                        <template scope="scope">
                            <el-button @click.native.prevent="showGroPerDetail(scope.row)" type="info" size="small" v-if='scope.row.titleType == 2'>查看详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
			</el-tab-pane>
		</el-tabs>
    </section>
</template>

<script>
import {
	statisticsFamFroRecruitSaleTime,
	getDateRangeList
} from '../../api/api'
import util from '../../common/js/util'

export default {
	data() {
		return {
			dataList: [],
			selDateRangeOptions: [],
			filters: {
				date_range_id: '',
				date: ''
			},
			selDateRangeLoading: true,
			pickerOptions: {
				disabledDate(startTime, endTime) {
					return false
				}
			},
			activeName: '2',
			dateRangeId: ''
		}
	},
	methods: {
		loadData() {
			let para = {
				type: Number(this.activeName),
				date_range_id: JSON.parse(this.filters.date_range_id).id,
				start_date: new Date(this.filters.date[0]).getTime(),
				end_date: new Date(this.filters.date[1]).getTime()
			}
			statisticsFamFroRecruitSaleTime(para).then(res => {
					if (res.data.success) {
						this.dataList = res.data.data
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
        handleClickTabs(tab) {
            this.filters.date = '';
            this.getDateNodeListMounted();
        },
        tableRowClassName(row, index) {
			if (row.titleType === '1') {
				return 'positive-family';
			}
		},
		selDateRangeRemoteMethod(query) {
			if (query !== "") {
				this.selDateRangeLoading = true;
				let parameter = {
					name: query,
					type: Number(this.activeName)
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
            if (this.filters.date_range_id) {
                let that = this
                this.pickerOptions = {
    				disabledDate(time) {
    					return !(time.getTime() <= JSON.parse(that.filters.date_range_id).time[1] && time.getTime() >= JSON.parse(that.filters.date_range_id).time[0])
    				}
    			}
                this.loadData()
            }
		},
        showJudge(row, col) {
            let property = col.property;
			let num = row[property];
			return (num !== '' && num) || num === 0 ? num : '/'
		},
		showGroPerDetail(row, index) {
			this.$router.push({
				path: '/groPerTime',
				query: {
					promoter_group_id: row.titleId,
					date_range_id: JSON.parse(this.filters.date_range_id).id,
					type: Number(this.activeName),
                    start_date: new Date(this.filters.date[0]).getTime(),
    				end_date: new Date(this.filters.date[1]).getTime()
				}
			})
		},
		getDateNodeListMounted() {
			let para = {
				date: new Date().getTime(),
				type: Number(this.activeName)
			}
			getDateRangeList(para).then(res => {
					if (res.data.success) {
						let dataList = res.data.data.items;
                        let tempObj = {
                            id: dataList[0].entity.id,
                            name: dataList[0].entity.name,
                            startTime: util.formatDate.format(new Date(dataList[0].entity.startTime), 'yyyy/MM/dd'),
                            endTime: util.formatDate.format(new Date(dataList[0].entity.endTime), 'yyyy/MM/dd'),
                            time: [dataList[0].entity.startTime, dataList[0].entity.endTime]
                        }
						this.filters.date_range_id = JSON.stringify(tempObj)
                        this.selDateRangeRemoteMethod(res.data.data.items[0].entity.name)
						this.loadData();
					} else {
						this.$notify({
							title: "错误",
							message: res.data.msg,
							type: "error"
						});
					}
				})
				.catch(error => {
					this.errorFunction(error)
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
		}
	},
	mounted() {
		this.getDateNodeListMounted();
	}
}
</script>

<style lang="less">
.el-table .positive-family {
    background: #c9e5f5;
}
</style>
