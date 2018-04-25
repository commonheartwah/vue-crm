<template lang="html">
	<section>
		<!-- 过滤查询 -->
		<el-row>
			<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
				<el-form :inline='true' :model='filters'>
					<el-form-item>
						<el-select v-model="filters.pro_id" style="width: 250px;" clearable placeholder="请输入推广人分站号或ID查询" filterable remote :remote-method="selPromoterRemoteMethod" @change='init' :loading='selPromoterLoading'>
							<el-option v-for="item in selPromoterOptions" :key="item" :label="item.name + '----' + item.mobile" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-input v-model='filters.wx_id' placeholder='微信号' icon="circle-cross" :on-icon-click="handleIconClick_clearWxid" @keydown.native.prevent.enter='init' @change='init'></el-input>
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

		<!-- 列表 -->
		<el-table border :data="allData" highlight-current-row v-loading="initLoading" @selection-change="handleSelectionChange" style="width: 100%;">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="entity.id" label="ID" width="80" align='center'></el-table-column>
			<el-table-column prop="entity.name" label="用户名" align='center'></el-table-column>
			<el-table-column prop="entity.wxId" label="微信号" align='center' width="220"></el-table-column>
			<el-table-column prop="entity.mobile" label="手机号" align='center' width="125"></el-table-column>
			<el-table-column prop="entity.stationNumber" label="分站号" width="100" align='center'></el-table-column>
			<el-table-column prop="entity.stat" label="状态" align='center' width="100" :formatter="formatStat"></el-table-column>
			<el-table-column label="操作" align="center" width="130">
				<template scope="scope">
		            <el-button-group>
						<el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
		                <el-button type="warning" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
		            </el-button-group>
		        </template>
			</el-table-column>
		</el-table>
		<!-- 分页条 -->
		<el-col :span='24' class='toolbar'>
			<el-button type='success' @click='handledelSaleRange' :disabled="this.selsArr.length===0">批量删除</el-button>
			<el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='page_size' :total='totalCount' style='float: right'></el-pagination>
		</el-col>

		<!-- 新增 更新 -->
		<el-dialog title='' v-model='formVisible' :close-on-click-modal='false' size="small">
			<el-form :model='form' label-width='120px' ref="form" label-position="right">
				<el-form-item label='ID' v-show="form.id">
					<el-input v-model='form.id' style="width: 100px;" disabled="disabled"></el-input>
				</el-form-item>

				<el-form-item label='推广人' v-if="!form.id">
					<el-select v-model="form.pro_id" style="width: 450px;" placeholder="请输入推广人分站号或ID查询" filterable clearable remote :remote-method="selPromoterRemoteMethod" :loading='selPromoterLoading'>
						<el-option v-for="item in selPromoterOptions" :key="item" :label="'（' + item.id + '）' + item.name + '----' + item.mobile" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>

				<el-form-item label='手机号'>
					<el-input v-model='form.mobile' style="width: 450px;" :disabled="form.id > 0"></el-input>
				</el-form-item>

				<el-form-item label='微信号'>
					<el-input v-model='form.wx_id' style="width: 450px;"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="formVisible = false">取消</el-button>
				<el-button type="primary" @click.native="handleSubmit" :loading="formLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
