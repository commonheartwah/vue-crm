<template lang="html">
	<section>
		<el-row>
            <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
                <el-form :inline='true' :model='filters'>
					<el-form-item>
						<el-input v-model='filters.title' placeholder='标题' icon="circle-cross" :on-icon-click="handleIconClick_clearTitle" @keydown.native.prevent.enter='init' @change='init'></el-input>
					</el-form-item>
                    <el-form-item>
                        <el-button type='primary' @click='init'>查询</el-button>
                    </el-form-item>
                    <el-form-item>
    					<el-button type='primary' @click='handleAdd'>新增</el-button>
    				</el-form-item>
                </el-form>
            </el-col>
        </el-row>

		<el-table :data="allData" border style="width: 100%" v-loading="initLoading">
			<el-table-column prop="entity.id" label="ID" sortable width="100" align="center"></el-table-column>
	        <el-table-column prop="entity.title" label="标题" align="center"></el-table-column>
	        <el-table-column prop="entity.showTime" label="展示时间" width="150" align="center" :formatter="formatTime"></el-table-column>
	        <el-table-column prop="parsed.author" label="作者" width="150" align="center"></el-table-column>
	        <el-table-column prop="entity.del" label="状态" width="90" align="center" :formatter="formatDel"></el-table-column>
			<el-table-column label="操作" width="150" align="center">
	            <template scope="scope">
	                <el-button-group>
						<el-button type="success" size="small" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
	                    <el-button type="danger" size="small" @click="handleDel(scope.row, scope.$index)">删除</el-button>
	                </el-button-group>
	            </template>
	        </el-table-column>
	    </el-table>

		<!-- 分页条 -->
		<el-col :span='24' class='toolbar'>
			<el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='page_size' :total='totalCount' style='float: right'></el-pagination>
		</el-col>
	</section>
</template>

<script>
import {
	getPromoterWikiList,
	updatePromoterWiki,
	addPromoterWiki,
	delPromoterWiki
} from "../../../api/api";
import util from '../../../common/js/util'

export default {
	props: ['type'],
	data() {
		return {
			filters: {
				title: ''
			},
			// 表单
			allData: [],
			initLoading: false,
			// 分页
			totalCount: 1,
			page_index: 1,
			page_size: 20,

			formVisible: false,
			formLoading: false,
			form: {},
			selsArr: []
		};
	},
	methods: {
		/**
		 * [init 加载数据]
		 * @return {[type]} [description]
		 */
		init() {
			let params = {
				page_index: this.page_index,
				page_size: this.page_size,
				title: this.filters.title,
				type: this.type
			};
			this.initLoading = true;
			getPromoterWikiList(params)
				.then(res => {
					this.initLoading = false;
					if (res.data.success) {
						if (res.data.data.items) {
							this.allData = res.data.data.items;
						} else {
							this.allData = [];
						}
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
					this._catch(error);
					this.initLoading = false;
				});
		},
		/***
		 * @function handleIconClick_clearTitle 清除ID
		 */
		handleIconClick_clearTitle() {
			this.filters.title = "";
			this.init();
		},
		/**
		 * [handleCurrentChange 分页改变]
		 * @param  {[type]} val [页数]
		 * @return {[type]}     [description]
		 */
		handleCurrentChange(val) {
			this.page_index = val;
			this.init();
		},
		/**
		 * [formatStat 格式化状态]
		 * @return {[string]}        [格式化后的状态]
		 */
		formatStat(row, column) {
			let property = column.property.split('.');
			let stat = row[property[0]][property[1]];
			switch (stat) {
				case 1:
					return '有效'
					break;
				case 0:
					return '无效'
					break;
				default:
					return '未知'
			}
		},
		/**
		 * [handleAdd 点击新增]
		 * @return {[type]}       [description]
		 */
		handleAdd() {
			sessionStorage.setItem('activeName', this.type);
			this.$router.push({
				path: '/pro_wiki_page',
				query: {
					type: this.type
				}
			})
		},
		/**
		 * [handleEdit 点击编辑]
		 * @param  {[type]} index [点击的item的位置]
		 * @param  {[type]} row   [点击的item的数据]
		 */
		handleEdit(row, index) {
			sessionStorage.setItem('activeName', this.type);
			this.$router.push({
				path: '/pro_wiki_page',
				query: {
					id: row.entity.id
				}
			})
		},
		/**
		 * [handleDel 点击删除]
		 * @param  {[type]} index [点击的item的位置]
		 * @param  {[type]} row   [点击的item的数据]
		 */
		handleDel(row, index) {
			this.$confirm("确认删除吗?", "提示", {}).then(() => {
				let para = {
					ids: row.entity.id
				}
				delPromoterWiki(para).then(res => {
						if (res.data.success) {
							this.$notify({
								title: "成功",
								type: "success",
								message: "操作成功"
							});
							this.init();
						} else {
							this.$notify({
								title: "错误",
								type: "error",
								message: res.data.msg
							});
						}
					})
					.catch(error => {
						this._catch(error);
					});
			})
		},
		/**
		 * [formatTime 格式化时间]
		 * @param  {[type]} date [时间戳]
		 * @return {[type]}      [yyyy/MM/dd]
		 */
		formatTime(row) {
			let date = row.entity.showTime;
			if (date === undefined) {
				return
			}
			if (date === 0) {
				return '/'
			}
			return util.formatDate.format(new Date(date), 'yyyy/MM/dd');
		},
		formatDel(row) {
			let del = row.entity.del;
			switch (del) {
				case 0:
					return '有效';
					break;
				case 1:
					return '无效';
					break;
				default:

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
		},
	},
	mounted() {
		this.init();
	}
}
</script>

<style lang="css">
</style>
