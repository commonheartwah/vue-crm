<template>
<div class="createPost-container">
	<el-form class="form-container" :model="postForm" ref="postForm">

		<Sticky :className="'sub-navbar '+statusClass">
			<template v-if="fetchSuccess">
				<el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布</el-button>
			</template>
			<template v-else>
          		<el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
        	</template>
		</Sticky>
		<div class="createPost-main-container">
			<el-row>
				<el-col :span="21">
					<el-form-item style="margin-bottom: 40px;">
						<MDinput name="name" v-model="postForm.title" required :maxlength="100">
							标题
						</MDinput>
					</el-form-item>
					<!-- <el-form-item style="margin-bottom: 40px;" prop="title">
						<MDinput name="name" v-model="postForm.sub_title" :maxlength="100">
							副标题
						</MDinput>
					</el-form-item> -->
					<div class="postInfo-container">
						<el-row>
							<el-col :span="8">
								<el-form-item label-width="45px" label="状态:" class="postInfo-container-item">
									<el-select placeholder="请选择" v-model="postForm.del">
										<el-option key="1" label="有效" value="0"></el-option>
										<el-option key="0" label="无效" value="1"></el-option>
									</el-select>
								</el-form-item>
							</el-col>

							<el-col :span="8">
								<el-form-item label-width="45px" label="时间:" class="postInfo-container-item">
									<el-date-picker v-model="showTime" align="left" type="date" placeholder="选择日期"></el-date-picker>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-col>
			</el-row>

			<div class="editorContent" ref="editorContent">
				<div class="editor-container">
					<Tinymce :height='520' :width="editorWidth" ref="editor" v-model="postForm.content" :toolbar="toolbar"></Tinymce>
				</div>
			</div>
		</div>
	</el-form>
</div>
</template>

<script>
import Tinymce from '../../components/Tinymce'
import MDinput from '../../components/MDinput';

import {
	addPromoterWiki,
	updatePromoterWiki,
	getPromoterWikiList,
} from '../../api/api';
import util from '../../common/js/util'

export default {
	name: 'articleDetail',
	components: {
		Tinymce,
		MDinput,
	},
	data() {
		const validateRequire = (rule, value, callback) => {
			if (value === '') {
				this.$message({
					message: rule.field + '为必传项',
					type: 'error'
				});
				callback(null)
			} else {
				callback()
			}
		};
		return {
			postForm: {
				title: '', // 知识库题目
				type: '', // 知识库类型
				del: "0", // 知识库状态
				content: '', // 知识库类型内容
			},
			showTime: new Date(), // 知识库时间
			statusClass: 'draft', // 样式分隔
			fetchSuccess: true,
			loading: false,
			userLIstOptions: [],

			toolbar: ['undo redo | insert | styleselect | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | h2 p ', 'media | forecolor backcolor| bold italic | link | codesample | image uploadimage | fontsizeselect']
		}
	},
	computed: {
		contentShortLength() {
			return this.postForm.description.length
		},
		isEdit() {
			return this.$route.query.id // 根据meta判断
		},
		editorWidth() {
			let width = document.querySelector('body').offsetWidth - 300
			return width
		}
	},
	created() {
		if (this.isEdit) {
			this.statusClass = 'published';
			this.fetchData();
		} else {
			this.postForm.type = this.$route.query.type;
		}
	},
	methods: {
		fetchData() {
			let parameter = {
				id: this.$route.query.id
			}
			getPromoterWikiList(parameter).then(res => {
				if (res.data.success) {
					this.postForm = res.data.data.items[0].entity;
					this.showTime = new Date(res.data.data.items[0].entity.showTime);
					this.postForm['del'] += '';
				}
			}).catch((error) => {
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
				this.fetchSuccess = false;
			});
		},
		submitForm() {
			this.$refs.postForm.validate(valid => {
				if (valid) {
					this.loading = true;
					this.postForm.time = Date.parse(this.showTime)
					if (this.isEdit) {
						updatePromoterWiki(this.postForm)
							.then((res) => {
								if (res.data.success) {
									this.$notify({
										title: '成功',
										message: '发布知识库文章成功',
										type: 'success',
										duration: 2000
									});
									this.statusClass = 'published';
									this.$router.go(-1);
								} else {
									this.$notify({
										title: '失败',
										message: res.data.msg,
										type: 'error',
										offset: 45
									});
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
								this.loading = false;
							});
					} else {
						addPromoterWiki(this.postForm)
							.then((res) => {
								if (res.data.success) {
									this.$notify({
										title: '成功',
										message: '发布知识库文章成功',
										type: 'success',
										duration: 2000
									});
									this.statusClass = 'published';
									this.$router.go(-1);
								} else {
									this.$notify({
										title: '失败',
										message: res.data.msg,
										type: 'error',
										offset: 45
									});
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
								this.loading = false;
							});
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
	},
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
::-webkit-scrollbar {
    display: none;
}
.title-prompt {
    position: absolute;
    right: 0;
    font-size: 12px;
    top: 10px;
    color: #ff4949;
}
.createPost-container {
    position: relative;
    .createPost-main-container {
        padding: 40px 45px 20px 50px;
        .postInfo-container {
            position: relative;
            @include clearfix;
            margin-bottom: 10px;
            .postInfo-container-item {
                float: left;
            }
        }
        .editorContent {
            display: flex;
            justify-content: space-between;
            .editor-container {
                height: 667px;
                width: auto;
                .editor-upload-btn-container {
                    text-align: right;
                    margin-right: 10px;
                    .editor-upload-btn {
                        display: inline-block;
                    }
                }
            }
        }
    }
    .word-counter {
        width: 40px;
        position: absolute;
        right: -10px;
        top: 0;
    }
}
</style>
