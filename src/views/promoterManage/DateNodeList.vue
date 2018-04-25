<template>
<div id="root">
	<!-- 过滤查询 -->
	<el-row>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
			<el-form :inline='true' :model='filters'>
				<el-form-item>
					<el-select v-model="filters.date_range_id" style="width: 300px;" placeholder="请输入日期段名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" :loading='selDateRangeLoading' @change='init'>
						<el-option v-for="item in selDateRangeOptions" :key="item" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item>
					<el-select v-model="filters.position" placeholder="请选择" @change='init'>
						<el-option value="" label="请选择"></el-option>
						<el-option v-for="item in positionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item> -->

				<el-form-item>
					<el-select v-model="filters.type" placeholder="请选择" @change='init'>
						<el-option value="" label="请选择"></el-option>
						<el-option :value="2" label="推广人招生期"></el-option>
						<el-option :value="3" label="推广人销售期"></el-option>
					</el-select>

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
		<el-table-column prop="entity.id" label="ID" width="70" align='center'></el-table-column>
		<el-table-column prop="entity.name" label="名称" width="150" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column prop="entity.dateRangeName" label="日期段名称" width="140" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column prop="entity.type" label="节点类型" width="150" align='center' :formatter='formatType'></el-table-column>
		<el-table-column prop="entity.dateNode" label="节点日期" width="120" align='center' :formatter='formatTime'></el-table-column>


		<el-table-column prop="entity.fishTarget" label="见习推广人目标值" width="110" align='center'></el-table-column>
		<el-table-column prop="entity.fishSuccMsg" label="见习推广人目标达成提示语" width="210" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column prop="entity.fishFailMsg" label="见习推广人目标未达成提示语" width="200" align='center' show-overflow-tooltip></el-table-column>

		<el-table-column prop="entity.newTarget" label="新推广人目标值" width="110" align='center'></el-table-column>
		<el-table-column prop="entity.newSuccMsg" label="新推广人目标达成提示语" width="200" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column prop="entity.newFailMsg" label="新推广人目标未达成提示语" width="220" align='center' show-overflow-tooltip></el-table-column>

		<el-table-column prop="entity.oldTarget" label="老推广人目标值" width="110" align='center'></el-table-column>
		<el-table-column prop="entity.oldSuccMsg" label="老推广人目标达成提示语" width="200" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column prop="entity.oldFailMsg" label="老推广人目标未达成提示语" width="220" align='center' show-overflow-tooltip></el-table-column>


		<el-table-column prop="entity.description" min-width="200" label="描述" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column label="操作" align="center" fixed="right" width="160">
			<template scope="scope">
	            <el-button-group>
				    <el-button type="info" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
	                <el-button type="success" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
	            </el-button-group>
	        </template>
		</el-table-column>
	</el-table>

	<!-- 新增 更新 -->
	<el-dialog title='' v-model='formVisible' :close-on-click-modal='false' size="small">
		<el-form :model='form' :rules='formRules' label-width='120px' ref="form" label-position="right">

			<el-form-item label='ID' v-show="form.id">
				<el-input v-model='form.id' style="width: 100px;" disabled="disabled"></el-input>
			</el-form-item>

			<el-form-item label='名称' prop="name">
				<el-input v-model='form.name'></el-input>
			</el-form-item>

			<el-form-item label='编号'>
				<el-input v-model='form.number'></el-input>
			</el-form-item>

			<el-form-item label="类型">
				<el-radio v-model="form.type" :label="2">推广人招生期</el-radio>
				<el-radio v-model="form.type" :label="3">推广人销售期</el-radio>
			</el-form-item>

			<el-form-item label='日期段'>
				<el-select v-model="selDateRange" style="width: 100%;" placeholder="请输入日期段名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" :loading='selDateRangeLoading'>
					<el-option v-for="item in selDateRangeOptions" :key="item" :label="'（' + item.id + '）' + item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="日期节点" prop="date_node">
				<el-date-picker v-model="form.date_node"  type="date" placeholder="选择日期"></el-date-picker>
			</el-form-item>

			<el-form-item label='目标值' prop="fish_target">
				<el-input v-model.number='form.fish_target' style="margin-bottom:10px;"><template slot="prepend">见习推广人</template></el-input>
				<el-input v-model.number='form.new_target' style="margin-bottom:10px;"><template slot="prepend">新推广人</template></el-input>
				<el-input v-model.number='form.old_target'><template slot="prepend">老推广人</template></el-input>
			</el-form-item>

			<el-form-item label='未达成提示信息' prop="fish_fail_msg">
				<el-input v-model='form.fish_fail_msg' style="margin-bottom:10px;"><template slot="prepend">见习推广人</template></el-input>
				<el-input v-model='form.new_fail_msg' style="margin-bottom:10px;"><template slot="prepend">新推广人</template></el-input>
				<el-input v-model='form.old_fail_msg'><template slot="prepend">老推广人</template></el-input>
			</el-form-item>

			<el-form-item label='达成提示信息' prop="fish_succ_msg">
				<el-input v-model='form.fish_succ_msg' style="margin-bottom:10px;"><template slot="prepend">见习推广人</template></el-input>
				<el-input v-model='form.new_succ_msg' style="margin-bottom:10px;"><template slot="prepend">新推广人</template></el-input>
				<el-input v-model='form.old_succ_msg'><template slot="prepend">老推广人</template></el-input>
			</el-form-item>




			<el-form-item label='描述'>
				<el-input type="textarea" v-model='form.description' style="width: 450px;"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="formVisible = false">取消</el-button>
			<el-button type="primary" @click.native="handleSubmit" :loading="formLoading">提交</el-button>
		</div>
	</el-dialog>

	<!-- 分页条 -->
	<el-col :span='24' class='toolbar'>
		<el-button type='success' @click='handleDelPromoterRange' :disabled="this.selsArr.length===0">批量删除</el-button>
		<el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='page_size' :total='totalCount' style='float: right'></el-pagination>
	</el-col>
