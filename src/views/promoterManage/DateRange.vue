<template>
<div id="root">
	<!-- 过滤查询 -->
	<el-row>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
			<el-form :inline='true' :model='filters'>
				<el-form-item>
					<el-input v-model='filters.name' placeholder='名称' icon="circle-cross" :on-icon-click="handleIconClick_clearName" @keydown.native.prevent.enter='init' @change='init'></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.type" placeholder="请选择" @change="init">
						<el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
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
	<el-table border :data="allData" highlight-current-row v-loading="initLoading" style="width: 100%;">
		<el-table-column prop="entity.id" label="ID" width="80" align='center'></el-table-column>
		<el-table-column prop="entity.number" width="80" label="编号" align='center'></el-table-column>
		<el-table-column prop="entity.name" label="名字" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column prop="entity.startTime" label="开始时间" align='center' :formatter='formatTime'></el-table-column>
		<el-table-column prop="entity.endTime" label="结束日期" align='center' :formatter='formatTime'></el-table-column>
		<el-table-column prop="entity.type" label="类型" width="150" align='center' :formatter='formatType'></el-table-column>
		<el-table-column prop="parsed.saleRangeName" label="关联的销售期" width="150" align='center' :formatter='formatRange'></el-table-column>
		<el-table-column prop="entity.description" label="描述" min-width="200" align='center' show-overflow-tooltip></el-table-column>
		<el-table-column label="操作" align="center" width="150">
			<template scope="scope">
                <el-button-group>
                    <el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </el-button-group>
            </template>
		</el-table-column>
	</el-table>

	<!-- 新增 更新 -->
	<el-dialog title='' v-model='formVisible' :close-on-click-modal='false' size="small">
		<el-form :model='form' :rules='formRules' label-width='100px' ref="form" label-position="right">
			<el-form-item label='ID' v-show="form.id">
				<el-input v-model='form.id' style="width: 100px;" disabled="disabled"></el-input>
			</el-form-item>
			<el-form-item label='名称' prop="name">
				<el-input v-model='form.name'></el-input>
			</el-form-item>
			<el-form-item label='编号'>
				<el-input v-model='form.number'></el-input>
			</el-form-item>
			<el-form-item label='描述'>
				<el-input type="textarea" v-model='form.description'></el-input>
			</el-form-item>
			<el-form-item label='类型'>
				<el-select v-model="form.type" placeholder="请选择">
					<el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label='日期'>
				<el-date-picker v-model="dateRange" type="daterange" placeholder="选择日期范围">
				</el-date-picker>
			</el-form-item>

			<el-form-item v-if="form.type === 2" label='绑定销售期'>
				<el-select v-model="form.date_range_id" style="width: 260px;" placeholder="请输入销售期名称查询" filterable clearable remote :remote-method="selDateRangeRemoteMethod" :loading='selDateRangeLoading'>
					<el-option v-for="item in selDateRangeOptions" :key="item" :label="item.name + '【 ' + item.startTime + ' - ' + item.endTime + ' 】'" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label='见习推广人招生期个人目标' label-width='170px' v-if="form.id > 0 && form.type === 2">
				<el-input v-model='form.fish_pro_target' style="width: 170px;"></el-input>
			</el-form-item>
			<el-form-item label='新推广人招生期个人目标' label-width='170px' v-if="form.id > 0 && form.type === 2">
				<el-input v-model='form.new_pro_target' style="width: 170px;"></el-input>
			</el-form-item>
			<el-form-item label='老推广人招生期个人目标' label-width='170px' v-if="form.id > 0 && form.type === 2">
				<el-input v-model='form.old_pro_target' style="width: 170px;"></el-input>
			</el-form-item>
			<el-form-item label='见习推广人招生期总目标' label-width='170px' v-if="form.id > 0 && form.type === 2">
				<el-input v-model='form.all_fish_pro_target' style="width: 170px;"></el-input>
			</el-form-item>
			<el-form-item label='新推广人招生期总目标' label-width='170px' v-if="form.id > 0 && form.type === 2">
				<el-input v-model='form.all_new_pro_target' style="width: 170px;"></el-input>
			</el-form-item>
			<el-form-item label='老推广人招生期总目标' label-width='170px' v-if="form.id > 0 && form.type === 2">
				<el-input v-model='form.all_old_pro_target' style="width: 170px;"></el-input>
			</el-form-item>
			<el-form-item label='推广人招生期总目标' label-width='170px' v-if="form.id > 0 && form.type === 2">
				<el-input v-model='form.all_pro_target' style="width: 170px;"></el-input>
			</el-form-item>
			<el-form-item label='见习推广人转化率' label-width='170px' v-if="form.id > 0 && form.type === 2">
				<el-input v-model='form.fish_pro_con' style="width: 170px;">
					<template slot="append">%</template>
				</el-input>
			</el-form-item>
			<el-form-item label='新推广人转化率' label-width='170px' v-if="form.id > 0 && form.type === 2">
				<el-input v-model='form.new_pro_con' style="width: 170px;">
					<template slot="append">%</template>
				</el-input>
			</el-form-item>
			<el-form-item label='老推广人转化率' label-width='170px' v-if="form.id > 0 && form.type === 2">
				<el-input v-model='form.old_pro_con' style="width: 170px;">
					<template slot="append">%</template>
				</el-input>
			</el-form-item>
			<el-form-item label='见习推广人销售目标' label-width='170px' v-if="form.id > 0 && form.type === 3">
				<el-input v-model='form.fish_pro_order_target' style="width: 170px;"></el-input>
			</el-form-item>
			<el-form-item label='新推广人销售目标' label-width='170px' v-if="form.id > 0 && form.type === 3">
				<el-input v-model='form.new_pro_order_target' style="width: 170px;"></el-input>
			</el-form-item>
			<el-form-item label='老推广人销售目标' label-width='170px' v-if="form.id > 0 && form.type === 3">
				<el-input v-model='form.old_pro_order_target' style="width: 170px;"></el-input>
			</el-form-item>
			<el-form-item label='见习推广人销售期总目标' label-width='170px' v-if="form.id > 0 && form.type === 3">
				<el-input v-model='form.all_fish_pro_order_target' style="width: 170px;"></el-input>
			</el-form-item>
			<el-form-item label='新推广人销售期总目标' label-width='170px' v-if="form.id > 0 && form.type === 3">
				<el-input v-model='form.all_new_pro_order_target' style="width: 170px;"></el-input>
			</el-form-item>
			<el-form-item label='老推广人销售期总目标' label-width='170px' v-if="form.id > 0 && form.type === 3">
				<el-input v-model='form.all_old_pro_order_target' style="width: 170px;"></el-input>
			</el-form-item>
			<el-form-item label='推广人销售期总目标' label-width='170px' v-if="form.id > 0 && form.type === 3">
				<el-input v-model='form.all_pro_order_target' style="width: 170px;"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click.native="formVisible = false">取消</el-button>
			<el-button type="primary" @click.native="handleSubmit" :loading="formLoading">提交</el-button>
		</div>
	</el-dialog>

	<!-- 分页条 -->
	<el-col :span='24' class='toolbar'>
		<el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='page_size' :total='totalCount' style='float: right'></el-pagination>
	</el-col>