import util from '../../common/js/util'
import {
	getPromoterList,
	getPromoterWx,
	updatePromoterWx,
	addPromoterWx,
	delPromoterWx,
} from "../../api/api";
export default {
	data() {
		return {
			filters: {
				pro_id: '',
				wx_id: ''
			},
			selPromoterLoading: false,
			selPromoterOptions: [],
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
				pro_id: this.filters.pro_id,
				wx_id: this.filters.wx_id
			};
			this.initLoading = true;
			getPromoterWx(params)
				.then(res => {
					this.initLoading = false;
					if (res.data.success) {
						this.allData = res.data.data.items;
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
		 * @function handleIconClick_clearWxid 清除ID
		 */
		handleIconClick_clearWxid() {
			this.filters.wx_id = "";
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
		/****
		 * @description 调取推广人列表
		 * @augments query
		 */
		selPromoterRemoteMethod(query) {
			if (query !== "") {
				this.selPromoterLoading = true;
				let temp = Number(query);
				let parameter = {};
				if (temp) {
					if (temp.toString().length === 11 && /^1[3456789]\d{9}$/.test(temp)) {
						parameter["phone"] = temp
					} else {
						parameter["station_number"] = temp
					}
				}
				getPromoterList(parameter).then(res => {
						if (res.data.success && res.data.data.items) {
							this.selPromoterOptions = res.data.data.items.map(item => {
								let tempObj = {
									id: item.userWithInfo.user.id,
									name: item.userWithInfo.user.name,
									mobile: item.userWithInfo.user.mobile
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
		handleSelectionChange(val) {
			this.selsArr = val;
		},
		/**
		 * [handleAdd 点击新增]
		 * @return {[type]}       [description]
		 */
		handleAdd() {
			this.form = {
				pro_id: "",
				wx_id: '',
				mobile: ''
			};
			this.formVisible = true;
		},
		/**
		 * [handleEdit 点击编辑]
		 * @param  {[type]} index [点击的item的位置]
		 * @param  {[type]} row   [点击的item的数据]
		 */
		handleEdit(index, row) {
			this.form = {
				id: row.entity.id,
				wx_id: row.entity.wxId,
				mobile: row.entity.mobile
			};
			this.formVisible = true;
		},
		/**
		 * [handleDel 点击删除]
		 * @param  {[type]} index [点击的item的位置]
		 * @param  {[type]} row   [点击的item的数据]
		 */
		handleDel(index, row) {
			this.$confirm("确认删除吗?", "提示", {}).then(() => {
				let para = {
					ids: row.entity.id
				}
				delPromoterWx(para).then(res => {
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
		 * [handleSubmit 提交修改或者新增]
		 * @param  {[type]} wxreg [微信号验证正则]
		 * @param  {[type]} para [接口上行数据]
		 * @param  {[type]} submitFunc [提交调用的函数]
		 * @return {[type]} [description]
		 */
		handleSubmit() {
			var wxreg = /^[a-zA-Z]{1}[-_a-zA-Z0-9]{5,19}$/
			let para = {
					wx_id: this.form.wx_id,
				},
				submitFunc;
			if (this.form.id > 0) {
				para['id'] = this.form.id
				submitFunc = updatePromoterWx
			} else {
				if (!this.form.pro_id) {
					this.$notify({
						title: "警告",
						type: "warning",
						message: "请选择推广人"
					});
					return
				}
				para['pro_id'] = this.form.pro_id;
				para['mobile'] = this.form.mobile;
				submitFunc = addPromoterWx
			}
			if(!wxreg.test(this.form.wx_id)){
				this.$notify({
					title: "警告",
					type: "warning",
					message: "请填写正确的微信号"
				});
				return ;
			}
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$confirm("确认提交吗?", "提示", {}).then(() => {
						submitFunc(para).then(res => {
								if (res.data.success) {
									this.$notify({
										title: "成功",
										type: "success",
										message: "操作成功"
									});
									this.formVisible = false;
									this.initLoading = true;
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
					});
				}
			});
		},
		/**
		 * [handleSubmit 批量删除]
		 * @param  {[type]} wxreg [微信号验证正则]
		 * @param  {[type]} para [接口上行数据]
		 * @param  {[type]} submitFunc [提交调用的函数]
		 * @return {[type]} [description]
		 */
		handledelSaleRange() {
			let para = {
				ids: ''
			}
			for (var i = 0; i < this.selsArr.length; i++) {
				let item = this.selsArr[i]
				para.ids += item.entity.id + ','
			}
			this.$confirm("确认删除吗?", "提示", {}).then(() => {
				delPromoterWx(para).then(res => {
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
