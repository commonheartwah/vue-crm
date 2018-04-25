<template lang="html">
    <section>
        <!-- 筛选 -->
        <el-row>
    		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
                <el-form :inline='true' :model='filters'>
                    <el-form-item>
    					<el-select v-model="filters.type" placeholder="请选择类型" @change="loadList">
    						<el-option label="家族" :value="0"></el-option>
                            <el-option label="小组" :value="1"></el-option>
                            <el-option label="公司" :value="2"></el-option>
    						<el-option label="小队" :value="3"></el-option>
    					</el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="filters.family_id" style="width: 230px;" placeholder="请输入家族名称查询" filterable clearable remote :remote-method="familyNameChoose" @change='changeFamilyId' :loading='selFamilyNameLoading' v-if='filters.type == 1 || filters.type == 0'>
    						<el-option v-for="item in familyList" :key="item.id" :label="'('+item.id+')' + ' ' +item.name" :value="item.id">
    						</el-option>
    					</el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="filters.group_id" style="width: 230px;" placeholder="请输入小组名称查询" filterable clearable remote :remote-method="groupNameChoose" @change='loadList' :loading='selGroupNameLoading' v-if='filters.type == 1'>
    						<el-option v-for="item in groupList" :key="item.id" :label="'('+item.id+')' + ' ' +item.name" :value="item.id">
    						</el-option>
    					</el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-select v-model="filters.pro_tm_id" style="width: 230px;" placeholder="请输入小队名称查询" filterable clearable remote :remote-method="teamNameChoose" @change='loadList' :loading='selTeamNameLoading' v-if='filters.type == 3'>
                            <el-option v-for="item in teamList" :key="item.id" :label="'('+item.id+')' + ' ' +item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
    					<el-select v-model="filters.date_range_id" style="width: 230px;" placeholder="请输入期次名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" @change='loadList' :loading='selDateRangeLoading'>
    						<el-option v-for="item in selDateRangeOptions" :key="item.id" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item">
    						</el-option>
    					</el-select>
    				</el-form-item>
                    <el-form-item>
    					<el-select v-model="filters.date_node_id" style="width: 230px;" placeholder="请输入节点名称查询" filterable clearable remote :remote-method="selDateNodeRemoteMethod" @change='loadList' :loading='selDateNodeLoading'>
    						<el-option v-for="item in selDateNodeOptions" :key="item.entity.id" :label="item.entity.name" :value="item.entity.id">
    						</el-option>
    					</el-select>
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
            <el-table-column prop="familyName" label="家族" width="120" align='center' v-if="filters.type != 2"></el-table-column>
            <el-table-column prop="groupName" label="小组" width="120" align='center' v-if='filters.type == 1 || filters.type == 3'></el-table-column>
            <el-table-column prop="teamName" label="小队" width="120" align='center' v-if='filters.type == 3' :formatter="formatTeamName"></el-table-column>
            <el-table-column prop="dateRangeName" label="期次名称" width="160" align='center'></el-table-column>
            <el-table-column prop="nodeName" label="节点" width="120" align='center'></el-table-column>
            <el-table-column prop="createDate" label="日期" width="120" align='center'></el-table-column>
            <el-table-column prop="number" label="招生数" width="120" align='center'></el-table-column>
            <el-table-column prop="rangeTarget" label="本期总任务" width="120" align='center'></el-table-column>
            <el-table-column prop="rangeRateNum" label="当期完成率" width="120" align='center'></el-table-column>
            <el-table-column prop="nodeTarget" label="本节点任务" width="120" align='center'></el-table-column>
            <el-table-column prop="nodeRateNum" label="当前节点完成率" width="120" align='center'></el-table-column>
            <el-table-column prop="proNum" label="有效上报人数" width="120" align='center'></el-table-column>
            <el-table-column prop="avgNumber" label="人均数" width="120" align='center'></el-table-column>
            <el-table-column prop="prevProNum" label="上期本节点有效上报人数" width="120" align='center'></el-table-column>
            <el-table-column prop="prevNumber" label="上期本节点招生数" width="120" align='center'></el-table-column>
            <el-table-column prop="prevAvgNumber" label="上期本节点人均数" width="120" align='center'></el-table-column>
            <el-table-column prop="AvgLinkRelative" label="人均环比" width="120" align='center'></el-table-column>

        </el-table>
        <!-- 分页条 -->
    	<el-col :span='24' class='toolbar'>
    		<el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='20' :total='totalCount' style='float: right'></el-pagination>
    	</el-col>

        <!-- 隐藏的form表单 接收服务器发来的excel文件 用form表单的post进行请求 浏览器会自动下载 别的方式暂时不可以 -->
    	<section>
    		<form method="post" ref="oForm"></form>
    	</section>
    </section>

