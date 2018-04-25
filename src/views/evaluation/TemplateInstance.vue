<template>
<div id="templateIns">
	<!-- 预览 -->
	<div class="top" v-show="previewVisible">
		<div class="close" @click="previewVisible=!previewVisible">×</div>
		<iframe :src="ifSrc" width="800" height="400" id="game" name="abc"></iframe>
	</div>

	<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
		<el-form :inline=true :model='filters'>
			<el-form-item>
				<el-input v-model='filters.id' placeholder='模板实例 ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" @keydown.native.prevent.enter='loadList'></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model='filters.template_id' placeholder='模板 ID' icon="circle-cross" :on-icon-click="handleIconClick_clearTempId" @keydown.native.prevent.enter='loadList'></el-input>
			</el-form-item>
			<el-form-item>
				<el-input v-model='filters.name' placeholder='名称(必须输入全称)' icon="circle-cross" :on-icon-click="handleIconClick_clearName" @keydown.native.prevent.enter='loadList'></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type='primary' @click='loadList'>查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type='primary' @click='handleAdd()'>新增</el-button>
			</el-form-item>
		</el-form>
	</el-col>

	<el-table border :data="tempIns" highlight-current-row v-loading="listLoading" style="width: 100%;">
		<el-table-column prop="entity.id" label="模板实例 ID" width="135" sortable align='center'></el-table-column>
		<el-table-column prop="entity.templateId" label="模板 ID" width="105" sortable align='center'></el-table-column>
		<el-table-column prop="entity.type" label="类型" width="205" show-overflow-tooltip align='center' :formatter='formatType'></el-table-column>
		<el-table-column prop="entity.name" label="模板实例名称" show-overflow-tooltip align='center'></el-table-column>
		<el-table-column prop="entity.stat" label="状态" :formatter='formatStat' width="105" align="center"></el-table-column>
		<el-table-column label="操作" align="center" width="210">
			<template scope="scope">
          <el-button-group>
            <el-button type="info" size="small" @click="handlePreview(scope.$index, scope.row)">预览</el-button>
            <el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="warning" size="small" @click="handleCopy(scope.$index, scope.row)">复制</el-button>
          </el-button-group>
        </template>
		</el-table-column>
	</el-table>
	<el-col :span="24" class="toolbar" style="padding: 10px">
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="page_size" layout="prev, pager, next, jumper" :total="total" style="float: right;"></el-pagination>
	</el-col>
</div>
</template>

<script>
import {
	getPublicKvList, //获取类型用
	getTempById,
	getTempInsById,
	getTempInsList
} from '../../api/api'
export default {
	data() {
		return {
			/***
			 * filters 查询栏目
			 */
			filters: {
				id: '',
				template_id: '',
				name: ''
			},
			/***
			 * table 绑定的数据
			 */
			tempIns: [],
			/***
			 * 列表加载
			 */
			listLoading: false,
			/**
			 * 分页
			 */
			currentPage: 1,
			page_size: 20,
			total: 0,
			// 预览
			ifSrc: '',
			previewVisible: false,
			// 所有的type类型
			allTypes: '',
		}
	},
	methods: {
		/**
		 * 初始化请求获取模板实例的type类型
		 */
		initType() {
			getPublicKvList({
				name: '_sys.template_sub_type'
			}).then((res) => {
				console.log(res);
				if (res.data.success) {
					this.allTypes = JSON.parse(res.data.data.content).types
				} else {
					this.$notify({
						title: '获取KVconf类型错误',
						type: 'error',
						message: res.data.msg
					})
				}
			})
		},
		/**
		 * 查询栏目 点击清除input框
		 */
		handleIconClick_clearId() {
			this.filters.id = ''
		},
		handleIconClick_clearTempId() {
			this.filters.template_id = ''
		},
		handleIconClick_clearName() {
			this.filters.name = ''
		},
		handleAdd() {
			this.$router.push({
				path: '/AddTemplateInstance'
			})
		},
		/***
		 * 加载数据
		 */
		loadList() {
			let para = {
				id: this.filters.id,
				name: this.filters.name,
				template_id: this.filters.template_id,
				page_size: this.page_size,
				page_index: this.currentPage
			}
			getTempInsList(para).then((res) => {
				this.tempIns = res.data.data.items
				this.total = res.data.data.totalCount
			})
		},
		/***
		 * stat 数字转换状态
		 */
		formatStat(row, column) {
			return row.entity.stat == 1 ? '有效' : row.entity.stat == 0 ? '无效' : '未知';
		},
		/***
		 * 列表操作区域
		 * 编辑
		 * 预览
		 */
		handleEdit(index, row) {
			this.$router.push({
				path: '/AddTemplateInstance',
				query: {
					id: row.entity.id,
					template_id: row.entity.templateId,
					_next: 'updateTempIns'
				}
			})
		},
		/***
		 * 预览方式直接通过模板htmlUrl拼接模板实例id的形式实现
		 */
		handlePreview(index, row) {
			this.ifSrc = ""
			this.previewVisible = false
			let gameDom = document.querySelector('#game')
			let beginReload = 'abc'
			getTempById({
				id: row.entity.templateId
			}).then((res) => {
				if (res.data.success) {
					if (res.data.data.entity.htmlUrl) {
						this.ifSrc = `${res.data.data.entity.htmlUrl}?tem_ins_id=${row.entity.id}`
						gameDom.contentWindow.postMessage(beginReload, '*')
						this.previewVisible = true
					} else {
						this.$notify({
							message: '模板未配置htmlUrl,无法预览',
							type: 'warning',
							title: '警告'
						})
					}
				}
			})
		},
		/**
		 * 复制模版
		 */
		handleCopy(index, item) {
			this.$router.push({
				path: '/AddTemplateInstance',
				query: {
					id: item.entity.id,
					template_id: item.entity.templateId,
					_next: 'updateTempIns',
					isCopy: true
				}
			})
		},
		/**
		 * 分页查询
		 */
		handleSizeChange(val) {
			// console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(val) {
			this.currentPage = val
			this.loadList();
			// 点击分页的时候关闭预览
			this.previewVisible = false
		},
		/**
		 * 根据type值渲染不同的type名称
		 */
		formatType(row, column) {
			let type = row.entity.type
			for (let i = 0; i <= this.allTypes.length; i++) {
				if (this.allTypes[i]['index'] == type) {
					return this.allTypes[i]['name']
				}
			}
		}
	},
	mounted() {
		this.initType()
		this.loadList()
	},
}
</script>

<style lang="less" scoped>
#templateIns {
    position: relative;
    .top {
        width: 800px;
        height: 400px;
        overflow: scroll; // border: 1px solid #000;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -400px;
        margin-top: -200px;
        z-index: 999;
        background-color: #fff;
        .close {
            width: 30px;
            height: 30px;
            line-height: 30px;
            font-size: 36px;
            position: absolute;
            right: 0;
            top: 0;
            color: #666;
            &:hover {
                color: red;
            }
        }
    }
}
</style>
