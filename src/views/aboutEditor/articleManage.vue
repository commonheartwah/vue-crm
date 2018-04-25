<template lang="html">
	<section>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
		    <el-form :inline='true' :model='filters'>
			    <el-form-item >
				    <el-input v-model='filters.id' placeholder='请输入 ID' @keydown.enter.native.prevent @change="handleSeek" icon="circle-cross" :on-icon-click="handleIconClickId"></el-input>
			    </el-form-item>
			    <el-form-item >
				    <el-input v-model='filters.title' placeholder='请输入名称'  @keydown.enter.native.prevent @change="handleSeek" icon="circle-cross" :on-icon-click="handleIconClickName"></el-input>
			    </el-form-item>
			    <el-form-item >
				    <el-input v-model='filters.category_id' placeholder='请输入父栏目 ID'  @keydown.enter.native.prevent @change="handleSeek" icon="circle-cross" :on-icon-click="handleIconClickCategoryid"></el-input>
			    </el-form-item>
			    <el-form-item   >
				    <el-input v-model='filters.author_id' placeholder='请输入作者 ID'  @keydown.enter.native.prevent @change="handleSeek" icon="circle-cross" :on-icon-click="handleIconClickAuthorId"></el-input>
			    </el-form-item>
			    <el-form-item>
				    <el-button type='primary' @click='handleSeek'>查询</el-button>
			    </el-form-item>
		    </el-form>
		</el-col>
		<el-table :data='formData' v-loading='listLoading' style='width: 100%;' border stripe tooltip-effect='light'>
			<el-table-column type="expand" fixed>
				<template scope="scope" >
					<figure class="formExpand">
            			<img :src="scope.row.imageUrl ? scope.row.imageUrl : '../../static/images/defaultPicInElementVideo.jpg'" class="CourseImage">
              			<figcaption>
							<p><span>文章标题：</span>{{ scope.row.title }}</p>
							<p><span>文章副标题：</span>{{ scope.row.subTitle }}</p>
                			<p><span>文章类型：</span>{{ scope.row.type | formatType }}</p>
							<p><span>文章状态：</span>{{ scope.row.stat | formatStat}}</p>
							<p><span>文章作者：</span>{{ scope.row.author}}</p>
            	  			<p><span>作者&nbsp&nbsp&nbspID：</span>{{ scope.row.authorId }}</p>
							<p><span>所属栏目：</span>{{ scope.row.category}}</p>
							<p><span>栏目&nbsp&nbsp&nbspID：</span>{{ scope.row.categoryId}}</p>
              			</figcaption>
          			</figure>
        		</template>
			</el-table-column>
			<el-table-column prop='id' label='ID' width='75' sortable align='center' fixed></el-table-column>
			<el-table-column prop='title' label='标题' show-overflow-tooltip align='center' width='380'></el-table-column>
			<el-table-column prop='category' label='父栏目' width='200' align='center' :formatter='formatCategoryid'></el-table-column>
			<el-table-column prop='author' label='作者' width='100' align='center'></el-table-column>
			<el-table-column prop='type' label='类型' width='100' align='center' :formatter='formatType'></el-table-column>
			<el-table-column prop='stat' label='状态' width='80' align='center' :formatter='formatStat'></el-table-column>
			<el-table-column label='发布时间' width='170' align='center' :formatter='formatDate'></el-table-column>
			<el-table-column fixed="right" label='操作' width='135' align='center'>
				<template scope="scope">
					<el-button type="text" size="small" @click="editArticle(scope.$index, scope.row)">编辑</el-button>
	        		<el-button type="text" size="small" @click="createLink(scope.$index, scope.row, scope)" >查看链接</el-button>
		    	</template>
			</el-table-column>
		</el-table>
		<el-col :span='24' class='toolbar'>
      		<el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='20' :total='total' style='float: right'></el-pagination>
    	</el-col>

		<!-- 生成链接 -->
		<el-dialog title="查看链接" :visible.sync="createLinkFlag">
			<el-input v-model='generatedLink'></el-input>
			<span slot="footer" class="dialog-footer">
  		    	<!-- <el-button @click="createLinkFlag = false">关 闭</el-button> -->
  		    	<el-button type="primary" @click="copyLink" ref="copyLinkBtn">复制并关闭</el-button>
  		  </span>
		</el-dialog>
	</section>
</template>

<script>
import util from '../../common/js/util'

import {
	getArticleList
} from '../../api/api';
var Clipboard = require('clipboard');

