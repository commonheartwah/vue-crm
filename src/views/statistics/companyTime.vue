<template lang="html">
    <section>
        <el-row>
            <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
                <el-form :inline='true' :model='filters'>
                    <el-date-picker v-model="filters.dateRange" type="daterange" placeholder="选择时间范围" align="left" @change='init'></el-date-picker>
                    <el-form-item>
                        <el-button type='primary' @click='loadData'>查询</el-button>
                    </el-form-item>
                    <!-- <el-form-item>
                        <el-button type='primary' @click='handleExport'>导出excel</el-button>
                    </el-form-item> -->
                </el-form>
            </el-col>
        </el-row>
        <table class='tableList' align='center' border="1" width='100%' cellspacing='0'>
            <thead>
                <tr>
                    <td rowspan='2' class="architecture">架构</td>
                    <td rowspan='2' class="offset">推广人类型</td>
                    <td colspan='2' class="recruit">招生</td>
                    <td colspan="2" class="sale">销售</td>
                </tr>
                <tr>
                    <td class="recruit">总招生完成</td>
                    <td class="recruit">人均完成</td>
                    <td class="sale">总销售完成</td>
                    <td class="sale">人均完成</td>
                </tr>
            </thead>
            <tbody>
                <template class="catlog" v-for='(items, index) in dataList'>
                    <tr v-for='(item, _index) in items.data' :style="_index == 3 ? 'background:rgb(245, 245, 245);':''">
                        <td v-if='_index == 0' rowspan="4" class="rowspan">{{ items.name }}</td>
                        <td>{{item.promoterPosition}}</td>
                        <td>{{ item.recruitBinding }}</td>
                        <td>{{ item.recruitPerBinding }}</td>
                        <td>{{ item.saleBinding }}</td>
                        <td>{{ item.salePerBinding }}</td>
                    </tr>
                </template>
            </tbody>
        </table>
    </section>
</template>

<script>
import {
	statisticsProTypeRecruitSaleTime
} from '../../api/api'
export default {
	data() {
		return {
			dataList: [],
			filters: {
				dateRange: [new Date().getTime(), new Date().getTime()]
			}
		}
	},
	methods: {
        init() {
            if (this.filters.dateRange) {
                this.loadData()
            }
        },
		loadData() {
			let para = {
				start_date: new Date(this.filters.dateRange[0]).getTime(),
				end_date: new Date(this.filters.dateRange[1]).getTime()
			}
			statisticsProTypeRecruitSaleTime(para).then(res => {
					if (res.data.success) {
						this.dataList = res.data.data;
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
	mounted() {
		this.loadData()
	}
}
</script>

<style lang="less">
.tableList {

    td {
        text-align: center;
        height: 40px;
    }
}
</style>
