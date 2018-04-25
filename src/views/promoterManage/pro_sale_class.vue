<template lang="html">
	<section>
		<!-- 筛选 -->
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
		    <el-form :inline='true' :model='filters'>
				<el-form-item>
					<el-select v-model="filters.date_range_id" style="width: 260px;" placeholder="请输入销售期名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" :loading='selDateRangeLoading' @change="init">
						<el-option v-for="item in selDateRangeOptions" :key="item.id" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.family_id" style="width: 220px;" placeholder="请填写家族名称搜索" filterable clearable remote :remote-method="familyListRemoteMethod" :loading='familyListLoading' @change='init'>
						<el-option v-for="item in familyListOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.group_id" style="width: 220px;" placeholder="请填写小组名称搜索" filterable clearable remote :remote-method="organizationRemoteMethod" :loading='organizationLoading' @change='init'>
						<el-option v-for="item in organizationOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type='primary' @click='init'>查询</el-button>
					<el-button type="success" @click="uploadExcelVisible = true">上传Excel</el-button>
				</el-form-item>
		    </el-form>
		</el-col>
		<!-- 列表 -->
		<el-table :data="formData" border stripe v-loading="initLoading">
			<el-table-column prop='entity.id' label='ID' width='80' sortable align='center'></el-table-column>
			<el-table-column prop='entity.stationNumber' label='分站号' width='100' align='center'></el-table-column>
			<el-table-column prop='entity.familyName' label='家族名称' width='160' show-overflow-tooltip align='center'></el-table-column>
			<el-table-column prop='entity.groupName' label='小组名称' width='160' show-overflow-tooltip align='center'></el-table-column>
			<el-table-column prop='entity.teamName' label='小队名称' width='160' show-overflow-tooltip align='center'></el-table-column>
			<el-table-column prop='entity.saleDateRange' label='销售期名称' width='160' show-overflow-tooltip align='center'></el-table-column>
			<el-table-column prop='entity.courseName' label='课程名称' min-width='300' align='center' show-overflow-tooltip></el-table-column>
			<el-table-column prop='entity.courseType' label='课程类型' width='120' align='center' show-overflow-tooltip></el-table-column>
			<el-table-column prop='entity.number' label='课程销售数' min-width='120' align='center' show-overflow-tooltip></el-table-column>
			<el-table-column prop='entity.orderTime' label='订单时间' width='125' align='center' :formatter='formatTime'></el-table-column>
			<el-table-column prop='entity.tradeNo' label='订单号' width='150' align='center' show-overflow-tooltip></el-table-column>
			<el-table-column prop="entity.stat" label="订单状态" width="120" fixed="right"  align='center'
		        :filters="[{ text: '取消', value: 0 }, { text: '退款', value: 1 }, { text: '销售', value: 2 }, { text: '待定', value: 3 }]"
		        :filter-method="filterTag"
		        filter-placement="bottom-end"
			    :formatter='formatStat'>
		    </el-table-column>
		</el-table>
		<!-- 分页条 -->
		<el-col :span='24' class='toolbar'>
			<el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='page_size' :total='totalCount' style='float: right'></el-pagination>
		</el-col>
		<!-- 导入excel界面 -->
		<el-dialog title='导入excel' v-model='uploadExcelVisible' :close-on-click-modal='false'>
			<el-form :model='importForm' label-width='10px' ref='importForm'>
				<el-form-item>
					<el-upload
						class="upload-demo"
						ref="upload"
						action="op/promoter/sale_class/excel"
						name="bin"
						list-type="importture"
						:on-change="handleChange"
						:file-list="fileList"
						:auto-upload="false"
						:on-success="handleSuccess"
					>
						<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
						<el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
						<div slot="tip" class="el-upload__tip">只支持单个文件上传 且只能上传excel文件</div>
					</el-upload>
				</el-form-item>
			</el-form>
		</el-dialog>
	</section>
</template>

