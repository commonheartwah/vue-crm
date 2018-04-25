<template lang="html">
    <section>
        <el-row>
            <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
                <el-form :inline='true' :model='filters'>
                    <el-form-item>
                        <el-select v-model="filters.date_range_id" style="width: 230px;" placeholder="请输入期次名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" @change='loadList' :loading='selDateRangeLoading'>
                            <el-option v-for="item in selDateRangeOptions" :key="item.id" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="filters.station_number" clearable filterable placeholder="请输入分站号" icon="circle-cross" :on-icon-click="handleIconClick_clear"></el-input>
                    </el-form-item>
                    <el-form-item v-if='filters.date_range_id'>
                        <el-select v-model="filters.date_node_id" style="width: 230px;" placeholder="请输入节点名称查询" filterable clearable remote :remote-method="selDateNodeRemoteMethod" @change='loadList' :loading='selDateNodeLoading' >
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
            <el-table-column prop="entity.id" label="ID" width="80" align='center'></el-table-column>
            <el-table-column prop="entity.userName" label="用户名" width="120" align='center'></el-table-column>
            <el-table-column prop="entity.familyName" label="家族" width="120" align='center'></el-table-column>
            <el-table-column prop="entity.groupName" label="小组" width="120" align='center'></el-table-column>
            <el-table-column prop="entity.teamName" label="小队" align='center'></el-table-column>
            <el-table-column prop="entity.phone" label="手机号" align='center'></el-table-column>
            <el-table-column prop="entity.stationNumber" label="分站号" align='center'></el-table-column>
            <el-table-column prop="entity.dateRange" label="批次" align='center'></el-table-column>
            <el-table-column prop="entity.number" label="招生数" align='center'></el-table-column>
            <el-table-column prop="entity.dateNodeName" label="所属节点" align='center'></el-table-column>
            <el-table-column prop="entity.dateTime" label="日期" align='center' :formatter='formatTime'></el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button-group>
                        <el-button type="success" size="small" @click="updateDialog(scope.row, scope.$index)">编辑</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>
        <!-- 更新招生数弹窗 -->
        <el-dialog title='修改招生人数' :visible.sync="updateFormVisible" :close-on-click-modal='false'>
            <el-form :model='enrollNumData' label-width='100px' ref="enrollNumberData" :rules="enrollNumDataRules">
                <el-form-item label='招生人数' prop="number">
                    <el-input v-model.number='enrollNumData.number' auto-complete='off' style="width:200px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="updateFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="updateEnrollNumber">提交</el-button>
            </div>
        </el-dialog>
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
	getDateNodeList,
	getDateRangeList,
	getPromoterEnrollNumList,
	updatePromoterEnrollNum,
} from '../../api/api'
import util from '../../common/js/util'
export default {
	data() {
		return {
			filters: {
				date_range_id: '',
				date_node_id: '',
				station_number: '',
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
			totalCount: 0,
			updateFormVisible: false,
			enrollNumData: {
				id: '',
				number: 0
			},
			enrollNumDataRules: {
				'number': [{
					type: 'number',
					required: true,
					message: '请输入招生人数',
					trigger: 'blur'
				}],
			},
			selGroupNameLoading: true,
			groupList: []
		}
	},
	methods: {
		// 初始化数据
		loadList() {
			let para = {
				date_range_id: this.filters.date_range_id,
				date_node_id: this.filters.date_node_id,
				station_number: this.filters.station_number,
				page_index: this.page_index
			}
			getPromoterEnrollNumList(para).then(res => {
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
		selDateNodeRemoteMethod(query) {
			let params = {
				date_range_id: this.filters.date_range_id,
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
		/**
		 * 分页相关操作
		 */
		handleCurrentChange(page) {
			this.page_index = page;
			this.loadList()
		},
		// 打开更新招生数弹窗
		updateDialog(item) {
			this.$set(this.enrollNumData, 'id', item.entity.id);
			this.$set(this.enrollNumData, 'number', item.entity.number)
			// this.enrollNumData = {
			// 	id: item.entity.id,
			// number: item.entity.number
			// }
			this.updateFormVisible = true;
		},
        // 导出excel
		handleExport() {
			let params = "?page_index=" + this.page_index + "&date_range_id=" + (this.filters.date_range_id ? this.filters.date_range_id : '') +
                "&date_node_id=" + this.filters.date_node_id + "&station_number=" + this.filters.station_number;
			// 借用隐藏的form表单提交数据 请求到excel进行下载
			this.$refs['oForm'].action = "/op/promoter/enroll_num/export" + params;
			this.$refs['oForm'].methods = 'post';
			this.$refs['oForm'].submit();
		},
		// 更新招生人数
		updateEnrollNumber() {
			this.$refs.enrollNumberData.validate(vaild => {
				if (vaild) {
					let para = Object.assign({}, this.enrollNumData)
					updatePromoterEnrollNum(para).then(res => {
							if (res.data.success) {
								this.$notify({
									title: '成功',
									message: '更新成功',
									type: 'success'
								})
								this.loadList();
								this.updateFormVisible = false;
							} else {
								this.$notify({
									title: '失败',
									message: res.data.message,
									type: 'error'
								})
							}
						})
						.catch(error => {
							this.errorFunction(error)
						})
				}
			})

		},
		// 数据格式话
		formatTime(row, column) {
			let property = column.property.split('.')
			let time = row[property[0]][property[1]]
			if (time === 0) {
				return '/'
			}
			return util.formatDate.format(new Date(time), 'yyyy/MM/dd');
		},
		handleIconClick_clear() {
			this.filters.station_number = '';
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
