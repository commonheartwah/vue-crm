<template>
<section>
	<el-card class="box-card">
		<div slot="header" class="PageDetialTitle">
			<h2 style="line-height: 20px;">{{ PageDetialInfo.title }}</h2>
			<p style="font-size: 14px">{{ PageDetialInfo.subTitle }}</p>
		</div>
		<el-button type="primary" @click='addNewBlockInPage' icon='plus'>新增板块</el-button>
		<el-button type="primary" @click='updateBlockSequence' icon='check'>提交顺序</el-button>
	</el-card>
	<draggable draggable :list="blocksInfoInPage" :move='onMoveCallback'>
		<el-collapse v-model="activeNames" class="list-complete-item" v-for='(pro, index) in blocksInfoInPage' :key='index'>
			<el-collapse-item :name='index'>
				<template slot="title">{{  pro.content.name }}</template>
				<el-form label-position="left" inline class="demo-table-expand">
					<el-form-item label="标题：">
						<span>{{ pro.content.title }}</span>
					</el-form-item>
					<el-form-item label="类型：">
						<span>{{ pro.content.type | formatBlockType }}</span>
					</el-form-item>
					<el-form-item label="副标题：">
						<span>{{ pro.content.subTitle }}</span>
					</el-form-item>
					<el-form-item label="操作：">
						<el-button-group>
							<el-tooltip class="item" effect="light" content="板块编辑" placement="top-end">
								<el-button type="info" icon="edit" size="small" @click='editBlockInPageFunc(pro, index)'></el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="light" content="板块删除" placement="top-end">
								<el-button type="info" icon="delete" size="small" @click='deleteBlockInPageFunc(pro, index)'></el-button>
							</el-tooltip>
						</el-button-group>
						<el-button-group>
							<el-tooltip class="item" effect="light" content="添加元素" placement="top-end">
								<el-button type="info" icon="plus" size="small" @click='addNewItemInBlockFunc(pro, index)'></el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="light" content="修改显示方式" placement="top-end" v-if='pro.content.type == 1'>
								<el-button type="info" icon="d-caret" size="small" @click='changeMode(pro, index)'></el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="light" content="保存排序" placement="top-end">
								<el-button type="info" icon="check" size="small" @click='updateItemSequence(pro, index)'></el-button>
							</el-tooltip>
						</el-button-group>
					</el-form-item>
				</el-form>
				<div v-if='pro.content.type == 1' class="PageBlockDetail">
					<el-carousel :interval="4000" type="card" height="300px" v-if="focusShowMode">
						<el-carousel-item v-for="(item, index) in pro.content.items" :key="index">
							<el-tooltip placement="top" effect="light">
								<div slot="content" class="tooltipContent">
									<p>名称：{{ item.name || '无'}}</p>
									<p>标题：{{ item.title || '无'}}</p>
									<p>副标题：{{ item.subTitle || '无' }}</p>
									<p>内容：{{ item.content || '无' }}</p>
									<p>链接：{{ item.link || '无' }}</p>
									<p>操作：<span style="text-align:center;"><el-button size="mini" @click.native='deleteItemInBlock(item, pro, index)'>删除</el-button></span></p>
									<!-- <el-button size="mini" @click.native='editItemInBlock(item, pro, index)'>编辑</el-button> -->
								</div>
								<div>
									<span @click='handleFocus(item, pro, index)'><img :src="item.imgURL" :alt="item.name"></span>
								</div>

							</el-tooltip>
						</el-carousel-item>
					</el-carousel>

					<div v-else>
						<draggable draggable :list="pro.content.items">
							<el-col :span="3" v-for="(item, index) in pro.content.items" :key="index">
								<el-card :body-style="{ padding: '0px',height: '200px' }">
									<img :src="item.imgURL" class="image" height="150">
									<div style="padding: 14px;">
										<el-button type="text" size='small' @click.native='editItemInBlock(item, pro, index)'>修改</el-button>
										<el-button type="text" size='small' @click.native='deleteItemInBlock(item, pro, index)'>删除</el-button>
									</div>
								</el-card>
							</el-col>
						</draggable>
					</div>
				</div>
				<div v-if='pro.content.type == 2' class="PageBlockDetail">
					<el-row>
						<draggable draggable :list="pro.content.items">
							<el-col :span="3" v-for="(item, index) in pro.content.items" :key="index">
								<el-tooltip placement="top" effect="light">
									<div slot="content" class="tooltipContent">
										名称：{{ item.name || '无'}} <br> 标题：{{ item.title || '无'}} <br> 副标题：{{ item.subTitle || '无' }} <br> 内容：{{ item.content || '无' }} <br> 链接：{{ item.link || '无' }} <br>
									</div>
									<el-card :body-style="{ padding: '0px',height: '200px' }">
										<img :src="item.imgURL" class="image" height="150">
										<div style="padding: 14px;">
											<el-button type="text" size='small' @click.native='editItemInBlock(item, pro, index)'>修改</el-button>
											<el-button type="text" size='small' @click.native='deleteItemInBlock(item, pro, index)'>删除</el-button>
										</div>
									</el-card>
								</el-tooltip>
							</el-col>
						</draggable>
					</el-row>
				</div>
				<div v-if='pro.content.type == 3' class="PageBlockDetail">
					<el-row style='margin-left:40px;'>
						<draggable draggable :list="pro.content.items">
							<el-col :span="5" v-for="(item, index) in pro.content.items" :key="index" :offset="index%4==0 ? 0 : 1" style='margin-bottom:10px;'>
								<el-tooltip placement="top" effect="light">
									<div slot="content" class="tooltipContent">
										标题：{{ item.title || '无'}} <br> 副标题：{{ item.subTitle || '无'}} <br> 内容：{{ item.content || '无' }} <br> 链接：{{ item.link || '无' }} <br>
									</div>
									<el-card :body-style="{ padding: '0px' }">
										<img :src="item.imgURL" class="image" height="250">
										<div style="padding: 14px;display:flex;justify-content: space-between;">
											<span>{{ item.name || '未命名' }}</span>
											<span>
												<el-button type="text"  size='small' @click.native='editItemInBlock(item, pro, index)'>修改</el-button>
												<el-button type="text"  size='small' @click.native='deleteItemInBlock(item, pro, index)'>删除</el-button>
											</span>
										</div>
									</el-card>
								</el-tooltip>
							</el-col>
						</draggable>
					</el-row>
				</div>
				<div v-if='pro.content.type == 4' class="PageBlockDetail">
					<el-row style='margin-left:40px;'>
						<draggable draggable :list="pro.content.items">
							<el-col :span="11" v-for="(item, index) in pro.content.items" :key="index" :offset="index%2==0 ? 0 : 1" style='margin-bottom:10px;'>
								<el-tooltip placement="top" effect="light">
									<div slot="content" class="tooltipContent">
										标题：{{ item.title || '无' }} <br> 副标题：{{ item.subTitle || '无' }} <br> 内容：{{ item.content || '无' }} <br> 链接：{{ item.link || '无' }} <br>
									</div>
									<el-card :body-style="{ padding: '0px' }">
										<img :src="item.imgURL" class="image" height="450">
										<div style="padding: 14px;display:flex;justify-content: space-between;">
											<span>{{ item.name || '未命名'}}</span>
											<span>
												<el-button type="text"  size='small' @click.native='editItemInBlock(item, pro, index)'>修改</el-button>
												<el-button type="text"  size='small' @click.native='deleteItemInBlock(item, pro, index)'>删除</el-button>
											</span>
										</div>
									</el-card>
								</el-tooltip>
							</el-col>
						</draggable>
					</el-row>
				</div>
				<div v-if='pro.content.type == 5' class="PageBlockDetail">
					<el-row style='margin-left:40px;'>
						<draggable draggable :list="pro.content.items">
							<el-col :span="5" v-for="(item, index) in pro.content.items" :key="index" :offset="index%4==0 ? 0 : 1" style='margin-bottom:10px;'>
								<el-tooltip placement="top" effect="light">
									<div slot="content" class="tooltipContent">
										标题：{{ item.title || '无'}} <br> 副标题：{{ item.subTitle || '无'}} <br> 内容：{{ item.content || '无' }} <br> 链接：{{ item.link || '无' }} <br>
									</div>
									<el-card :body-style="{ padding: '0px' }">
										<img :src="item.imgURL" class="image" height="250">
										<div style="padding: 14px;display:flex;justify-content: space-between;">
											<span>{{ item.name || '未命名' }}</span>
											<span>
												<el-button type="text"  size='small' @click.native='editItemInBlock(item, pro, index)'>修改</el-button>
												<el-button type="text"  size='small' @click.native='deleteItemInBlock(item, pro, index)'>删除</el-button>
											</span>
										</div>
									</el-card>
								</el-tooltip>
							</el-col>
						</draggable>
					</el-row>
				</div>
			</el-collapse-item>
		</el-collapse>
	</draggable>
	<!-- 新建板块的弹窗 -->
	<el-dialog title="新建板块" v-model='dialogAddNewBlockInPage' :close-on-click-modal='false'>
		<el-form :model="newBlockInPageForm" ref="newBlockInPageForm" label-width="100px" :rules="addBlockInpageRules">
			<el-form-item label="板块名称" prop='name'>
				<el-input v-model="newBlockInPageForm.name" @keydown.enter.native.prevent></el-input>
			</el-form-item>
			<el-form-item label="板块标题">
				<el-input v-model="newBlockInPageForm.title" @keydown.enter.native.prevent placeholder="当类型为推荐位时为必填项"></el-input>
			</el-form-item>
			<el-form-item label="板块副标题">
				<el-input v-model="newBlockInPageForm.subTitle" @keydown.enter.native.prevent placeholder="当类型为推荐位时为必填项"></el-input>
			</el-form-item>
			<el-form-item label="板块类型" prop='type'>
				<el-select v-model="newBlockInPageForm.type" placeholder="请选择" @change='changeBlockInPageType'>
					<el-option v-for="item in blockInPageType" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="板块样式" prop='style_type' v-if="newBlockInPageForm.type == '3' || newBlockInPageForm.type == '5'">
				<el-select v-model="newBlockInPageForm.style_type" placeholder="请选择">
					<el-option v-for="item in blockInPageStyle" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="链接地址">
				<el-select placeholder="请选择" v-model="selectLinkPrepend" style="width: 20%">
					<el-option label="网页地址" value="1"></el-option>
					<el-option label="APP地址" value="2"></el-option>
				</el-select>
				<el-input placeholder="请输入内容" v-model="newBlockInPageForm.link" style="width: 79%" @keydown.enter.native.prevent></el-input>
			</el-form-item>
			<el-form-item label="图片地址">
				<el-input v-model="newBlockInPageForm.image_url" @keydown.enter.native.prevent placeholder="请填写图片地址"></el-input>
			</el-form-item>
			<el-form-item label="附加参数">
				<div v-for="(item ,index) in blockAddition">
					<section v-if="item.editable">
						<el-input placeholder="请输入描述" v-model="item.desc" style="width: 20%;margin-top:6px;" @keydown.enter.native.prevent></el-input>
						<el-input :disabled="item.disabled" placeholder="请输入键名" v-model="item.key" style="width: 20%;margin-top:6px;" @keydown.enter.native.prevent></el-input>
						<el-input placeholder="请输入键值" v-model="item.value" style="width: 50%;margin-top:6px;" @keydown.enter.native.prevent></el-input>
						<el-button type="danger" icon="close" size="small" style="margin-top:6px;margin-left:6px;" @click='delMapItem(item, index, blockAddition)'></el-button>
					</section>
					<section v-else>
						<span>{{ item.key }}</span><span>（{{ item.desc }}）： </span><span>{{ item.value }}</span>
						<el-button type="text" icon="edit" size="small" style="margin-top:6px;margin-left:20px;" @click='editMapItem(item, index, blockAddition)'></el-button>
					</section>
				</div>
				<el-button type="info" icon="plus" size="small" @click='addNewMapBlock'></el-button>
			</el-form-item>
			<el-form-item class="footerButton">
				<el-button type="primary" @click="submitNewBlockInPage('newBlockInPageForm')">立即创建</el-button>
				<el-button @click="dialogAddNewBlockInPage = false">取消</el-button>
			</el-form-item>

		</el-form>
	</el-dialog>
	<!-- 编辑板块的弹窗 -->
	<el-dialog title="编辑板块" v-model='dialogEditBlockInPage' :close-on-click-modal='false'>
		<el-form :model="editBlockInPageForm" label-width="100px" ref='editBlockInPageForm'>
			<el-form-item label="板块标题">
				<el-input v-model="editBlockInPageForm.title" @keydown.enter.native.prevent></el-input>
			</el-form-item>
			<el-form-item label="板块副标题">
				<el-input v-model="editBlockInPageForm.subTitle" @keydown.enter.native.prevent></el-input>
			</el-form-item>
			<el-form-item label="板块样式" prop='style_type' v-if="editBlockInPageForm.type == '3' || editBlockInPageForm.type == '5' ">
				<el-select v-model="editBlockInPageForm.styleType" placeholder="请选择">
					<el-option v-for="item in blockInPageStyle" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="链接地址">
				<el-select placeholder="请选择" v-model="selectLinkPrepend" style="width: 20%">
					<el-option label="网页地址" value="1"></el-option>
					<el-option label="APP地址" value="2"></el-option>
				</el-select>
				<el-input placeholder="请输入内容" v-model="editBlockInPageForm.link" style="width: 79%" @keydown.enter.native.prevent></el-input>
			</el-form-item>
			<el-form-item label="图片地址">
				<el-input v-model="editBlockInPageForm.image_url" @keydown.enter.native.prevent placeholder="请填写图片地址"></el-input>
			</el-form-item>
			<el-form-item label="附加参数">
				<div v-for="(item ,index) in blockAddition">
					<section v-if="item.editable">
						<el-input placeholder="请输入描述" v-model="item.desc" style="width: 20%;margin-top:6px;" @keydown.enter.native.prevent></el-input>
						<el-input :disabled="item.disabled" placeholder="请输入键名" v-model="item.key" style="width: 20%;margin-top:6px;" @keydown.enter.native.prevent></el-input>
						<el-input placeholder="请输入键值" v-model="item.value" style="width: 50%;margin-top:6px;" @keydown.enter.native.prevent></el-input>
						<el-button type="danger" icon="close" size="small" style="margin-top:6px;margin-left:6px;" @click='delMapItem(item, index, blockAddition)'></el-button>
					</section>
					<section v-else>
						<span>{{ item.key }}</span><span>（{{ item.desc }}）： </span><span>{{ item.value }}</span>
						<el-button type="text" icon="edit" size="small" style="margin-top:6px;margin-left:20px;" @click='editMapItem(item, index, blockAddition)'></el-button>
					</section>
				</div>
				<el-button type="info" icon="plus" size="small" @click='addNewMapBlock'></el-button>
			</el-form-item>
			<el-form-item class="footerButton">
				<el-button type="primary" @click="submitEditBlockInPage">确认提交</el-button>
				<el-button @click="dialogEditBlockInPage = false">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
	<!-- 板块里新建item的弹窗 -->
	<el-dialog :title="dialogItemFuncFlag ? '新建元素' : '编辑元素' " v-model='dialogItemInBlock' :close-on-click-modal='false'>
		<el-form :model="newItemInBlockForm" label-width="100px" :rules="newItemRules" ref='newItemInBlockForm'>
			<el-form-item label="元素名称" prop='name'>
				<el-input v-model="newItemInBlockForm.name" @keydown.enter.native.prevent></el-input>
			</el-form-item>
			<el-form-item label="元素标题">
				<el-input v-model="newItemInBlockForm.title" @keydown.enter.native.prevent></el-input>
			</el-form-item>
			<el-form-item label="元素副标题">
				<el-input v-model="newItemInBlockForm.subTitle" @keydown.enter.native.prevent></el-input>
			</el-form-item>
			<el-form-item label="元素类型" prop='type'>
				<el-select v-model="newItemInBlockForm.type" placeholder="请选择">
					<el-option v-for="item in itemInBlockType" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="元素内容">
				<el-input type="textarea" v-model="newItemInBlockForm.content" @keydown.enter.native.prevent></el-input>
			</el-form-item>
			<el-form-item label="图片地址">
				<el-input v-model="newItemInBlockForm.imgURL" @keydown.enter.native.prevent></el-input>
			</el-form-item>
			<el-form-item label="链接地址">
				<el-select placeholder="请选择" v-model="selectLinkPrepend" style="width: 20%">
					<el-option label="网页地址" value="1"></el-option>
					<el-option label="APP地址" value="2"></el-option>
				</el-select>
				<el-select v-if="selectLinkPrepend == '2'" v-model="selectArticle" style="width:380px;margin-bottom: 10px;" placeholder="请输入文章名称或ID查询" filterable clearable remote :remote-method="selectArticleRemoteMethod" :loading='selectArticleLoading' @change="selectedArticle">
					<el-option v-for="item in selectArticleOptions" :key="item.id" :label="'（' + item.id + '）' + item.name" :value="item">
					</el-option>
				</el-select>
				<el-input placeholder="请输入内容" v-model="newItemInBlockForm.link" style="width: 79%" @keydown.enter.native.prevent></el-input>
			</el-form-item>

			<el-form-item label="附加参数">
				<div v-for="(item ,index) in addition">
					<section v-if="item.editable">
						<el-input placeholder="请输入描述" v-model="item.desc" style="width: 20%;margin-top:6px;" @keydown.enter.native.prevent></el-input>
						<el-input :disabled="item.disabled" placeholder="请输入键名" v-model="item.key" style="width: 20%;margin-top:6px;" @keydown.enter.native.prevent></el-input>
						<el-input placeholder="请输入键值" v-model="item.value" style="width: 50%;margin-top:6px;" @keydown.enter.native.prevent></el-input>
						<el-button type="danger" icon="close" size="small" style="margin-top:6px;margin-left:6px;" @click='delMapItem(item, index, addition)'></el-button>
					</section>
					<section v-else>
						<span>{{ item.key }}</span><span>（{{ item.desc }}）： </span><span>{{ item.value }}</span>
						<el-button type="text" icon="edit" size="small" style="margin-top:6px;margin-left:20px;" @click='editMapItem(item, index, addition)'></el-button>
					</section>
				</div>
				<el-button type="info" icon="plus" size="small" @click='addNewMapItem'></el-button>
			</el-form-item>

			<el-form-item class="footerButton">
				<el-button type="primary" @click="judgeSubmitItemInBlock('newItemInBlockForm')">确认提交</el-button>
				<el-button @click="dialogItemInBlock = false">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>

