<template lang="html">
    <section>
        <!-- 查询 -->
        <!-- 过滤查询 -->
    	<el-row>
    		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
                <el-form :inline='true' :model='filters'>
                    <el-form-item>
    					<el-select v-model="filters.date_range_id" style="width: 310px;" placeholder="请输入期次名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" @change='changeRangeId' :loading='selDateRangeLoading'>
    						<el-option v-for="item in selDateRangeOptions" :key="item.id" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id">
    						</el-option>
    					</el-select>
    				</el-form-item>
                    <el-form-item>
    					<el-button type='primary' @click='loadData'>查询</el-button>
    				</el-form-item>
    				<!-- <el-form-item>
    					<el-button type='primary' @click='handleExport'>导出excel</el-button>
    				</el-form-item> -->
                </el-form>
    		</el-col>
    	</el-row>
        <table class='tableList' border="1">
            <thead>
                <tr>
                    <td rowspan='3' class="architecture">架构</td>
                    <td rowspan='3' class="architecture">推广人类型</td>
                    <td colspan='3' rowspan='2' class="offset">推广人缺口</td>
                    <td colspan='8' class="recruit">招生</td>
                    <td colspan="12" class="sale">销售</td>
                </tr>
                <tr>
                    <td colspan='5' class="recruit">业绩</td>
                    <td colspan='3' class="recruit">人效</td>
                    <td colspan='5' class="sale">业绩</td>
                    <td rowspan='2' class="sale">转化率</td>
                    <td colspan='3' class="sale">人效</td>
                </tr>
                <tr>
                    <td class="offset">应在职人数</td>
                    <td class="offset">实际在职人数</td>
                    <td class="offset">人员饱和率</td>
                    <td class="recruit">总招生目标</td>
                    <td class="recruit">总招生完成</td>
                    <td class="recruit">总招生偏差</td>
                    <td class="recruit">招生完成率</td>
                    <td class="recruit">招生完成占比</td>
                    <td class="recruit">单人目标</td>
                    <td class="recruit">人均完成</td>
                    <td class="recruit">人均完成率</td>
                    <td class="sale">总销售目标</td>
                    <td class="sale">总销售完成</td>
                    <td class="sale">总销售偏差</td>
                    <td class="sale">销售完成率</td>
                    <td class="sale">销售完成占比</td>
                    <td class="sale">单人目标</td>
                    <td class="sale">人均完成</td>
                    <td class="sale">人均完成率</td>
                </tr>
            </thead>
            <tbody>
                <template class="catlog" v-for='(items, index) in totalDataList'>
                    <tr v-for='(item, _index) in items.data' :style="_index == 3?'background:rgb(245, 245, 245);':''">
                        <td rowspan="4" v-if='_index == 0' class="rowspan">{{ items.name }}</td>
                        <td>{{ item.promoterPosition | formatJudge}}</td>
                        <td>{{ item.proMeantNum | formatJudge}}</td>
                        <td>{{ item.proActualNum | formatJudge}}</td>
                        <td>{{ item.proSatRate | formatJudge }}</td>
                        <td>{{ item.recruitTarget | formatJudge }}</td>
                        <td>{{ item.recruitBinding | formatJudge }}</td>
                        <td>{{ item.recruitOffset | formatJudge }}</td>
                        <td :style="item.recruitFinishRate ?(item.recruitFinishRate.split('%')[0] < 100 ?'color:red;':'') : ''">{{ item.recruitFinishRate | formatJudge }}</td>
                        <td>{{ item.recruitFinishAllRate | formatJudge }}</td>
                        <td>{{ item.recruitPerTarget | formatJudge }}</td>
                        <td>{{ item.recruitPerBinding | formatJudge }}</td>
                        <td :style="item.recruitPerFinishRate ? (item.recruitPerFinishRate.split('%')[0] < 100 ?'color:red;':''):''">{{ item.recruitPerFinishRate | formatJudge }}</td>
                        <td>{{ item.saleTarget | formatJudge }}</td>
                        <td>{{ item.saleBinding | formatJudge }}</td>
                        <td>{{ item.saleOffset | formatJudge }}</td>
                        <td :style="item.saleFinishRate ? (item.saleFinishRate.split('%')[0] <= 100 ?'color:red;':'') : ''">{{ item.saleFinishRate | formatJudge }}</td>
                        <td>{{ item.saleFinishAllRate | formatJudge }}</td>
                        <td>{{ item.saleConvertRate | formatJudge }}</td>
                        <td>{{ item.salePerTarget | formatJudge }}</td>
                        <td>{{ item.salePerBinding | formatJudge }}</td>
                        <td :style="item.salePerFinishRate ? (item.salePerFinishRate.split('%')[0] < 100 ?'color:red;':''):''">{{ item.salePerFinishRate | formatJudge }}</td>
                    </tr>
                </template>
            </tbody>
        </table>
    </section>
</template>

<script>
import {
	statisticsPromoterRecruitSale,
	getDateRangeList
} from '../../api/api'
import util from '../../common/js/util'

export default {
	data() {
		return {
			filters: {
				date_range_id: '',
			},
			totalDataList: [],
			selDateRangeLoading: false,
			selDateRangeOptions: [],
		}
	},
	methods: {

		loadData() {
			let para = {
				date_range_id: this.filters.date_range_id
			}
			statisticsPromoterRecruitSale(para).then(res => {
					if (res.data.success) {
						this.totalDataList = res.data.data
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
		getDateNodeListMounted() {
			let para = {
				date: new Date().getTime(),
				type: 2
			}
			getDateRangeList(para).then(res => {
					if (res.data.success) {
						let dataList = res.data.data.items;
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
						this.filters.date_range_id = dataList[0].entity.id;
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
		// 获取列表
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
		changeRangeId() {
            if (this.filters.date_range_id) {
                this.loadData()
            }
		},
		// 导出excel
		handleExport() {

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
	filters: {
		formatJudge(actual) {
			return ((actual && actual !== '') || actual === 0) ? actual : '/'
		}
	},
	mounted() {
		this.getDateNodeListMounted();
	}
}
</script>

<style lang="less">
.tableList {
    width: 100%;
    border: 1px solid rgb(223, 236, 236);
    text-align: center;
    /*border-color: #ebf3f5;*/
    border-collapse: collapse;
    thead {
        tr {
            td {
                font-weight: 500;
            }
        }
    }
    .offset {
        background: rgb(238, 220, 220);
    }
    .recruit {
        background: rgb(210, 225, 210);
    }
    .sale {
        background: rgb(200, 220, 238);
    }
    .type {
        background: rgb(220, 230, 230);
    }
    .architecture {
        background: rgb(230, 230, 230);
    }
    td {
        /*border: 0.1px solid #ebf3f5;*/
        text-align: center;
        height: 25px;
    }
    tr:hover {
      background-color: rgb(239, 249, 249)!important;
      .rowspan {
        background-color: #fff;
      }
    }
}
</style>
