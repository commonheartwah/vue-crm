<template lang="html">
	<section>
		<Toolbar :placeHolder="['请输入ID','请输入名称']" :addItemTitle='addItemTitle' v-on:emitHandleSeek='onHandleSeek' v-on:emitHandleAdd='emitHandleAdd'></Toolbar>
		<FormList :formData='formdata' :formTitle='formTitle' :editItemForm='editItemTitle' style="width:100%;" v-on:submitEdit='submitEdit' v-loading="loading" element-loading-text="努力加载中"></FormList>
		<el-col :span='24' class='toolbar'>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='20' :total='total' style='float: right'></el-pagination>
        </el-col>
	</section>
</template>

<script>
import FormList from '../../components/formList'
import Toolbar from '../../components/toolbar'
// 引入 验证校验规则
import verification from '../../common/js/verificatioMode'


import {
	addNewChannelCode,
	updateChannelCode,
	getChannelCodeList
} from '../../api/api';

export default {
	components: {
		FormList,
		Toolbar
	},
	data() {
		return {
			spuEssInfo: '', 	// spu 的基本详情
			// 添加表单里 是否显示判断表
			addItemTitle: {
				formHeader:{
					label: '新增渠道配置'
				},
				name: {
					label: '配置名称',
					width: ''
				},
				description: {
					label: '配置描述',
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
				Code: {
					label: 'Code'
				},
				channel: {
					label: '渠道选择'
				},
				ChannelCodeSkuConf: {
					label: '渠道配置'
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
				code: {
					label: 'Code',
					width: '180'
				},
				ut: {
					label: '创建时间',
					width: '168'
				},
				customExpand:{
					name: {
						label: '名字'
					},
					id: {
						label: 'ID'
					},
					ct: {
						label: '创建时间'
					},
					ut: {
						label: '更新时间'
					},
					description: {
						label: '描述'
					},
				},
				button: {
					edit: {
						label: '编辑'
					},
					width: '80'
				}
			},
			editItemTitle: {
				formHeader:{
					label: '编辑渠道配置'
				},
				name: {
					label: '配置名称',
					width: ''
				},
				description: {
					label: '配置描述',
					width: ''
				},
				Code: {
					label: 'Code'
				},
				channel: {
					label: '渠道选择'
				},
				ChannelCodeSkuConf: {
					label: '渠道配置'
				},
			},

			// 加载动画
			loading: false,
		}
	},
	methods: {
		// 加载 ChannelCode 列表
		initChannelCodesList(obj) {
			let parameter = {
				name: obj.name,
				id: obj.id,
				page_index: obj.page_index,
				fuzzy: 1
			};
			getChannelCodeList(parameter)
				.then((res) => {
					console.log(res);
					if (res.data.success) {
						this.formdata = [];
						if (res.data.data.items) {
							this.formdata = res.data.data.items.map((item) => {
								let tempObj = item.entity;
								tempObj['channelEntity'] = item.channelEntity;
								tempObj['conf'] = item.conf;
								return tempObj;
							});
						}
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
			this.initChannelCodesList(parameter)
		},
		// 查询 按钮的监听
		// 传入 写入的 ID 或者 name 。并调用 加载 ChannelCode 列表接口方法
		onHandleSeek(obj) {
			this.initChannelCodesList(obj);
		},
		// 新增页面 确定 的监听
		emitHandleAdd(obj) {
			if (verification.name.test(obj.name) && verification.name.test(obj.code)) {
				this.$message.error('用户名或Code码不能有空格');
				return;
			};
			let parameter = {
				name: obj.name,
				description: obj.description,
				channel_id: obj.channel_id,
				code: obj.code,
				conf: ''
			};
			let conf = {
				channelCodeSkuConfs: obj.channelCodeSkuConf,
			};
			let channelCodeSkuConfJSON = JSON.stringify(conf);
			parameter['conf'] = channelCodeSkuConfJSON;
			addNewChannelCode(parameter).then((res) => {
				if (res.data.success) {
					this.initChannelCodesList('');
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
				this.editChannelCode(obj); // 编辑 Spu 的方法
			};
		},
		// 编辑 接口调用
		editChannelCode(obj) {
			let parameter = {
				id: obj.id,
				name: obj.name,
				description: obj.description,
				channel_id: obj.channelId,
				code: obj.code,
				conf: ''
			};
			let conf = {
				channelCodeSkuConfs: obj.channelCodeSkuConf,
			};
			let channelCodeSkuConfJSON = JSON.stringify(conf);
			parameter['conf'] = channelCodeSkuConfJSON;
			updateChannelCode(parameter).then((res) => {
				if (res.data.success) {
					this.initChannelCodesList('');
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
		this.initChannelCodesList('');
	}
}
</script>

<style lang="css">

</style>