</template>

<script>
import {
	enrollStatMan,
	getDateRangeList,
	getPromoterFamilyList,
	getPromoterGroupListByFamily,
	getDateNodeList,
	statManGroupEnrollExport,
    getPromoterTeamList
} from '../../api/api'
import util from '../../common/js/util'
export default {
	data() {
		return {
			filters: {
				family_id: '',
				group_id: '',
				date_range_id: '',
				date_node_id: '',
				type: 0,
                pro_tm_id: ''
			},
			page_index: 1,
			totalCount: 0,
			initLoading: true,
			allData: [],
			selFamilyNameLoading: false,
			selDateRangeLoading: false,
			selGroupNameLoading: false,
            selTeamNameLoading: false,
			selDateRangeOptions: [],
			familyList: [],
			groupList: [],
            teamList: [],
			selDateNodeOptions: [],
			selDateNodeLoading: false
		}
	},
	methods: {
		// 初始化列表
		loadList() {
			let para = {
				family_id: this.filters.family_id,
                group_id: this.filters.group_id,
				pro_tm_id: this.filters.pro_tm_id,
				date_range_id: this.filters.date_range_id.id,
				date_node_id: this.filters.date_node_id,
				page_index: this.page_index,
				page_size: 20,
				type: this.filters.type
			};
            this.allData = [];
			enrollStatMan(para).then(res => {
					if (res.data.success) {
						this.allData = res.data.data.items
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
				.catch(error => {
					this.errorFunction(error)
				})
		},
		// 招生期期次数据
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
		// 招生期节点
		selDateNodeRemoteMethod() {
			let params = {
				date_range_id: this.filters.date_range_id.id,
				type: 2,
			};
			this.selDateNodeLoading = true;
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
					this.selDateNodeLoading = false;
				})
				.catch(error => {
					this.errorFunction(error);
				});

		},
		// 家族数据
		familyNameChoose(query) {
			if (query !== "") {
				this.selFamilyNameLoading = true;
				let parameter = {
					name: query,
				};
				getPromoterFamilyList(parameter).then(res => {
						if (res.data.success) {
							if (res.data.data.items && res.data.data.items.length) {
								this.familyList = res.data.data.items
							}
						}
						this.selFamilyNameLoading = false;
					})
					.catch(error => {
						this.errorFunction(error);
					});
			} else {
				this.familyList = [];
			}
		},
		// 小组数据
		groupNameChoose(query) {
			if (query !== "") {
				this.selGroupNameLoading = true;
				let parameter = {
					name: query,
					family_id: this.filters.family_id
				};
				getPromoterGroupListByFamily(parameter).then(res => {
						if (res.data.success) {
							if (res.data.data.items && res.data.data.items.length) {
								this.groupList = res.data.data.items.map((item, index) => {
									let items = {
										id: item.id,
										name: item.name
									}
									return items
								})
							}
						}
						this.selGroupNameLoading = false;
					})
					.catch(error => {
						this.errorFunction(error);
					});
			} else {
				this.groupList = [];
			}
		},
        // 获取推广人小队列表
		teamNameChoose(query) {
			if (query !== "") {
				this.selTeamNameLoading = true;
				let parameter = {
					name: query,
				};
				getPromoterTeamList(parameter).then(res => {
						if (res.data.success) {
							if (res.data.data.items && res.data.data.items.length) {
								this.teamList = res.data.data.items.map((item, index) => {
									let items = {
										id: item.id,
										name: item.name
									}
									return items
								})
							}
						}
						this.selTeamNameLoading = false;
					})
					.catch(error => {
						this.errorFunction(error);
					});
			} else {
				this.teamList = [];
			}
		},
		// 分页数据处理
		handleCurrentChange(page) {
			this.page_index = page;
			this.loadList()
		},
		changeFamilyId(familyId) {
			this.filters.family_id = familyId;
			this.filters.group_id = '';
			this.loadList();
		},
		// 导出excel
		handleExport() {
			let params = "?date_range_id=" + (this.filters.date_range_id ? this.filters.date_range_id.id : '') + "&date_node_id=" + this.filters.date_node_id + "&family_id=" + this.filters.family_id + "&group_id=" + this.filters.group_id + '&type=' + this.filters
				.type;
			// 借用隐藏的form表单提交数据 请求到excel进行下载
			this.$refs['oForm'].action = "/op/promoter/stat_man/enroll_export" + params;
			this.$refs['oForm'].methods = 'post';
			this.$refs['oForm'].submit();
		},
        formatTeamName(row) {
            if (row.teamId == 0) {
                return "暂未分入小队";
            } else {
                return row.teamName;
            }
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
