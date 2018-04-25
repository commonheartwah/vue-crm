<template>
<div id="root">
	<!-- 列表 -->
	<el-table border :data="allData" highlight-current-row v-loading="initLoading" style="width: 100%;">
		<el-table-column prop="id" label="ID" width="80" align='center'></el-table-column>
		<el-table-column prop="name" label="推广人名称" align='center'></el-table-column>
		<el-table-column prop="gender" label="性别" width="80" align='center' :formatter='formatGender'></el-table-column>
		<el-table-column prop="mobile" label="推广人手机号" width="150" align='center'></el-table-column>
		<el-table-column prop="internal" label="是否为内部用户类型" width="165" align='center' :formatter='formatInternal' show-overflow-tooltip></el-table-column>
		<el-table-column prop="type" label="用户类型" width="150" align='center' :formatter='formatType'></el-table-column>
		<el-table-column prop="stat" label="状态" width="70" align='center' :formatter='formatStat'></el-table-column>
		<el-table-column prop="ct" label="创建时间" width="168" align='center' :formatter='formatCreateTime'></el-table-column>
	</el-table>

	<!-- 分页条 -->
	<el-col :span='24' class='toolbar'>
		<el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='page_size' :total='totalCount' style='float: right'></el-pagination>
	</el-col>
</div>
</template>

<script>
import util from '../../common/js/util'
import {
	getPromoterRangeUser,
} from "../../api/api";
export default {
	data() {
		return {
			// 表单
			allData: [],
			initLoading: false,
			// 分页
			totalCount: 1,
			page_index: 1,
			page_size: 20,
			/**
			 * @description 表单 新增
			 * @description form 表单数据
			 * @description formRules 表单规则
			 * @description formVisible 是否显示表单
			 * @description formLoading 表单提交按钮的loading状态
			 */
			formVisible: false,
			formLoading: false,
		};
	},
	methods: {
		/***
		 * @function 分页
		 */
		handleCurrentChange(val) {
			this.page_index = val;
			this.init();
		},

		/**
		 * @function 加载数据
		 */
		init() {
			let params = {
				id: this.$route.query.promoterRangeId,
			};
			this.initLoading = true;
			getPromoterRangeUser(params)
				.then(res => {
					if (res.data.success) {
						this.initLoading = false;
						this.allData = res.data.data.items;
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
					this._catch(error);
				});
		},
		// 显示列表(stat 数字转换状态)
		formatStat(row, column) {
			switch (row.stat) {
				case -1:
					return '不限';
					break;
				case 0:
					return '有效';
					break;
				case 1:
					return '禁言';
					break;
				case 2:
					return '冻结';
					break;
			}
		},
		// 显示列表(gender 性别转换男女)
		formatGender(row, column) {
			return row.gender == 1 ? '男' : row.gender == 2 ? '女' : '未知';
		},
		// 显示列表(createTime 转换)
		formatCreateTime(row, column) {
			return util.formatDate.format(new Date(row.ct), 'yyyy/MM/dd   hh:mm:ss');
		},
		// 显示列表(type)
		formatInternal(row, column) {
			return row.internal == 0 ? '非内部' : row.internal == 1 ? '内部' : '未知';
		},
		formatType(row, column) {
			switch (row.type) {
				case 0:
					return '普通用户';
					break;
				case 1:
					return '推广人';
					break;
				case 2:
					return '推广人组长';
					break;
				case 3:
					return '班长';
					break;
				case 4:
					return '学习委员';
					break;
			}
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
		this.init();
	}
};
</script>

<style scoped>
</style>
