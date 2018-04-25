<template lang="html">
  <section>
	  <Toolbar :placeHolder="['请输入页面ID','请输入页面名称']" :addItemTitle='addItemTitle' v-on:emitHandleSeek='onHandleSeek' v-on:emitHandleAdd='emitHandleAdd'></Toolbar>
	  <FormList :formData='formdata' :formTitle='formTitle' :editItemForm='editItemTitle' style="width:100%;" v-on:submitEdit='submitEdit' v-loading="loading" v-on:emitMerchandiseDetails='onMerchandiseDetails' element-loading-text="努力加载中"></FormList>
      <el-col :span='24' class='toolbar'>
          <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='20' :total='total' style='float: right'></el-pagination>
      </el-col>
  </section>
</template>

<script>
import FormList from '../../components/formList'
import Toolbar from '../../components/toolbar'

import {
	addNewPage,
	updatePage,
	getPageList
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
					label: '新增页面配置'
				},
				name: {
					label: '名称',
					width: '200'
				},
				title: {
					label: '标题',
					width: ''
				},
				subTitle: {
					label: '子标题',
					width: ''
				},
                input:{
                    name:{
                        label: 'name'
                    }
                },
				button:{
					seek:{
						label:'查询'
					},
					add:{
						label:'新增'
					}
				}
			},
			// formList 需要的相关 数据
			formdata: [],	// formList 需要加载的数据
			total: 0,		// 页码
			formTitle: {	// formList 需要显示的数据
				id: {
					label: 'ID',
					width: '73'
				},
				contentName: {
					label: '名称',
					width: ''
				},
				ct: {
					label: '创建时间',
					width: '168'
				},
				ut: {
					label: '更新时间',
					width: '168'
				},
				// expand:{
				// 	label: '面板'
				// },
				button:{
					edit:{
						label:'编辑'
					},
					merchandiseDetails:{
						label:'页面详情'
					},
					width: '150'
				}
			},
			editItemTitle: {
                formHeader:{
					label: '编辑页面配置信息'
				},
				title: {
					label: '标题',
					width: ''
				},
				subTitle: {
					label: '子标题',
					width: ''
				},
			},

			// 加载动画
			loading: true,
		};
	},
	methods: {
		// 加载 Page 列表
		initPagesList(obj){
			let parameter = {
				name: obj.name,
				id: obj.id,
                page_index: obj.page_index
			};
			getPageList(parameter)
                .then((res) => {
    				if (res.data.success) {
                        this.formdata = [];
    					if (res.data.data.items) {
    						res.data.data.items.forEach((item) => {
    							item.entity['content'] = item.content;
    							this.formdata.push(item.entity)
    						});
    					}
    					this.total = res.data.data.totalCount;
    				}
                    else{
    					this.$notify.error(res.data.msg);
    				}
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
			this.initPagesList(parameter);
		},
		// 监听查询按钮
		onHandleSeek(obj){
			let params = {
				name: obj.name
			};
			this.initPagesList(params);
		},
		// 新增页面 确定 的监听
		emitHandleAdd(obj) {
			let parameter = {
				name: obj.name,
				title: obj.title,
				subTitle: obj.subTitle
			};
			addNewPage(parameter).then((res) => {
				if (res.data.success) {
					this.initPagesList('');
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
		// 提交 Page 改变
		submitEdit(obj, itemFlag){
			// 1 是编辑
			if (itemFlag === 1) {
				this.editPage(obj); // 编辑教师 的方法
			};
		},
		// 编辑 Page页面 的接口调用
		editPage(obj){
			let parameter = {
				id: obj.id,
				title: obj.content.title,
				sub_title: obj.content.subTitle,
                ids: [],
			};
            if (obj.content.blocks) {
                obj.content.blocks.forEach((item) => {
                    parameter['ids'] += item + ','
                });
            };
			updatePage(parameter).then((res) => {
				if (res.data.success) {
					this.initPagesList('');
					this.$notify({
						title: '成功',
						message: '修改成功',
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
		// 监听 页面详情 按钮的方法
		onMerchandiseDetails(obj){
			this.$router.push('/ConfPageDetail/' + obj.id);
		}
	},
	created() {
		this.initPagesList('');
	}
}
</script>

<style lang="css">
</style>