<script>
import util from '../../common/js/util'
import {
	getProSaleClass,
	getPromoterGroupList,
	getDateRangeList,
	getPromoterFamilyList
} from '../../api/api'
export default {
	data() {
		return {
			formData:[],
			filters: {
				date_range_id: '',
				family_id: '',
				group_id: ''
			},
			initLoading: false,
			page_index: 1,
			page_size: 20,
			totalCount: 1,
			selDateRangeOptions: [],
			selDateRangeLoading: false,
			organizationOptions: [],
			organizationLoading: false,
			familyListOptions: [],
			familyListLoading: false,
			uploadExcelVisible: false,
			importForm: {},
			fileList: [],
		}
	},
	methods: {
		init() {
			let param = {
				page_index: this.page_index,
				date_range_id: this.filters.date_range_id,
				family_id: this.filters.family_id,
				group_id: this.filters.group_id
			}
			getProSaleClass(param)
				.then(res => {
					if (res.data.success) {
						this.formData = res.data.data.items ? res.data.data.items : [];
						this.totalCount = res.data.data.totalCount;
					} else {
						this.$notify({
							title: "错误",
							message: res.data.msg,
							type: "error"
						});
					}
					this.initLoading = false;
				})
				.catch(error => {
					this.initLoading = false;
					this._catch(error)
				})
		},
		/***
		 * @function 分页
		 */
		handleCurrentChange(val) {
			this.page_index = val;
			this.init();
		},
		formatTime(row, column) {
            let property = column.property.split('.')
            let time = row[property[0]][property[1]]
			if (time === 0) {
				return '/'
			}
			return util.formatDate.format(new Date(time), 'yyyy/MM/dd');
		},
		formatStat(row, column) {
			let property = column.property.split('.')
            let stat = row[property[0]][property[1]]
			switch (stat) {
				case 0:
					return '取消'
					break;
				case 1:
					return '退款'
					break;
				case 2:
					return '销售'
					break;
				case 3:
					return '待定'
					break;
				default:
					return '未知'
			}
		},
		/**
		 * [selDateRangeRemoteMethod 查找推广人销售期的方法]
		 * @param  {[type]} query [批次名字]
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
			searchApi = getPromoterGroupList;
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
		familyListRemoteMethod(query) {
			let searchApi = getPromoterFamilyList;
			if (query !== "") {
				this.familyListLoading = true;
				let parameter = {
					name: query
				};
				searchApi(parameter).then(res => {
					if (res.data.success && res.data.data.items) {
						this.familyListOptions = res.data.data.items.map(item => {
							let tempObj = {
								id: item.id,
								name: item.name,
							};
							return tempObj;
						});
					}
					this.familyListLoading = false;
				})
				.catch(error => {
					this._catch(error);
				});
			} else {
				this.familyListOptions = [];
			}
		},
		//on-change 对应的函数 文件状态改变的时候触发
        handleChange(file, fileList){
            if (fileList.length>1) {
                fileList.length = 1;
                this.$notify({
                    title: '错误',
                    message: '只支持单个文件上传',
                    type: 'error'
                });
            }
        },
		submitUpload() {
            if (this.$refs.upload.uploadFiles[0]) {
                this.$refs.upload.submit();
            }else{
                this.$notify({
                    title: '错误',
                    message: '请选择excel文件',
                    type: 'error'
                });
            }
        },
		handleSuccess(response, file, fileList){
            if (response.success) {
                this.$notify({
                    title: '成功',
                    message: '操作成功,请等待处理...',
                    type: 'success'
                });
                this.$refs['importForm'].resetFields();
                this.$refs['upload'].uploadFiles.length = 0;
                this.uploadExcelVisible = false;
                // 25s后加载列表
                let self = this;
                this.totalCount = 0;
                this.listLoading = true;
                setTimeout(function(){
                    self.init();
                }, 25000)

            }else{
                this.$notify({
                    title: '错误',
                    message: response.msg,
                    type: 'error'
                })
            }
        },
		filterTag(value, row) {
	        return row.entity.stat === value;
	    },
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
		},
	},
	mounted() {
		this.init()
	}
}
</script>

<style lang="css">
</style>
