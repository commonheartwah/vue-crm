<template lang="html">
	<section>
		<el-tabs v-model="activeName">
			<el-tab-pane label="强弱绑定" name="0">
				<!-- 过滤查询 -->
				<el-row>
					<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
						<el-form :inline='true' :model='bindFilters'>
							<el-form-item label='强绑定:'>
								<el-select v-model="bindFilters.str_pro_id" style="width: 240px;" placeholder="请输入推广人分站号或手机号查询" filterable clearable remote :remote-method="selPromoterRemoteMethod" :loading='selPromoterLoading' @change='initBind'>
									<el-option v-for="item in selPromoterOptions" :key="item.id" :label="item.name + '----' + item.stationNumber" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label='弱绑定:'>
								<el-select v-model="bindFilters.weak_pro_id" style="width: 240px;" placeholder="请输入推广人分站号或手机号查询" filterable clearable remote :remote-method="selPromoterRemoteMethod" :loading='selPromoterLoading' @change='initBind'>
									<el-option v-for="item in selPromoterOptions" :key="item.id" :label="item.name + '----' + item.stationNumber" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-select v-model="bindFilters.user_id" style="width: 240px;" placeholder="请输入微信名称" filterable clearable remote :remote-method="selUserRemoteMethod" :loading='selUserLoading' @change='initBind'>
									<el-option v-for="item in selUserOptions" :key="item.id" :label="item.name + '----' + item.mobile" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-select v-model="bindFilters.user_id" style="width: 240px;" placeholder="请输入手机号" filterable clearable remote :remote-method="selUserPhone" :loading='selUserLoading' @change='initBind'>
									<el-option v-for="item in selUserOptions" :key="item.id" :label="item.name + '----' + item.mobile" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item v-if="bindFilters.type === 0">
								<el-date-picker
								  v-model="bindFilters.createTime1"
								  type="daterange"
								  start-placeholder="开始日期"
								  end-placeholder="结束日期"
								  placeholder="请输入查询时间段"
								  >
								</el-date-picker>
							</el-form-item>
							<el-form-item v-else-if="bindFilters.type === 1">
								<el-select v-model="bindFilters.date_range_id" style="width: 240px;" placeholder="请输入名称日期段查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod"  @change='initBind' :loading='selPromoterLoading'>
									<el-option v-for="item in selDateRangeOptions" :key="item" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-select v-model="bindFilters.type" placeholder="请选择" @change='initBind'>
									<el-option value="" label="全部"></el-option>
									<el-option :value="0" label="强绑定"></el-option>
									<el-option :value="1" label="弱绑定"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button type='primary' @click='initBind'>查询</el-button>
								<el-button type='primary' @click="exportBtn('str')">导出</el-button>
							</el-form-item>
						</el-form>
					</el-col>
				</el-row>

				<!-- 列表 -->
				<el-table border :data="bindList" highlight-current-row v-loading="initBindLoading" style="width: 100%;">
					<el-table-column prop="entity.id" label="ID" width="70" align='center'></el-table-column>
					<el-table-column prop="entity.dateRangeName" label="日期段名称" align='center' show-overflow-tooltip></el-table-column>
					<el-table-column prop="entity.userName" label="微信名" width="210" align='center' show-overflow-tooltip></el-table-column>
					<el-table-column prop="entity.phone" label="手机号" width="150" align='center'></el-table-column>
					<el-table-column prop="entity.strongProStationNumber" label="强绑定分站号" width="120" align='center'></el-table-column>
					<el-table-column prop="entity.weakProStationNumber" label="弱绑定分站号" width="120" align='center'></el-table-column>
					<el-table-column prop="entity.strongTime" label="绑定失效时间" width="180" align='center' :formatter='formatTime'></el-table-column>
					<el-table-column label="操作" align="center" fixed="right" width="100">
						<template scope="scope">
							<el-button-group>
								<!-- <el-button type="success" size="small">删除</el-button> -->
								<el-button type="success" size="small" @click="handleDel(scope.$index, scope.row, 0)">删除</el-button>
							</el-button-group>
						</template>
					</el-table-column>
				</el-table>
				<el-col :span='24' class='toolbar'>
					<el-pagination layout='prev, pager, next' @current-change='handleBindCurrentChange' :page-size='bindFilters.page_size' :total='bindFilters.totalCount' style='float: right'></el-pagination>
				</el-col>
			</el-tab-pane>
			<el-tab-pane label="二次绑定" name="1">
				<!-- 过滤查询 -->
				<el-row>
					<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
						<el-form :inline='true' :model='secBindFilters'>
							<el-form-item>
								<el-select v-model="secBindFilters.pro_id" style="width: 240px;" placeholder="请输入推广人分站号或手机号查询" filterable clearable remote :remote-method="selPromoterRemoteMethod" :loading='selPromoterLoading' @change='initSecBind'>
									<el-option v-for="item in selPromoterOptions" :key="item.id" :label="item.name + '----' + item.stationNumber" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-select v-model="secBindFilters.user_id" style="width: 240px;" placeholder="请输入微信昵称查询" filterable clearable remote :remote-method="selUserRemoteMethod" :loading='selUserLoading' @change='initSecBind'>
									<el-option v-for="item in selUserOptions" :key="item.id" :label="item.name + '----' + item.mobile" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-select v-model="secBindFilters.user_id" style="width: 240px;" placeholder="请输入手机号查询" filterable clearable remote :remote-method="selUserPhone" :loading='selUserLoading' @change='initSecBind'>
									<el-option v-for="item in selUserOptions" :key="item.id" :label="item.name + '----' + item.mobile" :value="item.id">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-date-picker
								  v-model="bindFilters.createTime2"
								  type="daterange"
								  start-placeholder="开始日期"
								  end-placeholder="结束日期"
								  placeholder="请输入查询时间段"
								  >
								</el-date-picker>
							</el-form-item>
							<el-form-item>
								<el-button type='primary' @click='initSecBind'>查询</el-button>
								<el-button type='primary' @click="exportBtn('two')">导出</el-button>
							</el-form-item>
						</el-form>
					</el-col>
				</el-row>

				<!-- 列表 -->
				<el-table border :data="secBindList" highlight-current-row v-loading="initSecBindLoading" style="width: 100%;">
					<el-table-column prop="entity.id" label="ID" width="70" align='center'></el-table-column>
					<el-table-column prop="entity.userName" label="微信名" align='center' show-overflow-tooltip></el-table-column>
					<el-table-column prop="entity.phone" label="手机号" width="150" align='center'></el-table-column>
					<el-table-column prop="entity.stationNumber" label="绑定的推广人分站号" width="180" align='center'></el-table-column>
					<el-table-column label="操作" align="center" fixed="right" width="100">
						<template scope="scope">
							<el-button-group>
								<el-button type="success" size="small" @click="handleDel(scope.$index, scope.row, 1)">删除</el-button>
							</el-button-group>
						</template>
					</el-table-column>
				</el-table>
				<el-col :span='24' class='toolbar'>
					<el-pagination layout='prev, pager, next' @current-change='handleSecBindCurrentChange' :page-size='secBindFilters.page_size' :total='secBindFilters.totalCount' style='float: right'></el-pagination>
				</el-col>
			</el-tab-pane>
		</el-tabs>
		<!-- 隐藏的form表单 接收服务器发来的excel文件 用form表单的post进行请求 浏览器会自动下载 别的方式暂时不可以 -->
    	<section>
    		<form method="post" ref="oForm"></form>
    	</section>
	</section>