</div>
</template>

<script>
import util from '../../common/js/util'
import {
	addDateRange,
	updateDateRange,
	delDateRange,
	getDateRangeList
} from "../../api/api";
export default {
	data() {
		return {
			filters: {
				type: "",
				name: ""
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
			dateRange: '',
			formRules: {
				name: [{
					required: true,
					message: "名称为必填项",
					trigger: "blur"
				}]
			},
			selDateRangeLoading: false,
			selDateRangeOptions: [],
			typeOptions: [{
					label: '推广人批次',
					value: 1
				},
				{
					label: '推广人招生期',
					value: 2
				},
				{
					label: '推广人销售期',
					value: 3
				}
			]
		};
	},
	methods: {
		/***
		 * @function handleIconClick_clearName 清除名称
		 */
		handleIconClick_clearName() {
			this.filters.name = "";
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
				name: this.filters.name,
				type: this.filters.type,
			};
			this.initLoading = true;
			getDateRangeList(params)
				.then(res => {
					if (res.data.success) {
						this.initLoading = false;
						this.allData = res.data.data.items;
						this.totalCount = res.data.data.totalCount
					} else {
						this.$notify({
							title: "错误",
							message: res.data.msg,
							type: "error"
						});
					}
				})
				.catch((error) => {
					this._catch(error)
				})
		},
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
		/**
		 * @function handleAdd 新增
		 * @function handleEdit 编辑
		 * @function handleSubmit 提交
		 */
		handleAdd() {
			this.form = {
				name: "",
				number: "",
				description: "",
				type: 1,
			};
			this.dateRange = '';
			this.formVisible = true;
		},
		handleEdit(index, row) {
			this.form = {
				id: row.entity.id,
				name: row.entity.name,
				number: row.entity.number,
				description: row.entity.description,
				type: row.entity.type,
				fish_pro_target: row.parsed.fishPromoterTarget ? row.parsed.fishPromoterTarget : '',
				new_pro_target: row.parsed.newPromoterTarget ? row.parsed.newPromoterTarget : '',
				old_pro_target: row.parsed.oldPromoterTarget ? row.parsed.oldPromoterTarget : '',
				all_fish_pro_target: row.parsed.allFishPromoterTarget ? row.parsed.allFishPromoterTarget : 0,
				all_new_pro_target: row.parsed.allNewPromoterTarget ? row.parsed.allNewPromoterTarget : 0,
				all_old_pro_target: row.parsed.allOldPromoterTarget ? row.parsed.allOldPromoterTarget : 0,
				all_pro_target: row.parsed.allPromoterTarget ? row.parsed.allPromoterTarget : 0,
				fish_pro_con: row.parsed.fishPromoterTargetConRate ? row.parsed.fishPromoterTargetConRate : '',
				new_pro_con: row.parsed.newPromoterTargetConRate ? row.parsed.newPromoterTargetConRate : '',
				old_pro_con: row.parsed.oldPromoterTargetConRate ? row.parsed.oldPromoterTargetConRate : '',
				fish_pro_order_target: row.parsed.fishProSaleOrderTarget ? row.parsed.fishProSaleOrderTarget : '',
				new_pro_order_target: row.parsed.newProSaleOrderTarget ? row.parsed.newProSaleOrderTarget : '',
				old_pro_order_target: row.parsed.oldProSaleOrderTarget ? row.parsed.oldProSaleOrderTarget : '',
				all_fish_pro_order_target: row.parsed.allFishProSaleOrderTarget ? row.parsed.allFishProSaleOrderTarget : 0,
				all_new_pro_order_target: row.parsed.allNewProSaleOrderTarget ? row.parsed.allNewProSaleOrderTarget : 0,
				all_old_pro_order_target: row.parsed.allOldProSaleOrderTarget ? row.parsed.allOldProSaleOrderTarget : 0,
				all_pro_order_target: row.parsed.allProSaleOrderTarget ? row.parsed.allProSaleOrderTarget : 0,
			}
			if (row.entity.type === 2 && row.parsed.saleRangeName) {
				getDateRangeList({
						name: row.parsed.saleRangeName,
						type: 3
					})
					.then(res => {
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
							this.form['date_range_id'] = this.selDateRangeOptions[0].id
						} else {
							this.form['date_range_id'] = ''
						}
					})
					.catch(error => {
						this._catch(error);
					});
			} else {
				this.form['date_range_id'] = ''
			}
			this.dateRange = [new Date(row.entity.startTime), new Date(row.entity.endTime)]
			this.formVisible = true;
		},
		handleSubmit() {
			let submitFunc, para;
			para = Object.assign({}, this.form);
			submitFunc = this.form.id > 0 ? updateDateRange : addDateRange
			para['start_time'] = Date.parse(this.dateRange[0])
			para['end_time'] = Date.parse(this.dateRange[1])
			this.$refs.form.validate(valid => {
				if (valid) {
					this.$confirm("确认提交吗?", "提示", {}).then(() => {
						submitFunc(para)
							.then(res => {
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
							.catch((error) => {
								this._catch(error)
							})
					});
				}
			});
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
				case 1:
					return '推广人批次';
					break;
				case 2:
					return '推广人招生期';
					break;
				case 3:
					return '推广人销售期';
					break;
				default:

			}
		},
		formatRange(row, column) {
			let property = column.property.split('.')
			let name = row[property[0]][property[1]]
			if (row.entity.type === 2) {
				if (name) {
					return name
				} else {
					return '未绑定'
				}
			} else {
				return "/"
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

<style lang="less" scoped>
</style>