export default {
	data() {
		return {
			filters: {
				id: '',
				title: '',
				category_id: '',
				author_id: ''
			},
			// 文章列表数据
			formData: [],
			listLoading: false,
			// 分页
			page_index: 1,
			total: 0,
			// 复制链接窗口
			createLinkFlag: false,
			// 复制文本插件实例
			clipboard: null,
			// 生成的链接
			generatedLink: ''
		}
	},
	methods: {
		loadData() {
			if (this.$route.query.articleId) {
				this.filters.category_id = this.$route.query.articleId;
			}
			let parameter = {
				id: this.filters.id,
				title: this.filters.title,
				page_index: this.page_index,
				category_id: this.filters.category_id,
				author_id: this.filters.author_id
			};
			getArticleList(parameter)
				.then((res) => {
					if (res.data.success) {
						if (res.data.data.items) {
							this.formData = [];
							res.data.data.items.forEach((item) => {
								let tempObj = item.entity;
								if (item.conf) {
									tempObj['conf'] = item.conf;
								};
								this.formData.push(tempObj);
							});
						};
						this.total = res.data.data.totalCount;
					} else {
						this.$notify.error(res.data.msg);
					};
					this.listLoading = false;
				})
				.catch((error) => {
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
					this.listLoading = false;
				})
		},
		// 查找的方法
		handleSeek() {
			this.loadData();
		},
		// 查询项清空数据
		handleIconClickId() {
			this.filters.id = '';
			this.handleSeek();
		},
		handleIconClickName() {
			this.filters.title = '';
			this.handleSeek();
		},
		handleIconClickCategoryid() {
			this.filters.category_id = '';
			this.handleSeek();
		},
		handleIconClickAuthorId() {
			this.filters.author_id = '';
			this.handleSeek();
		},
		// 格式化类型
		formatCategoryid(row) {
			return row.category ? row.category : '无父栏目'
		},
		formatType(row) {
			return row.type == 0 ? '普通' : '其他';
		},
		formatStat(row) {
			return row.stat ? '有效' : '无效';
		},
		formatDate(row) {
			return util.formatDate.format(new Date(row.ct), 'yyyy/MM/dd hh:mm:ss');
		},
		// 分页
		handleCurrentChange(val) {
			this.listLoading = true;
			this.page_index = val;
			this.loadData();
		},

		// 编辑文章
		editArticle(index, row) {
			this.$router.push({
				name: '富文本',
				query: {
					articleId: row.id
				}
			})
		},
		/**
		 * [createLink 生成链接]
		 * @return {[type]}       [description]
		 */
		createLink(index, row, scope) {
			this.generatedLink = 'https://m.babyfs.cn/#/articleDetail?articleId=' + row.id;
			this.createLinkFlag = true;
		},
		copyLink() {
			var _this = this;
			this.clipboard.text = function() {
				return '内部培训资料，请勿外传:' + _this.generatedLink;
			}
			//复制成功执行的回调
			this.clipboard.on('success', function(e) {
				_this.$message({
					type: 'success',
					message: '链接复制成功!'
				});
			});
			//复制失败执行的回调
			this.clipboard.on('error', function(e) {
				_this.$message({
					type: 'error',
					message: '链接复制失败'
				});
			});
			this.createLinkFlag = false;
		},
		/**
		 * [initClipboard 初始化复制文本插件实例]
		 * @return {[type]} [description]
		 */
		initClipboard() {
			this.$nextTick(() => {
				this.clipboard = new Clipboard(this.$refs.copyLinkBtn.$el)
			})
		}
	},
	filters: {
		formatTime(date) {
			if (date === undefined) {
				return
			}
			if (date === 0) {
				return '/'
			}
			return util.formatDate.format(new Date(date), 'yyyy/MM/dd   hh:mm:ss');
		},
		formatType(row) {
			return row == 0 ? '普通' : '其他';
		},
		formatStat(row) {
			return row ? '有效' : '无效';
		},
	},
	mounted() {
		this.loadData();
		this.initClipboard();
	}
}
</script>

<style lang="css" scoped>
.formExpand {
	width: 800px;
	margin-left: 100px;
	display: flex;
	justify-content: space-around;
}
.formExpand figcaption{
	float: right;
	width: 340px;
	line-height: 25px;
}
.formExpand .CourseImage {
	width: 200px;
	height: 200px;
	border: 1px solid #d1dbe5;
	border-radius: 4px;
	padding: 10px;
	box-shadow: 0 0 3px #666;
}
</style>