</template>

<script>
import util from '../../common/js/util'
import {
	getProBindList,
	delProBind,
	getProSecBindList,
	delProSecBind,
	getPromoterList,
	getAppuserList,
	getDateRangeList,
	getPromoterRangeList,
	getwechatNameList,
	getPhoneList
} from '../../api/api'
export default {
	data() {
		return {
			// 表格
			bindList: [],
			secBindList: [],
			initBindLoading: false,
			initSecBindLoading: false,
			// 查询
			bindFilters: {
				str_pro_id: '',
				weak_pro_id: '',
				user_id: '',
				user_phone: '',
				// 分页
				page_index: 1,
				totalCount: 1,
				page_size: 20,
				type: '',
				createTime1: '',
				createTime2: '',
				date_range_id: ''
			},
			secBindFilters: {
				pro_id: '',
				user_id: '',
				// 分页
				page_index: 1,
				totalCount: 1,
				page_size: 20,
			},
			// 远程选择
			selPromoterLoading: false,
			selPromoterOptions: [],
			selUserLoading: false,
			selUserOptions: [],
			selDateRangeLoading: false,
			activeName: '',
			initLoading: false,
			selDateRangeOptions: [],
		}
	},
	methods: {
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
		exportBtn(type) {

			let strDate = new Date(this.bindFilters.createTime1[0]).getTime();
			let endDate = new Date(this.bindFilters.createTime1[1]).getTime();
			let strDate1 = new Date(this.bindFilters.createTime2[0]).getTime();
			let endDate1 = new Date(this.bindFilters.createTime2[1]).getTime();
			let params = '';
			if (type === 'str') {
				params = "?str_pro_id=" + (this.bindFilters.str_pro_id?this.bindFilters.str_pro_id:'') + '&weak_pro_id=' + (this.bindFilters.weak_pro_id?this.bindFilters.weak_pro_id:'') + "&user_id=" + (this.bindFilters.user_id?this.bindFilters.user_id:'')
				+ "&type=" + (this.bindFilters.type) + "&start_time=" + (strDate?strDate:'') + "&end_time=" + (endDate?endDate:'') + "&date_range_id=" + (this.bindFilters.date_range_id?this.bindFilters.date_range_id:'');
				this.$refs['oForm'].action = "/op/promoter/bind/export" + params;
			} else {
				params = "?pro_id=" + (this.secBindFilters.pro_id?this.secBindFilters.pro_id:'') + "&user_id=" + (this.secBindFilters.user_id?this.secBindFilters.user_id:'')
				+ "&start_time=" + (strDate1?strDate1:'') + "&end_time=" + (endDate1?endDate1:'');
				this.$refs['oForm'].action = "/op/promoter/sec/bind/excel" + params;
			}
			this.$refs['oForm'].methods = 'post';
			this.$refs['oForm'].submit();
		},
		initBind() {
			let strDate = new Date(this.bindFilters.createTime1[0]).getTime();
			let endDate = new Date(this.bindFilters.createTime1[1]).getTime();
			let param = {
				page_index: this.bindFilters.page_index,
				page_size: this.bindFilters.page_size,
				str_pro_id: this.bindFilters.str_pro_id,
				weak_pro_id: this.bindFilters.weak_pro_id,
				user_id: this.bindFilters.user_id,
				type: this.bindFilters.type,
				start_time: strDate,
				end_time: endDate
			};
			if (this.bindFilters.type === 0) {
				param.date_range_id = '';
				this.bindFilters.date_range_id = '';
			} else {
				param.date_range_id = this.bindFilters.date_range_id;
				this.bindFilters.createTime1 = '';
			}
			this.bindList = [];
			this.initBindLoading = true;
			getProBindList(param)
				.then((res) => {
					if (res.data.success) {
						this.bindFilters.totalCount = res.data.data.totalCount;
						if (res.data.data.items && res.data.data.items.length) {
							this.bindList = res.data.data.items;
							this.bindFilters.totalCount = res.data.data.totalCount;
						}
					} else {
						this.$notify.error(res.data.msg);
					}
					this.initBindLoading = false;
				})
				.catch(error => {
					this._catch(error);
					this.initBindLoading = false;
				});
		},
		initSecBind() {
			let strDate1 = new Date(this.bindFilters.createTime2[0]).getTime();
			let endDate1 = new Date(this.bindFilters.createTime2[1]).getTime();
			let param = {
				page_index: this.secBindFilters.page_index,
				page_size: this.secBindFilters.page_size,
				pro_id: this.secBindFilters.pro_id,
				user_id: this.secBindFilters.user_id,
				start_time: strDate1,
				end_time: endDate1
			};
			this.initSecBindLoading = true;
			this.secBindList = [];
			getProSecBindList(param)
				.then((res) => {
					if (res.data.success) {
						this.secBindFilters.totalCount = res.data.data.totalCount;
						if (res.data.data.items && res.data.data.items.length) {
							this.secBindList = res.data.data.items;
							this.secBindFilters.totalCount = res.data.data.totalCount;
						}
					} else {
						this.$notify.error(res.data.msg);
					}
					this.initSecBindLoading = false;
				})
				.catch(error => {
					this._catch(error);
					this.initSecBindLoading = false;
				});
		},
		handleDel(index, row, type) {
			console.log(row);
			this.$confirm('此操作将删除此绑定关系, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				let params = {
						ids: row.entity.id
					},
					delFunction;
				switch (type) {
					case 0:
						delFunction = delProBind
						break;
					case 1:
						delFunction = delProSecBind
						break;
					default:
						return;
				}
				delFunction(params)
					.then((res) => {
						if (res.data.success) {
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
							switch (type) {
								case 0:
									this.initBind();
									break;
								case 1:
									this.initSecBind();
									break;
								default:
									this.initBind();
							}
						} else {
							this.$notify({
								title: '失败',
								message: res.data.msg,
								type: 'error',
								offset: 45
							});
						}
					})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		// 分页
		handleBindCurrentChange(val) {
			this.bindFilters.page_index = val;
			this.initBind();
		},
		// 分页
		handleSecBindCurrentChange(val) {
			this.secBindFilters.page_index = val;
			this.initSecBind();
		},
		selPromoterRemoteMethod(query) {
			if (query !== "") {
				this.selPromoterLoading = true;
				let parameter = {};
				if (/^1[3456789]\d{9}$/.test(query)) {
					parameter["phone"] = query
				} else {
					parameter["station_number"] = query
				}
				getPromoterList(parameter).then(res => {
						if (res.data.success && res.data.data.items) {
							this.selPromoterOptions = res.data.data.items.map(item => {
								let tempObj = {
									id: item.userWithInfo.user.id,
									name: item.userWithInfo.user.name,
									stationNumber: item.promoter.stationNumber || '未分配'
								};
								return tempObj;
							});
						}
						this.selPromoterLoading = false;
					})
					.catch(error => {
						this._catch(error);
					});
			} else {
				this.selPromoterOptions = [];
			}
		},
		selUserPhone(query) {
			if (query !== "") {
				this.selUserLoading = true;
				let parameter = {};
				if (/^1[3456789]\d{9}$/.test(query)) {
					parameter["mobile"] = query
				}
				getPhoneList(parameter).then(res => {
						if (res.data.success && res.data.data.items) {
							this.selUserOptions = res.data.data.items.map(item => {
								let tempObj = {
									id: item.id,
									name: item.wechatName || "未绑定",
									mobile: item.mobile || "未绑定"
								};
								return tempObj;
							});
						}
						this.selUserLoading = false;
					})
					.catch(error => {
						this._catch(error);
					});
			} else {
				this.selUserOptions = [];
			}
		},
		selUserRemoteMethod(query) {
			if (query !== "") {
				this.selUserLoading = true;
				let parameter = {};
				parameter["wechat_name"] = query
				// if (/^1[3456789]\d{9}$/.test(query)) {
				// 	parameter["mobile"] = query
				// } else {
				// 	parameter["wechat_name"] = query
				// }
				getwechatNameList(parameter).then(res => {
						if (res.data.success && res.data.data.items) {
							this.selUserOptions = res.data.data.items.map(item => {
								let tempObj = {
									id: item.id,
									name: item.wechatName || "未绑定",
									mobile: item.mobile || "未绑定"
								};
								return tempObj;
							});
						}
						this.selUserLoading = false;
					})
					.catch(error => {
						this._catch(error);
					});
			} else {
				this.selUserOptions = [];
			}
		},
		/**
		 * [formatTime 表格格式化时间]
		 * @param  {[type]} row    [description]
		 * @param  {[type]} column [description]
		 * @return {[type]}        [description]
		 */
		formatTime(row, column) {
			let property = column.property.split('.')
			let time = row[property[0]][property[1]]
			if (time === 0) {
				return '/'
			}
			return util.formatDate.format(new Date(time), 'yyyy/MM/dd hh:mm:ss');
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
	mounted() {
		this.initBind();
		this.initSecBind();
	}
}
</script>

<style lang="css">
</style>
