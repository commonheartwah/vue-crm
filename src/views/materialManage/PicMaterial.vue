<template lang="html">
    <div class="picPage" v-loading='listLoading' :element-loading-text="listLoadingDesc">
        <el-row>
            <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
                <el-form :inline=true :model='filters'>
                    <el-form-item>
                        <el-input v-model='filters.id' placeholder='ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" @keydown.native.prevent.enter='loadList'></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model='filters.name' placeholder='图片名称' icon="circle-cross" :on-icon-click="handleIconClick_clearName" @keydown.native.prevent.enter='loadList'></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model='filters.tags' placeholder='标签' icon="circle-cross" :on-icon-click="handleIconClick_clearTags" @keydown.native.prevent.enter='loadList'></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model='filters.userId' placeholder='上传用户ID' icon="circle-cross" :on-icon-click="handleIconClick_clearUserId" @keydown.native.prevent.enter='loadList'></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type='primary' @click='loadList'>查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type='primary' @click='handleAdd'>上传</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
        <!-- 主体内容 -->
        <section id="main">
            <el-card class="pieces" v-for="(item, index) in data" :key="item" :body-style="{ padding: '0px' }">
                <img :src="item.entity.url" class="image" @click="showImg(item.entity.url)">
                <el-button type="text" class="button updataMaterial" @click="picUpdateFunc(item)">更新素材</el-button>
                <div class="underPlayer">
                    <p class="name">{{ item.entity.name }}</p>
                </div>
            </el-card>
        </section>
        <!-- 分页条 -->
        <el-col :span='24' class='toolbar'>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size=limit :total=totalCount style='float: right'></el-pagination>
        </el-col>
        <!-- 上传图片 -->
        <el-dialog title='图片上传' v-model='picFormVisible' :close-on-click-modal='false'>
            <!-- 图片上传组件 -->
            <CommonPicUpload v-on:tellParentChangeFlag="handleAdd"></CommonPicUpload>
        </el-dialog>
        <!-- 更新图片信息 -->
        <el-dialog title="更新素材" v-model="dialogPicUpdateVisible">
            <el-form :model="picUpdateForm">
                <el-form-item label="标题" :label-width="picUpdateWidth">
                    <el-input v-model="picUpdateForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label='素材标签' :label-width="picUpdateWidth">
                    <el-tag
                        :key="tag"
                        v-for="tag in picUpdateForm.dynamicTags"
                        :closable="true"
                        :close-transition="false"
                        @close="handleClose(tag)"
                        type="success"
                        style="margin:0 5px 0 0"
                    >
                        {{tag}}
                    </el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="mini"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                        style="width: 100px"
                        >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                </el-form-item>
                <el-form-item label="状态" :label-width="picUpdateWidth">
                    <el-radio v-model="picUpdateForm.status" label="1">有效</el-radio>
                    <el-radio v-model="picUpdateForm.status" label="0">无效</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogPicUpdateVisible=false">取 消</el-button>
                <el-button type="primary" @click="handleUpdate">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
	getMaterialsList,
	updateMaterial
} from '../../api/api';

import CommonPicUpload from '../../components/CommonPicUpload';

export default {
	components: {
		CommonPicUpload
	},
	data() {
		return {
			//ToolBar
			filters: {
				id: '',
				userId: '',
				name: '',
				tags: '',
			},
			//List
			listLoading: false,
			data: [],
			//pagination
			// 数据总量
			totalCount: 100 * 20,
			// 当前页码
			page: 1,
			// 分页每页显示多少数据
			limit: 1,
			//picFormVisible 默认picForm 上传的组件是不显示的 点击按钮以后显示 成功以后隐藏
			picFormVisible: false,
			//picUpdate
			dialogPicUpdateVisible: false,
			picUpdateForm: {
				id: '',
				name: '',
				dynamicTags: [],
				status: '',
			},
			inputVisible: false,
			inputValue: '',
			picUpdateWidth: '120px',
			// loading加载下方显示的文字描述
			listLoadingDesc: '努力加载中...'
		}
	},
	methods: {
		// 点击input后面的icon 清除内容
		handleIconClick_clearId() {
			this.filters.id = '';
		},
		handleIconClick_clearName() {
			this.filters.name = '';
		},
		handleIconClick_clearUserId() {
			this.filters.userId = '';
		},
		handleIconClick_clearTags() {
			this.filters.tags = '';
		},
		//pagination
		handleCurrentChange(val) {
			this.page = val;
			this.loadList();
		},
		// tags标签
		handleClose(tag) {
			this.picUpdateForm.dynamicTags.splice(this.picUpdateForm.dynamicTags.indexOf(tag), 1);
		},
		handleInputConfirm() {
			let inputValue = this.inputValue;
			if (inputValue) {
				this.picUpdateForm.dynamicTags.push(inputValue);
			}
			this.inputVisible = false;
			this.inputValue = '';
		},
		showInput() {
			this.inputVisible = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
		//Add
		handleAdd() {
			this.picFormVisible = !this.picFormVisible;
		},
		// picUpdate
		picUpdateFunc(item) {
			this.dialogPicUpdateVisible = true;
			this.picUpdateForm.id = item.entity.id;
			this.picUpdateForm.name = item.entity.name;
			this.picUpdateForm.status = item.entity.stat + '';
			if (item.entity.tags) {
				this.picUpdateForm.dynamicTags = item.entity.tags.split(',');
			} else {
				this.picUpdateForm.dynamicTags = [];
			}
		},
		// 确定提交
		handleUpdate(item) {
			this.dialogPicUpdateVisible = false;
			let para = {
				id: this.picUpdateForm.id,
				name: this.picUpdateForm.name,
				tags: this.picUpdateForm.dynamicTags.join(','),
				status: this.picUpdateForm.status
			}
			updateMaterial(para)
				.then((res) => {
					if (res.data.success) {
						this.$notify({
							title: '成功',
							message: '提交成功',
							type: 'success'
						});
						// 标签重置为空
						this.picUpdateForm.dynamicTags = [];
						this.loadList();
					} else {
						this.$notify({
							title: '错误',
							message: res.data.msg,
							type: 'error'
						});
					}
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
				})
		},
		// 显示大图
		showImg(url) {
			window.open(url);
		},
		//List
		loadList() {
			let para = {
				id: this.filters.id,
				name: this.filters.name,
				tags: this.filters.tags,
				user_id: this.filters.userId,
				type: '0',
				access_type: '0',
				page_index: this.page,
			}
			this.listLoading = true;
			getMaterialsList(para)
				.then((res) => {
					if (res.data.success) {
						this.data = res.data.data.items;
						this.limit = res.data.data.limit;
					} else {
						this.$notify({
							title: '错误',
							message: res.data.msg,
							type: 'error'
						})
					}
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
	},
	mounted() {
		this.loadList();
	}
}
</script>

<style lang="less" scoped>
.picPage {
    #main {
        width: 100%;
        min-height: 550px;
        display: flex;
        flex-wrap: wrap;
        .pieces {
            width: 18%;
            height: 260px;
            margin: 10px;
            position: relative;
            img {
                width: 100%;
                height: 200px;
            }
            .tag {
                font-size: 13px;
                color: #999;
            }
            .underPlayer {
                height: 20px;
                margin-top: 5px;
                padding: 0 14px 14px;
                display: flex;
                justify-content: center;
                .name {
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
            .updataMaterial {
                position: absolute;
                left: 20px;
                bottom: 0;
            }
        }
    }
}
</style>