</section>
</template>


<script>
// 引入 验证校验规则
import verification from '../../common/js/verificatioMode'
// 引入 接口
import {
	getPageInfo,
	addNewPageBlock,
	updatePageBlock,
	updatePage,
	getArticleList
} from '../../api/api';
// 拖动插件
import draggable from 'vuedraggable'

export default {
	components: {
		draggable
	},
	data() {
		return {
			PageDetialInfo: '', // 课节 详细信息展示数据
			dialogAddNewBlockInPage: false, // 新增 表单是否呈现
			newBlockInPageForm: { // 新增page页block的表单
				name: '',
				title: '',
				subTitle: '',
				type: '',
				style_type: '',
				link: '',
				image_url: ''
			},
			addBlockInpageRules: { // 新增page页block的表单验证规则
				name: [{
						required: true,
						message: '请输入模块名称',
						trigger: 'blur'
					},
					{
						min: 1,
						max: 100,
						message: '长度在 3 到 20 个字符',
						trigger: 'blur'
					}
				],
				type: [{
					required: true,
					message: '请选择板块类型',
					trigger: 'blur'
				}],
				style_type: [{
					required: true,
					message: '请选择板块样式',
					trigger: 'blur'
				}],
			},
			blockInPageType: [ // block 的类型
				{
					value: '1',
					label: '焦点图'
				},
				{
					value: '2',
					label: '导航'
				},
				{
					value: '3',
					label: '小图列表'
				},
				{
					value: '4',
					label: '横幅列表'
				},
				{
					value: '5',
					label: '推荐位'
				}
			],
			blockInPageStyle: [], // block 的样式表
			itemInBlockType: [{ // 元素的类型
					value: '0',
					label: '文本'
				},
				{
					value: '1',
					label: '图片'
				},
			],
			dialogEditBlockInPage: false, // 编辑block的窗口
			editBlockInPageForm: { // 编辑 block 的表单
				id: '',
				title: '',
				subTitle: '',
				items: '',
				itemIndex: '',
				type: '',
				styleType: '',
				link: '',
				image_url: ''
			},

			blocksInfoInPage: [], // blocks 信息详情
			activeNames: [], // block 展开面板绑定数据

			dialogItemInBlock: false, // 新增 item 的窗口
			newItemInBlockForm: { // 新增 item 的表单
				name: '',
				title: '',
				subTitle: '',
				type: '1',
				content: '',
				imgURL: '',
				link: '',
			},
			newItemRules: {
				name: [{
						required: true,
						message: '请输入模块名称',
						trigger: 'blur'
					},
					{
						min: 1,
						max: 100,
						message: '长度在 3 到 20 个字符',
						trigger: 'blur'
					}
				],
				type: [{
					required: true,
					message: '请选择模块类型',
					trigger: 'blur'
				}],
			},
			selectLinkPrepend: '', // 选择 网页地址 还是 本地APP地址
			dialogItemFuncFlag: true, // 判定 新增 or 编辑 的方法

			// 焦点图的显示方式 （true: 轮播图；false: 列表方式）
			focusShowMode: true,

			addition:[{
				key: '',
				value: '',
				desc: '',
				disabled: false,
				editable: true,
			}],

			blockAddition:[{
				key: '',
				value: '',
				desc: '',
				disabled: false,
				editable: true,
			}],

			// 检索相关
			selectArticle: '',
			selectArticleOptions: [],
			selectArticleLoading: false,
		}
	},
	methods: {
		// 获取 Page 的基本信息方法
		getPageEssInfo() {
			let parameter = {
				id: this.$route.params.pageId
			};
			getPageInfo(parameter).then((res) => {
				if (res.data.success) {
					if (res.data.data) {
						this.PageDetialInfo = res.data.data.content;
						this.PageDetialInfo['entity'] = res.data.data.entity;
						this.blocksInfoInPage = res.data.data.blocks;
					};
				} else {
					this.$message.error(res.data.msg);
				};
			});
		},
		// Page 详情页 新增板块
		addNewBlockInPage() {
			this.newBlockInPageForm = { // 新增page页block的表单
				name: '',
				title: '',
				subTitle: '',
				type: '',
				style_type: '',
				link: '',
				image_url: ''
			};
			this.blockAddition = [{
				key: '',
				value: '',
				desc: '',
				disabled: false,
				editable: true,
			}]
			this.dialogAddNewBlockInPage = true;
		},
		// Page 详情页 提交新增板块
		submitNewBlockInPage(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					if (verification.name.test(this.newBlockInPageForm.name)) {
						this.$message.error('名称不能带空格');
						return;
					};
					if (this.selectLinkPrepend == 2 && this.newBlockInPageForm.link.indexOf('babyfs') < 0) {
						this.newBlockInPageForm.link = 'babyfs://' + this.newBlockInPageForm.link;
					};
					let parameter = {
						id: this.$route.params.pageId,
						name: this.newBlockInPageForm.name,
						title: this.newBlockInPageForm.title,
						sub_title: this.newBlockInPageForm.subTitle,
						type: this.newBlockInPageForm.type,
						style_type: this.newBlockInPageForm.style_type,
						link: this.newBlockInPageForm.link,
						image_url: this.newBlockInPageForm.image_url
					};

					let ext = [];
					for (var i = 0; i < this.blockAddition.length; i++) {
						let item = this.blockAddition[i];
						if (item.key) {
							let oMap = {
								key: item.key,
								value: item.value,
								desc: item.desc
							}
							ext.push(oMap)
						} else {
							break;
						}
					}

					console.log(ext);
					parameter['ext'] = JSON.stringify(ext)
					console.log(parameter);

					addNewPageBlock(parameter).then((res) => {
						if (res.data.success) {
							this.getPageEssInfo()
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
					this.dialogAddNewBlockInPage = false;
				} else {
					console.log('error submit!!');
					return false;
				};
			});
		},
		// 编辑 按钮 的监听
		editBlockInPageFunc(obj) {
			this.dialogEditBlockInPage = true;
			this.editBlockInPageForm.id = obj.entity.id;
			this.editBlockInPageForm.title = obj.content.title;
			this.editBlockInPageForm.subTitle = obj.content.subTitle;
			this.editBlockInPageForm.items = obj.content.items;
			this.editBlockInPageForm.type = obj.content.type + '';
			this.editBlockInPageForm.styleType = obj.content.styleType + '';
			this.editBlockInPageForm.link = obj.content.link;
			this.editBlockInPageForm.image_url = obj.content.imgURL;
			if (obj.content.ext && obj.content.ext.length) {
				obj.content.ext.map((item) => {
					this.$set(item, 'disabled', true)
					this.$set(item, 'editable', false)
				})
				this.blockAddition = obj.content.ext
			} else {
				this.blockAddition = [{
					key: '',
					value: '',
					desc: '',
					disabled: false,
					editable: true,
				}]
			}
			this.selectLinkPrepend = '';
			switch (obj.content.type) {
				case 3:
					this.blockInPageStyle = [{
							value: '1',
							label: '两张并排'
						},
						{
							value: '2',
							label: '多张并排'
						}
					];
					break;
				case 5:
					this.blockInPageStyle = [{
							value: '2',
							label: '三张排列'
						},
						{
							value: '3',
							label: '2*2排列'
						}
					];
					break;
				default:
					return;
					break;
			}
		},
		// block 编辑提交
		submitEditBlockInPage() {
			let value = this.editBlockInPageForm.items;
			let values = JSON.stringify(value);
			if (this.selectLinkPrepend == 2 && this.editBlockInPageForm.link.indexOf('babyfs') < 0) {
				this.editBlockInPageForm.link = 'babyfs://' + this.editBlockInPageForm.link;
			};
			let ext = []
			let parameter = {
				id: this.editBlockInPageForm.id,
				title: this.editBlockInPageForm.title,
				sub_title: this.editBlockInPageForm.subTitle,
				style_type: this.editBlockInPageForm.styleType,
				link: this.editBlockInPageForm.link,
				image_url: this.editBlockInPageForm.image_url,
				values: values
			};

			for (var i = 0; i < this.blockAddition.length; i++) {
				let item = this.blockAddition[i];
				if (item.key) {
					let oMap = {
						key: item.key,
						value: item.value,
						desc: item.desc
					}
					ext.push(oMap)
				} else {
					break;
				}
			}
			console.log(ext);
			parameter['ext'] = JSON.stringify(ext)
			console.log(parameter);

			updatePageBlock(parameter).then((res) => {
				this.dialogEditBlockInPage = false;
				if (res.data.success) {
					this.getPageEssInfo();
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
		onMoveCallback() {
			this.activeNames = [];
		},
		// 更新板块顺序
		updateBlockSequence() {
			let parameter = {
				id: this.PageDetialInfo.entity.id,
				title: this.PageDetialInfo.title,
				sub_title: this.PageDetialInfo.subTitle,
				ids: '',
			};
			this.blocksInfoInPage.forEach((item) => {
				parameter.ids += item.entity.id + ',';
			});
			updatePage(parameter).then((res) => {
				if (res.data.success) {
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
				this.getPageEssInfo();
			});
		},
		deleteBlockInPageFunc(obj, index) {
			let parameter = {
				id: this.PageDetialInfo.entity.id,
				title: this.PageDetialInfo.title,
				sub_title: this.PageDetialInfo.subTitle,
				ids: '',
			};
			for (let i = 0; i < this.blocksInfoInPage.length; i++) {
				if (this.blocksInfoInPage[i].entity.id == obj.entity.id) {
					continue;
				};
				parameter.ids += this.blocksInfoInPage[i].entity.id + ',';
			};
			this.$confirm('确认提交吗?', '提示', {}).then(() => {
				updatePage(parameter).then((res) => {
					if (res.data.success) {
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
					this.getPageEssInfo();
					this.activeNames = [];
				});
			}).catch(() => {
				this.$message({
					message: '取消',
					type: 'info',
					offset: 45
				});
			});

		},
		// 新建元素按钮的监听
		addNewItemInBlockFunc(obj) {
			this.dialogItemFuncFlag = true;
			this.newItemInBlockForm = { // 清空数据
				name: '',
				title: '',
				subTitle: '',
				type: '1',
				content: '',
				imgURL: '',
				link: '',
				selectLinkPrepend: ''
			};
			this.addition = [{
				key: '',
				value: '',
				desc: '',
				disabled: false,
				editable: true,
			}]
			this.selectLinkPrepend = '';
			this.editBlockInPageForm.id = obj.entity.id;
			this.editBlockInPageForm.title = obj.content.title;
			this.editBlockInPageForm.subTitle = obj.content.subTitle;
			this.editBlockInPageForm.items = obj.content.items;
			this.editBlockInPageForm.styleType = obj.content.styleType;
			this.editBlockInPageForm.link = obj.content.link;
			this.editBlockInPageForm.image_url = obj.content.imgURL;
			this.editBlockInPageForm.ext = obj.content.ext?JSON.stringify(obj.content.ext):'';
			this.dialogItemInBlock = true;
		},
		// 提交新建元素的方法
		submitNewItemInBlock(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let value = [];
					this.editBlockInPageForm.items ? this.editBlockInPageForm.items.forEach((item) => {
						value.push(item);
					}) : '';
					if (this.selectLinkPrepend == 2 && this.newItemInBlockForm.link.indexOf('babyfs') < 0) {
						this.newItemInBlockForm.link = 'babyfs://' + this.newItemInBlockForm.link;
					};
					if (verification.name.test(this.newItemInBlockForm.name)) {
						this.$message.error('名称不能带空格')
						return;
					};

					this.newItemInBlockForm['ext'] = [];
					for (var i = 0; i < this.addition.length; i++) {
						let item = this.addition[i];
						if (item.key) {
							let oMap = {
								key: item.key,
								value: item.value,
								desc: item.desc
							}
							this.newItemInBlockForm['ext'].push(oMap)
						} else {
							break;
						}
					}

					value.unshift(this.newItemInBlockForm);
					let values = JSON.stringify(value);
					let parameter = {
						id: this.editBlockInPageForm.id,
						title: this.editBlockInPageForm.title,
						sub_title: this.editBlockInPageForm.subTitle,
						style_type: this.editBlockInPageForm.styleType,
						link: this.editBlockInPageForm.link,
						image_url: this.editBlockInPageForm.image_url,
						ext: this.editBlockInPageForm.ext,
						values: values
					};
					updatePageBlock(parameter).then((res) => {
						if (res.data.success) {
							this.addition = [{
								key: '',
								value: '',
								desc: '',
								disabled: false,
								editable: true,
							}]
							this.getPageEssInfo();
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
						this.dialogItemInBlock = false;
					});
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		handleFocus(item, pro, index) {
			const h = this.$createElement;
			this.$confirm('是否要编辑节点？', '提示', {
				// title: '提示',
				// message: '请选择编辑或者删除节点。',
				// showCancelButton: true,
				closeOnClickModal: false,
				confirmButtonText: '编辑',
				cancelButtonText: '取消',
				type: 'info'
			}).then(() => {
				this.editItemInBlock(item, pro, index);
			}).catch(() => {
				//        	this.deleteItemInBlock(item, pro, index);
			});
		},
		// 编辑 元素
		editItemInBlock(item, pro, index) {
			this.dialogItemFuncFlag = false;
			this.newItemInBlockForm = item;
			this.newItemInBlockForm.type += ''
			this.dialogItemInBlock = true;
			this.editBlockInPageForm.id = pro.entity.id;
			this.editBlockInPageForm.title = pro.content.title;
			this.editBlockInPageForm.subTitle = pro.content.subTitle;
			this.editBlockInPageForm.items = JSON.parse(JSON.stringify(pro.content.items))
			this.editBlockInPageForm.styleType = pro.content.styleType;
			this.editBlockInPageForm.link = pro.content.link;
			this.editBlockInPageForm.image_url = pro.content.imgURL;
			this.editBlockInPageForm.ext = pro.content.ext?JSON.stringify(pro.content.ext):'';
			this.editBlockInPageForm.itemIndex = index;
			if (item.ext && item.ext.length) {
				item.ext.map((item) => {
					this.$set(item, 'disabled', true)
					this.$set(item, 'editable', false)
				})
				this.addition = item.ext
			} else {
				this.addition = [{
					key: '',
					value: '',
					desc: '',
					disabled: false,
					editable: true,
				}]
			}
			// 判断 如果 link 存在则 根据地址 选择 APP本地地址 还是 网络地址
			if (item.link) {
				this.selectLinkPrepend = item.link.indexOf('babyfs://') < 0 ? '1' : '2'
			} else {
				this.selectLinkPrepend = '';
			};
		},
		// 保存 元素顺序
		updateItemSequence(pro, index) {
			this.$confirm('确认保存吗?', '提示', {}).then(() => {
				let values = JSON.stringify(pro.content.items);
				let parameter = {
					id: pro.entity.id,
					title: pro.content.title,
					sub_title: pro.content.subTitle,
					style_type: pro.content.styleType,
					image_url: pro.content.imgURL,
					ext: pro.content.ext?JSON.stringify(obj.content.ext):'',
					values: values
				};
				updatePageBlock(parameter).then((res) => {
					if (res.data.success) {
						this.getPageEssInfo();
						this.$notify({
							type: 'success',
							message: '保存成功!'
						});
					} else {
						this.$notify.error({
							title: '失败',
							message: res.data.msg,
						});
					};
				})
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消保存'
				});
			});
		},
		changeMode() {
			this.focusShowMode = !this.focusShowMode
		},
		// 删除元素
		deleteItemInBlock(item, pro, index) {
			this.$confirm('确认删除吗?', '提示', {}).then(() => {
				console.log(1);
				this.$delete(pro.content.items, index);
				let values = JSON.stringify(pro.content.items);
				let parameter = {
					id: pro.entity.id,
					title: pro.content.title,
					sub_title: pro.content.subTitle,
					style_type: pro.content.styleType,
					image_url: pro.content.imgURL,
					ext: pro.content.ext?JSON.stringify(pro.content.ext):'',
					values: values
				};
				updatePageBlock(parameter).then((res) => {
					if (res.data.success) {
						this.getPageEssInfo();
						this.$notify({
							type: 'success',
							message: '删除成功!'
						});
					} else {
						this.$notify({
							title: '失败',
							message: res.data.msg,
						});
					};
				})
			}).catch((e) => {
				console.log(e);
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		addNewMapItem() {
			this.addition.push({
				key: '',
				value: '',
				desc: '',
				disabled: false,
				editable: true,
			})
		},
		addNewMapBlock() {
			this.blockAddition.push({
				key: '',
				value: '',
				desc: '',
				disabled: false,
				editable: true,
			})
		},
		delMapItem(item, index, addition){
			addition.splice(index, 1)
		},
		editMapItem(item, index, addition) {
			item.editable = true
		},
		// 编辑的 提交方法
		submitEditItemInBlock() {
			let value = this.editBlockInPageForm.items;
			if (this.selectLinkPrepend == 2 && this.newItemInBlockForm.link.indexOf('babyfs') < 0) {
				this.newItemInBlockForm.link = 'babyfs://' + this.newItemInBlockForm.link;
			}
			if (verification.name.test(this.newItemInBlockForm.name)) {
				this.$message.error('名称不能带空格')
				return;
			};
			this.addition.forEach((item) => {
				this.$delete(item, 'disabled')
				this.$delete(item, 'editable')
			});

			this.newItemInBlockForm['ext'] = []
			for (var i = 0; i < this.addition.length; i++) {
				let item = this.addition[i];
				if (item.key) {
					let oMap = {
						key: item.key,
						value: item.value,
						desc: item.desc
					}
					this.newItemInBlockForm['ext'].push(oMap)
				} else {
					break;
				}
			}
			value[this.editBlockInPageForm.itemIndex] = this.newItemInBlockForm;
			let values = JSON.stringify(value);
			let parameter = {
				id: this.editBlockInPageForm.id,
				title: this.editBlockInPageForm.title,
				sub_title: this.editBlockInPageForm.subTitle,
				style_type: this.editBlockInPageForm.styleType,
				link: this.editBlockInPageForm.link,
				image_url: this.editBlockInPageForm.image_url,
				ext: this.editBlockInPageForm.ext,
				values: values
			};
			updatePageBlock(parameter).then((res) => {
				if (res.data.success) {
					this.addition = [{
						key: '',
						value: '',
						desc: '',
						disabled: false,
						editable: true,
					}]
					this.getPageEssInfo();
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
				this.dialogItemInBlock = false;
			});
		},
		// 判断提交 新建 还是提交 修改
		judgeSubmitItemInBlock() {
			// 如果判定为 true 则为 提交新增。如果为 false 则为 提交编辑修改
			this.dialogItemFuncFlag ? this.submitNewItemInBlock('newItemInBlockForm') : this.submitEditItemInBlock('newItemInBlockForm');
		},
		changeBlockInPageType(value) {
			switch (value) {
				case '3':
					this.blockInPageStyle = [{
							value: '1',
							label: '两张并排'
						},
						{
							value: '2',
							label: '多张并排'
						}
					];
					break;
				case '5':
					this.blockInPageStyle = [{
							value: '2',
							label: '三张并排'
						},
						{
							value: '3',
							label: '2×2排列'
						}
					];
					break;
				default:
					return;
					break;
			}
		},
		// 搜索文章
		selectArticleRemoteMethod(query) {
			if (query !== '') {
				this.selectArticleLoading = true;
				let temp = Number(query);
				let parameter = {};
				if (temp) {
					parameter = {
						id: temp,
					};
				} else {
					parameter = {
						name: query,
					};
				};
				// 调用 加载列表的接口
				getArticleList(parameter).then((res) => {
					if (res.data.success) {
						this.selectArticleOptions = res.data.data.items.map((item) => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.title,
								subTitle: item.entity.subTitle,
								imageUrl: item.entity.imageUrl || '无',
							}
							return tempObj
						});
					} else {
						this.$message.error(res.data.msg || '未知错误，请联系管理员');
					};
					this.selectArticleLoading = false;
				});
			} else {
				this.selectArticleOptions = [];
			};
		},
		// 选择文章
		selectedArticle(value){
			this.$set(this.newItemInBlockForm, 'title', value.name)
			this.$set(this.newItemInBlockForm, 'subTitle', value.subTitle)
			this.$set(this.newItemInBlockForm, 'imgURL', value.imageUrl)
			this.newItemInBlockForm.link = 'babyfs://articleDetail?articleId=' + value.id
		}
	},
	filters: {
		// 关于 类型 转换的东西
		formatBlockType(type) {
			switch (type) {
				case 1:
					return '焦点图';
					break;
				case 2:
					return '导航';
					break;
				case 3:
					return '小图列表';
					break;
				case 4:
					return '横幅列表';
					break;
				case 5:
					return '推荐位';
					break;
				default:
					return '无';
					break;
			}
		},
	},
	watch: {
		dialogItemInBlock: {
			handler (newValue, oldValue) {
				if (!newValue) {
					this.selectArticle = ''
				}
			},
			deep: true
		}
	},
	created() {
		this.getPageEssInfo();
	},
}
</script>
<style scoped >
.PageDetialTitle {
	margin-left: 10px;
}

.list-complete-item {
	margin-top: 4px;
}

.demo-table-expand {
	font-size: 0;
}

.demo-table-expand label {
	width: 90px;
	color: #99a9bf;
}

.demo-table-expand .el-form-item {
	margin-right: 0;
	margin-bottom: 0;
	width: 50%;
}

.PageBlockDetail {
	margin-top: 15px;
	border-top: 1px solid #666;
	padding-top: 15px;
}

.el-carousel__item {
	opacity: 0.95;
	line-height: 300px;
	margin: 0;
}

.el-carousel__item img {
	width: 100%;
}

.image {
	width: 100%;
	display: block;
}

.bottom {
	margin-top: 13px;
	line-height: 12px;
}

.clearfix:before,
.clearfix:after {
	display: table;
	content: "";
}

.clearfix:after {
	clear: both
}
</style>
