<template lang="html">
	<section>
		<el-tabs @tab-click="handleClick" v-model="activeName" v-loading="loading" element-loading-text="努力加载中">
			<el-tab-pane name='virtual'>
				<span slot="label"><i class="fa fa-feed"></i> 虚拟商品</span>
				<Toolbar :placeHolder="['请输入Spu ID','请输入Spu 名称']" :addItemTitle='addItemTitle' v-on:emitHandleSeek='onHandleSeek' v-on:emitHandleAdd='emitHandleAdd'></Toolbar>
				<FormList :formData='formdata' :formTitle='formTitle' :editItemForm='editItemTitle' style="width:100%;" v-on:submitEdit='submitEdit' v-on:emitMerchandiseDetails='onMerchandiseDetails'></FormList>
				<el-col :span='24' class='toolbar'>
		            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='20' :total='total' style='float: right' ></el-pagination>
		        </el-col>
			</el-tab-pane>
			<el-tab-pane name='reality' v-model="activeName" v-loading="loading">
				<span slot="label"><i class="fa fa-credit-card-alt"></i> 真实商品</span>
				<Toolbar :placeHolder="['请输入Spu ID','请输入Spu 名称']" :addItemTitle='addItemTitle' v-on:emitHandleSeek='onHandleSeek' v-on:emitHandleAdd='emitHandleAdd'></Toolbar>
				<FormList :formData='formdata' :formTitle='formTitle' :editItemForm='editItemTitle' style="width:100%;" v-on:submitEdit='submitEdit' v-on:emitMerchandiseDetails='onMerchandiseDetails' v-on:emitBindingCourse='onBindingCourse'></FormList>
				<el-col :span='24' class='toolbar'>
		            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='20' :total='total' style='float: right'></el-pagination>
		        </el-col>
			</el-tab-pane>
		</el-tabs>
		<!-- 新增界面 -->
        <el-dialog title='绑定课程' v-model='bindingCourseDialog' :close-on-click-modal='false'>
			<el-form label-width="100px">
				<!-- 我是搜索框框 -->
				<el-form-item label="搜索商品">
					<el-select v-model="searchCourse" placeholder="请输入课程关键词或ID" style="width:300px;" filterable clearable remote :remote-method="searchCourseFunc" :loading='selectCourseLoading'>
						<el-option
						  v-for="item in CourseOptions"
						  :key="item"
						  :label="'（' + item.id + '）' + item.name"
						  :value="item">
						</el-option>
					</el-select>
					<el-button type="primary" icon="plus" @click='addCourseToCard'></el-button>
	  		    </el-form-item>
				<el-form-item label="展示配置">
					<div v-if='addGoods.length'>
						<section v-for='(item, index) in addGoods' :key='index' style="display:flex;justify-content:space-between;align-items:center;">
                            <span>
								{{ item.id }} : {{ item.name }}
							</span>
							<i class="el-icon-close" @click="deleteItemInGoods(index)"></i>
						</section>
					</div>
					<div v-else>
						当前列表为空
					</div>
	  		    </el-form-item>
  		  </el-form>
  		  <div slot="footer" class="dialog-footer">
  		    <el-button @click="bindingCourseDialog = false">取 消</el-button>
  		    <el-button type="primary" @click="submitBindingCourse" :plain="true">确 定</el-button>
  		  </div>
        </el-dialog>
	</section>
</template>

<script>
import FormList from '../../components/formList'
import Toolbar from '../../components/toolbar'

import {
	addNewSpu,
	updateSpu,
	getSpuList,
	getCourseList,
	updateSku
} from '../../api/api';