</div>
</template>

<script>
import util from '../../common/js/util'
import {
	addDateNode,
	delDateNode,
	updateDateNode,
	getDateNodeList,
	getDateRangeList,
} from "../../api/api";
export default {
	data() {
		return {
			filters: {
				date_range_id: "",
				position: "",
				type: ""
			},
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
			form: {},
			formRules: {
				name: [{
					required: true,
					message: "请输入名称",
					trigger: "blur"
				}],
				date_node: [{
					required: true,
					message: "请选择日期节点",
					trigger: "blur",
					type: 'object'
				}],

			},
			selsArr: [],

			positionOptions: [{
					value: 0,
					label: '见习推广人'
				},
				{
					value: 1,
					label: '新推广人'
				}, {
					value: 2,
					label: '老推广人'
				}
			],


			// 远程选择

			selDateRange: "",
			selDateRangeLoading: false,
			selDateRangeOptions: []
		};
	},
	methods: {
		/***
		 * @function handleIconClick_clearID 清除ID
		 * @function handleIconClick_clearPromoterId 清除名称
		 */
		handleIconClick_clearID() {
			this.filters.date_range_id = "";
		},
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
				page_index: this.page_index,
				page_size: this.page_size,
				date_range_id: this.filters.date_range_id,
				type: this.filters.type,
				// position: this.filters.position
			};
			this.initLoading = true;
			getDateNodeList(params)
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
				})
				.catch(error => {
					this._catch(error);
				});
		},

		/**
		 * @function handleAdd 新增
		 * @function handleEdit 编辑
		 * @function handleDel 删除
		 * @function handleSubmit 提交
		 */
		handleAdd() {
			this.form = {
				date_node: '',
				type: 2,
				fish_target: '',
				new_target: '',
				old_target: '',
				fish_fail_msg: '',
				new_fail_msg: '',
				old_fail_msg: '',
				fish_succ_msg: '',
				new_succ_msg: '',
				old_succ_msg: '',
				name: '',
				number: '',
				description: '',
			};
			this.selDateRange = "";
			this.formVisible = true;
		},
		handleEdit(index, row) {
			let myObj = {
				id: row.entity.id,
				name: row.entity.name,
				number: row.entity.number,
				type: row.entity.type,
				date_node: new Date(row.entity.dateNode),
				description: row.entity.description,
				fish_target: row.entity.fishTarget,
				new_target: row.entity.newTarget,
				old_target: row.entity.oldTarget,
				fish_fail_msg: row.entity.fishFailMsg,
				new_fail_msg: row.entity.newFailMsg,
				old_fail_msg: row.entity.oldFailMsg,
				fish_succ_msg: row.entity.fishSuccMsg,
				new_succ_msg: row.entity.newSuccMsg,
				old_succ_msg: row.entity.oldSuccMsg,
			};
			this.$set(this.$data, 'form', myObj)
			this.selDateRange = row.entity.dateRangeId;
			this.selDateRangeRemoteMethod(row.entity.dateRangeName)
			this.formVisible = true;
		},
		handleDel(index, row) {
			this.$confirm("确认删除吗?", "提示", {}).then(() => {
				let para = {
					ids: row.entity.id
				}
				delDateNode(para).then(res => {
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
		handleSelectionChange(val) {
			this.selsArr = val;
		},
		handleDelPromoterRange() {
			let para = {
				ids: ''
			}
			for (var i = 0; i < this.selsArr.length; i++) {
				let item = this.selsArr[i]
				para.ids += item.entity.id + ','
			}
			this.$confirm("确认删除吗?", "提示", {}).then(() => {
				delPromoterRange(para).then(res => {
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
				});
			})
		},
		handleSubmit() {
			if (!this.selDateRange) {
				this.$notify({
					title: "警告",
					type: "warning",
					message: "请选择时间段"
				});
				return
			}
			let para = {
				date_node: Date.parse(this.form.date_node),
				date_range_id: this.selDateRange,
				name: this.form.name,
				number: this.form.number,
				type: this.form.type,
				fish_target: this.form.fish_target,
				new_target: this.form.new_target,
				old_target: this.form.old_target,
				fish_fail_msg: this.form.fish_fail_msg,
				new_fail_msg: this.form.new_fail_msg,
				old_fail_msg: this.form.old_fail_msg,
				fish_succ_msg: this.form.fish_succ_msg,
				new_succ_msg: this.form.new_succ_msg,
				old_succ_msg: this.form.old_succ_msg,
				description: this.form.description
			}, submitFunc;
			if (this.form.id > 0) {
				para['id'] = this.form.id
				submitFunc = updateDateNode;
			} else {
				submitFunc = addDateNode;
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
								this.selDateRange = '';
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

		/****
		 * @description 从素材库上传
		 * @augments query
		 */
		selDateRangeRemoteMethod(query) {
			if (query !== "") {
				this.selDateRangeLoading = true;
				let parameter = {
					name: query,
					type: this.form.type
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
		formatTime(row, column) {
            let property = column.property.split('.')
            let time = row[property[0]][property[1]]
			if (time === 0) {
				return '/'
			}
			return util.formatDate.format(new Date(time), 'yyyy/MM/dd');
		},
        formatType(row, column) {
            let property = column.property.split('.')
            let type = row[property[0]][property[1]]
			switch (type) {
                case 2:
			        return '推广人招生期';
			        break;
                case 3:
			        return '推广人销售期';
			        break;
			    default:

			}
		},
		formatPosition(row, column) {
            let property = column.property.split('.')
            let type = row[property[0]][property[1]]
			switch (type) {
				case 0:
			        return '见习推广人';
			        break;
                case 1:
			        return '新推广人';
			        break;
                case 2:
			        return '老推广人';
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
		}
	},
	filters: {
		formatTime(time) {
			if (time === 0) {
				return '？'
			}
			return util.formatDate.format(new Date(time), 'yyyy/MM/dd');
		},
	},
	mounted() {
		this.init();
	}
};
</script>

<style scoped>
</style>
