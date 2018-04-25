<template lang="html">
	<section>
		<el-card class="box-card">
			<div slot="header" class="spuTitle">
				<span style="line-height: 36px;">{{ spuEssInfo.name }}</span>
			</div>
			<el-row>
				<el-col :span="2" class="spuInfo spuInfoTitle">Spu ID：</el-col>
				<el-col :span="2" class="spuInfo spuInfoContent" style="margin-top:2px;">{{ spuEssInfo.id }}</el-col>
				<el-col :span="2" class="spuInfo spuInfoTitle">Spu 分类：</el-col>
				<el-col :span="2" class="spuInfo spuInfoContent">{{ spuEssInfo.type ? '现实商品' : '虚拟商品'}}</el-col>
				<el-col :span="2" class="spuInfo spuInfoTitle">Spu 类型：</el-col>
				<el-col :span="2" class="spuInfo spuInfoContent">{{ spuEssInfo.subType  ? '卡片' : '课程' }}</el-col>
				<el-col :span="2" class="spuInfo spuInfoTitle">更新时间：</el-col>
				<el-col :span="3" class="spuInfo spuInfoContent" style="margin-top:2px;">{{ spuEssInfo.ut | formatTime }}</el-col>
				<el-col :span="2" :offset='1' v-if="spuEssConfCourseList">
					<el-button type="text" @click="showMoreInfo">
						显示更多
						<i class="fa fa-chevron-circle-down" style="margin-left:2px;" v-if="!showMoreInfoFlag"></i>
						<i class="fa fa-chevron-circle-up" style="margin-left:2px;" v-else></i>
					</el-button>
				</el-col>
			</el-row>
			<el-row v-show="showMoreInfoFlag">
				<el-col :span="2" class="spuInfo spuInfoTitle">相关配置：</el-col>
				<el-col :span="20" class="spuInfo spuInfoContent">
					<el-row>
						<el-col :span="8" v-for="(item, index) in spuEssConfCourseList" :key="index">【{{ index + 1 }}】（{{ item.entity.id }}）{{ item.entity.name }}；</el-col>
					</el-row>
					<!-- <span v-for="(item, index) in spuEssConfCourseList" :key="index" style="margin-right:20px;">【{{ index + 1 }}】（{{ item.entity.id }}）{{ item.entity.name }}；</p> -->
				</el-col>
			</el-row>
		</el-card>
		<Toolbar :placeHolder="['请输入Sku ID','请输入Sku 名称']" :addItemTitle='addItemTitle' v-on:emitHandleSeek='onHandleSeek' v-on:emitHandleAdd='emitHandleAdd' :newSkuAbout='newSkuAbout'></Toolbar>
		<FormList :formData='formdata' :formTitle='formTitle' :editItemForm='editItemTitle' style="width:100%;" v-on:submitEdit='submitEdit'  v-loading="loading" :newSkuAbout='newSkuAbout' element-loading-text="努力加载中"></FormList>
		<el-col :span='24' class='toolbar'>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='20' :total='total' style='float: right'></el-pagination>
        </el-col>

	</section>
</template>

<script>
import FormList from '../../components/formList'
import Toolbar from '../../components/toolbar'

import {
	addNewSku,
	updateSku,
	getSkuList,
	getCourseList
} from '../../api/api';

import util from '../../common/js/util'