export default {
	components: {
		FormList,
		Toolbar
	},
	data() {
		return {
			// 打开的 标签页名字
			activeName: 'virtual',
			// 列表 是否显示判断表
			formTitle: {
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
				merchandiseType: {
					label: '商品类型',
					width: '100',
				},
				merchandisExpand:{
					label: '面板'
				},
				button:{
					edit:{
						label:'编辑'
					},
					merchandiseDetails: {
						label: '详情列表'
					},
					width: '223'
				}
			},
			// 添加表单里 是否显示判断表
			addItemTitle: {
				formHeader:{
					label: '新增 Spu'
				},
				name: {
					label: '名称',
					width: ''
				},
				description: {
					label: '描述',
					width: ''
				},
				merchandiseType: {
					label: '类型',
					merchandiseOption:[
						{
							value: '0',
							label: 'Course',
						}
					],
					merchandiseDefaultValue: '0'
				},
				input:{
					id:{
						label: 'id'
					},
                    name:{
                        label: 'name'
                    }
                },
				button:{
					seek:{
						label:'查询'
					},
					add:{
						label:'新增',
					}
				}
			},
			// 编辑表单里 是否显示判断表
			editItemTitle: {
				formHeader:{
					label: '编辑 Spu 信息'
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
			formdata: [],
			total: 0,
			loading: true,
			// 绑定课程 相关
			bindingCourseDialog:false,
			searchCourse:'',
			selectCourseLoading: false,
			CourseOptions: [],
			addGoods:[],
			currentSpu:{},
			formLabelWidth: '100px;', // 绑定课程 form_item 的宽度
		};
	},
	methods: {
		// 加载 Spu 列表
		initSpusList(obj) {
			let parameter = {
				id: obj.id,
				name: obj.name,
				description: obj.description,
				type: obj.type,
				sub_type: obj.sub_type,
				page_index: obj.page_index,
				fuzzy: 1
			}
			// 调用 加载列表的接口
			getSpuList(parameter)
				.then((res) => {
					if (res.data.success) {
						this.formdata = [];
						if (res.data.data.items) {
							res.data.data.items.forEach((item) => {
								let obj = item.entity;
								obj['courseEntityList'] = item.courseEntityList;
								this.formdata.push(obj);
							})
						}
						this.total = res.data.data.totalCount;
					}else{
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
		// 查询 按钮的监听
		onHandleSeek(obj){
			this.loading = true;
			let params = {
				id:obj.id,
				name: obj.name,
				type: this.activeName == 'virtual' ? '0' : '1',
				sub_type: obj.merchandiseType[0]
			}
			this.initSpusList(params);
		},
		// 新增页面 确定 的监听
		emitHandleAdd(obj) {
			let parameter = {
				name: obj.name,
				description: obj.description,
				type: this.activeName == 'virtual' ? '0' : '1',
				sub_type: obj.merchandiseType[0],
			}
			addNewSpu(parameter).then((res) => {
				if (res.data.success) {
					let type = this.activeName == 'virtual' ? '0' : '1';
					this.initSpusList({type: type});
					this.$notify({
						title: '成功',
						message: '添加成功',
						type: 'success',
						offset: 45
					});
				}else {
					this.$notify({
						title: '失败',
						message: res.data.msg,
						type: 'error',
						offset: 45
					});
				}
			});
		},
		// 分页
		handleCurrentChange(val) {
			let parameter = {
				type: this.activeName == 'virtual' ? '0' : '1',
				page_index: val,
			}
			this.initSpusList(parameter)
		},
		// 提交 Spu 改变
		submitEdit(obj, itemFlag) {
			// 1 是编辑 Spu。
			if (itemFlag === 1) {
				this.editSpu(obj); // 编辑 Spu 的方法
			}
		},
		// 编辑 Spu 的接口调用
		editSpu(obj){
			let parameter = {
				id: obj.id,
				name: obj.name,
				description: obj.description,
				type: obj.type,
				sub_type: obj.subType,
				ids: ''
			};
			if (obj.courseEntityList.length) {
				obj.courseEntityList.forEach((item) => {
					parameter['ids'] += item.id + ','
				})
			}
			updateSpu(parameter).then((res) => {
				if (res.data.success) {
					let type = this.activeName == 'virtual' ? '0' : '1';
					this.initSpusList({type: type});
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
				}
			})
		},
		// 监听 详情列表按钮
		onMerchandiseDetails(row){
			this.$router.push('/SkuManage/' + row.id);
		},
		// temp 切换之后导入数据的函数
		handleClick(tab, event) {
			this.loading = true;
			if (this.activeName == 'reality') {
				this.formTitle.button = {
					edit:{
						label:'编辑'
					},
					merchandiseDetails: {
						label: '详情列表'
					},
					bindingCourse:{
						label:'绑定课程'
					},
					width: '223'
				}
				this.addItemTitle.merchandiseType = {
					label: '类型',
					merchandiseOption:[
						{
							value: '1',
							label: 'Card',
						}
					],
					merchandiseDefaultValue:'1'
				}
			};
			if (this.activeName == 'virtual') {
				this.formTitle.button = {
					edit:{
						label:'编辑'
					},
					merchandiseDetails: {
						label: '详情列表'
					},
					width: '223'
				};
				this.addItemTitle.merchandiseType = {
					label: '类型',
					merchandiseOption:[
						{
							value: '0',
							label: 'Course',
						},
					],
					merchandiseDefaultValue:'0'
				}
			}
			let parameter = {
				type: this.activeName == 'virtual' ? '0' : '1',
			}
			this.initSpusList(parameter)
	    },
		// 监听绑定 课程 按钮。
		onBindingCourse(currentSpu){
			this.bindingCourseDialog = true;
			this.currentSpu = currentSpu;
			this.addGoods = this.currentSpu.courseEntityList
		},
		// 搜索 course
		searchCourseFunc(query){
			if (query !== '') {
				this.selectCourseLoading = true;
				let temp = Number(query);
                let parameter = {};
                if (temp) {
                    parameter = {
    					id: temp,
    				};
                }else {
                    parameter = {
    					name: query,
    				};
                };
				// 调用 加载列表的接口
				getCourseList(parameter).then((res) => {
					if (res.data.success) {
						this.CourseOptions = res.data.data.items.map((item) => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
							}
							return tempObj
						});
					}else{
						this.$notify.error(res.data.msg);
					}
					this.selectCourseLoading = false;
				});
			} else {
	        	this.CourseOptions = [];
	        }
		},
		addCourseToCard(){
			if (this.searchCourse !== '') {
                if (this.addGoods.length) {
                    for (var i = 0; i < this.addGoods.length; i++) {
                        if (this.addGoods[i].id == this.searchCourse.id) {
                            this.$message.error('抱歉，此选项已存在。请重新选择');
                            return;
                        }
                    }
                }
    			this.addGoods.push(this.searchCourse);
                this.searchGoods = '';
                this.GoodsOptions = [];
            } else {
                this.$message.error('抱歉，选项为空无法添加');
            }
		},
		deleteItemInGoods(index){
            this.$delete(this.addGoods, index);
        },
		// 提交 绑定课程的更改
		submitBindingCourse(){
			let ids = ''
			this.addGoods.forEach((item) => {
				ids += item.id + ','
			})
			let parameter ={
				id: this.currentSpu.id,
				name: this.currentSpu.name,
				description: this.currentSpu.description,
				type: this.currentSpu.type,
				sub_type: this.currentSpu.subType,
				ids: ids
			};
			updateSpu(parameter).then((res) => {
				if (res.data.success) {
					let type = this.activeName == 'virtual' ? '0' : '1';
					this.initSpusList({type: type});
					this.bindingCourseDialog = false;
					this.$notify({
						title: '成功',
						message: '添加成功',
						type: 'success',
						offset: 45
					});
				}else {
					this.$notify({
						title: '失败',
						message: res.data.msg,
						type: 'error',
						offset: 45
					});
				}
			});
		}
	},
	created() {
		let type = this.activeName == 'virtual' ? '0' : '1';
		this.initSpusList({type: type});
	}
}
</script>

<style lang="css">
</style>
