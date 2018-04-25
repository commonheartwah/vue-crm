<template lang="html">
	<section>
		<Toolbar :placeHolder="['请输入ID','请输入名称']" :addItemTitle='addItemTitle' v-on:emitHandleSeek='onHandleSeek' v-on:emitHandleAdd='emitHandleAdd'></Toolbar>
		<FormList :formData='formdata' :formTitle='formTitle' :editItemForm='editItemTitle' style="width:100%;" v-on:submitEdit='submitEdit'  v-loading="loading" element-loading-text="努力加载中"></FormList>
		<el-col :span='24' class='toolbar'>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='20' :total='total' style='float: right'></el-pagination>
        </el-col>
	</section>
</template>

<script>
import FormList from '../../components/formList'
import Toolbar from '../../components/toolbar'

import {
	addNewChannel,
	updateChannel,
	getChannelList
} from '../../api/api';

export default {
	components: {
		FormList,
		Toolbar
	},
	data() {
		return {
			// 添加表单里 是否显示判断表
			addItemTitle: {
				formHeader:{
					label: '新增渠道'
				},
				name: {
					label: '名称',
					width: ''
				},
				customType: {
					label: '类型',
					width: '',
					customOption: [ // 课程能选择的类型
						{
							value: '0',
							label: '线上'
						},
						{
							value: '1',
							label: '线下'
						}
					],
				},
				description: {
					label: '描述',
					width: ''
				},
				input: {
					id: {
						label: 'id'
					},
					name: {
						label: 'name'
					}
				},
				button: {
					seek: {
						label: '查询'
					},
					add: {
						label: '新增'
					}
				}
			},
			// formList 需要的相关 数据
			formdata: [], // formList 需要加载的数据
			total: 0, // 页码
			formTitle: { // formList 需要显示的数据
				id: {
					label: 'ID',
					width: '73'
				},
				name: {
					label: '名称',
					width: '200'
				},
				description: {
					label: '描述',
					width: ''
				},
				customExpand: {
					name: {
						label: '渠道名称'
					},
					id: {
						label: '渠道 ID'
					},
					// ct: {
					// 	label: '创建时间'
					// },
					ut: {
						label: '更新时间'
					},
					type: {
						label: '渠道类型',
					},
					description: {
						label: '渠道描述'
					},
				},
				type: {
					label: '类型',
					width: '75'
				},
				ct: {
					label: '创建时间',
					width: '168'
				},
				ut: {
					label: '更新时间',
					width: '168'
				},
				button: {
					edit: {
						label: '编辑'
					},
					width: '75'
				}
			},
			editItemTitle: {
				formHeader:{
					label: '编辑渠道信息'
				},
				name: {
					label: '名称',
					width: ''
				},
				description: {
					label: '描述',
					width: ''
				},
			},

			// 加载动画
			loading: true,
		}
	},
	methods: {
		// 加载 Channel 列表
		initChannelsList(obj) {
			let parameter = {
				name: obj.name,
				id: obj.id,
				page_index: obj.page_index,
				fuzzy: 1
			};
			getChannelList(parameter)
				.then((res) => {
					if (res.data.success) {
						this.formdata = [];
						if (res.data.data.items) {
							this.formdata = res.data.data.items
						};
						this.total = res.data.data.totalCount;
					} else {
						this.$notify.error(res.data.msg);
					};
					this.loading = false;
				})
				.catch((error) => {
					if (error.response) {
						this.$notify({
							title: error.response.status,
							message: '网络请求错误',
							type: 'error'
						})
					}else if(error.request){
						this.$notify({
							title: error.request,
							message: '网络请求错误',
							type: 'error'
						})
					}else{
						this.$notify({
							title: '错误',
							message: error.message,
							type: 'error'
						})
					}
					this.loading = false;
				});
		},
		// 分页
		handleCurrentChange(val) {
			this.loading = true;
			let parameter = {
				page_index: val,
			};
			this.initChannelsList(parameter);
		},
		// 查询 按钮的监听
		// 传入 写入的 ID 或者 name 。并调用 加载 Channel 列表接口方法
		onHandleSeek(obj) {
			this.initChannelsList(obj);
		},
		// 新增页面 确定 的监听
		emitHandleAdd(obj) {
			let parameter = {
				name: obj.name,
				type: obj.customType[0],
				description: obj.description,
			};
			addNewChannel(parameter).then((res) => {
				if (res.data.success) {
					this.initChannelsList('');
					this.$notify({
						title: '成功',
						message: '添加成功',
						type: 'success',
						offset: 45
					});
				} else {
					this.$notify({
						title: '失败',
						message: res.data.msg,
						type: 'error',
						offset: 45
					});
				};
			});
		},
		// 提交 改变
		submitEdit(obj, itemFlag) {
			// 1 是编辑。
			if (itemFlag === 1) {
				this.editChannel(obj); // 编辑 Spu 的方法
			};
		},
		// 编辑 接口调用
		editChannel(obj) {
			let parameter = {
				id: obj.id,
				name: obj.name,
				description: obj.description,
				type: obj.type
			};
			updateChannel(parameter).then((res) => {
				if (res.data.success) {
					this.initChannelsList('');
					this.$notify({
						title: '成功',
						message: '编辑成功',
						type: 'success',
						offset: 45
					});
				} else {
					this.$notify({
						title: '失败',
						message: res.data.msg,
						type: 'error',
						offset: 45
					});
				};
			});
		}
	},
	created() {
		this.initChannelsList('');
	}
}
</script>

<style lang="css">
</style>