export default {
	components: {
		FormList,
		Toolbar
	},
	data() {
		return {
			// 列表 是否显示判断表
			formTitle: {
				id: {
					label: 'ID',
					width: '73'
				},
				name: {
					label: '商品名称',
					width: '200'
				},
				type: {
					label: '类型',
					width: '65'
				},
				description: {
					label: '描述',
					width: ''
				},
				SkuPrice: {
					label: '价格/￥',
					width: '100'
				},
				button:{
					edit:{
						label:'编辑'
					},
					width: '100'
				},
				relevance:{		// 用来确定是什么列表
					type: 'Sku',
					name: 'course',
				}
			},
			// 添加表单里 是否显示判断表
			addItemTitle: {
				formHeader:{
					label: '新增 Sku'
				},
				name: {
					label: 'Sku 名称',
					width: ''
				},
				description: {
					label: 'Sku 描述',
					width: ''
				},
				price: {
					label: 'Sku 价格',
					width: '',
					rule: true
				},
				SkuType: {
					label: 'Sku 类型',
					width: '',
					SkuOption: [ // 商品SKU 选择的类型
						{
							value: '0',
							label: '普通'
						},
						{
							value: '1',
							label: '集合'
						}
					]
				},
				bindingSuite:{
					label: '绑定集合',
					spu_id: this.$route.params.spuId,
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
					label: '编辑 Sku 信息'
				},
				name: {
					label: 'Sku 名称',
					width: ''
				},
				price: {
					label: 'Sku 价格',
					width: ''
				},
				description: {
					label: 'Sku 描述',
					width: ''
				},
				bindingSuite:{
					label: '绑定集合',
					spu_id: this.$route.params.spuId,
				},
			},
			formdata: [],
			spuEssInfo:{},
			spuEssConfCourseList:{},
			showMoreInfoFlag: false,
			courseList: [],
			newSkuAbout: [],
			total: 0,
			loading: false,
		};
	},
	methods: {
		// 加载 Sku列表
		initSkuList(obj) {
			let parameter = {
				id: obj.id,
				spu_id: this.$route.params.spuId,
				name: obj.name,
				description: obj.description,
				type: obj.type,
				page_index: obj.page_index,
				fuzzy: 1
			};
			// 调用 加载列表的接口
			getSkuList(parameter)
				.then((res) => {
					if (res.data.success) {
						if (res.data.data.items) {
							this.formdata = [];
							res.data.data.items.forEach((item) => {
								item.entity['conf'] = item.conf;
								item.entity['courseEntities'] = item.courseEntities;
								item.entity['skuEntities'] = item.skuEntities;
								this.formdata.push(item.entity)
							})
						};
						this.total = res.data.data.totalCount;
						if (res.data.data.ext) {
							this.spuEssInfo = res.data.data.ext.spuParsedEntity.entity;
							this.spuEssConfCourseList = res.data.data.ext.spuCourseList;
						// 判断 是虚拟产品还是 真实产品。如果是 虚拟产品 则在 产品内绑定课程。
							this.allGoodsList(this.spuEssInfo.type);
						// 不管 是虚拟产品还是 真是产品。集合的列表是必须存在的。所以 集合是必须传过去的。利用下面的方法传 Sku列表
							this.allSkuList();
						};
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
		// 未添加的商品列表
		allGoodsList (type) {
			if (type == 0) {
				let bindingCourse = {
					label: '绑定课程',
					width: '',
				};
				this.addItemTitle['bindingCourse'] = bindingCourse;
				this.formTitle.relevance.name = 'Course';
				return;
			};
			this.formTitle.relevance.name = 'Card';
			this.editItemTitle['days'] = {
				label: '有效期限',
				width: ''
			};
			this.addItemTitle['days'] = {
				label: '有效期限',
				width: ''
			};
			this.editItemTitle['endTime'] = {
				label: '截止日期',
				width: ''
			};
			this.addItemTitle['endTime'] = {
				label: '截止日期',
				width: ''
			};
		},
		// 未添加 的sku列表，在新增 集合的使用
		allSkuList(){
			this.newSkuAbout = {
				spuId: this.$route.params.spuId
			};
		},
		// 查询 按钮的监听
			// 传入 写入的 ID 或者 name 。并调用 Sku 列表接口方法
		onHandleSeek(obj) {
			let parameter = {
				id: obj.id,
				name: obj.name,
				type: obj.SkuType
			};
			this.initSkuList(obj);
		},
		// 新增页面 确定 的监听
		emitHandleAdd(obj) {
			let ids = ''
			if (obj.goodsList) {
				obj.goodsList.forEach((item) => {
					ids += item.id + ','
				});
			};
			let parameter = {
				spu_id: this.$route.params.spuId,
				name: obj.name,
				description: obj.description,
				type: obj.SkuType[0],
				price: obj.price,
				ids: ids
			};
			if (this.addItemTitle.days) {
				let days = obj.days;
				parameter['days'] = days;
				parameter['end_time'] = obj.endTime;
			};
			addNewSku(parameter).then((res) => {
				if (res.data.success) {
					this.initSkuList('');
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
		// 分页
		handleCurrentChange(val) {
			this.loading = true;
			let parameter = {
				page_index: val,
			};
			this.initSkuList(parameter);
		},
		// 提交 Sku 改变
		submitEdit(obj, itemFlag) {
			// 1 是编辑。
			if (itemFlag === 1) {
				this.editSku(obj); // 编辑 Spu 的方法
			};
		},
		// 编辑Sku 的接口调用
		editSku(obj){
			let ids = '';
			if (obj.goodsList) {
				obj.goodsList.forEach((item) => {
					ids += item.id + ','
				});
			};
			let parameter = {
				spu_id: this.$route.params.spuId,
				id: obj.id,
				name: obj.name,
				price: obj.price,
				description: obj.description,
				type: obj.type,
				ids: ids,
			};
			if (this.addItemTitle.days) {
				let days = obj.days;
				parameter['days'] = days;
				parameter['end_time'] = obj.endTime;
			};
			updateSku(parameter).then((res) => {
				if (res.data.success) {
					this.initSkuList('');
					this.$notify({
						title: '成功',
						message: '操作成功',
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
		// 显示更多
		showMoreInfo() {
			this.showMoreInfoFlag = !this.showMoreInfoFlag;
		}
	},
	filters: {
		// 关于时间转换的俩东西
		formatTime(date) {
			if (date === undefined) {
				return
			}
			if (date === 0) {
				return '/'
			}
			return util.formatDate.format(new Date(date), 'yyyy/MM/dd   hh:mm:ss');
		},

	},
	created() {
		this.initSkuList('');
	}
}
</script>

<style lang="css">
	.spuTitle {
		text-align: center;
		font-size: 22px;
		font-weight: 500;
	}
	.spuInfo {
		padding: 5px 0;
	}
	.spuInfoTitle {
		text-align: right;
		height: 30px;
		vertical-align: middle;
	}
	.spuInfoContent {
		text-align: left;
		vertical-align: middle;
	}
</style>
