<template>
<div class="createPost-container">
	<el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

		<Sticky :className="'sub-navbar '+statusClass">
			<template v-if="fetchSuccess">
				<!-- <el-button type="warning" @click="previewForm">预览</el-button> -->
				<el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">发布</el-button>
			</template>
			<template v-else>
          		<el-tag>发送异常错误,刷新页面,或者联系程序员</el-tag>
        	</template>
		</Sticky>
		<div class="createPost-main-container">
			<el-row>
				<el-col :span="21">
					<el-form-item style="margin-bottom: 40px;" prop="title">
						<MDinput name="name" v-model="postForm.title" required :maxlength="100">
							标题
						</MDinput>
					</el-form-item>
					<el-form-item style="margin-bottom: 40px;" prop="title">
						<MDinput name="name" v-model="postForm.sub_title" :maxlength="100">
							副标题
						</MDinput>
					</el-form-item>
					<div class="postInfo-container">
						<el-row>
							<el-col :span="8">
								<el-form-item label-width="45px" label="状态:" class="postInfo-container-item">
									<el-select placeholder="请选择" v-model="postForm.status">
										<el-option key="1" label="有效" value="1"></el-option>
										<el-option key="0" label="无效" value="0"></el-option>
									</el-select>
								</el-form-item>
							</el-col>

							<el-col :span="8">
								<el-form-item label-width="45px" label="类型:" class="postInfo-container-item">
									<el-select placeholder="请选择" v-model="postForm.type">
										<el-option key="0" label="普通" value="0"></el-option>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-col>
			</el-row>

			<el-form-item style="margin-bottom: 40px;" label-width="45px" label="摘要:" :span="21">
				<el-input type="textarea" class="article-textarea" :rows="1" autosize placeholder="请输入内容" v-model="postForm.description">
				</el-input>
				<span class="word-counter" v-show="contentShortLength">{{contentShortLength}}字</span>
			</el-form-item>

			<div class="editorContent" ref="editorContent">
				<div class="editor-container" >
					<Tinymce :height='520' :width="editorWidth" ref="editor" v-model="postForm.content"></Tinymce>
				</div>
				<div class="mobile">
					<div class="article">
						<div class="titLine">
							<h1 class="tit">{{ preview.previewTitle }}</h1>
						</div>
						<div class="rich-text" v-html="preview.previewContent" ref="richText"></div>
					</div>
				</div>
			</div>
			<div style="margin: 20px 0;">
				<Upload v-model="postForm.image_url"></Upload>
			</div>
		</div>
	</el-form>
</div>
</template>

<script>
import Tinymce from '../../components/Tinymce'
import Upload from '../../components/Upload/singleImage3'
import MDinput from '../../components/MDinput';

import {
	addNewArticle,
	updateArticle,
	getArticleItem,
} from '../../api/api';

export default {
	name: 'articleDetail',
	components: {
		Tinymce,
		MDinput,
		Upload
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
				title: '', // 文章题目
				sub_title: '', // 文章副标题
				description: '', // 文章描述
				content: '', // 文章内容
				category_id: '', // 文章栏目ID
				type: '0', // 文章类型
				status: '1', // 文章状态
				image_url: '', // 文章图片
			},
			preview: {
				previewTitle: '',
				previewContent: ''
			},
			statusClass: 'draft', // 样式分隔
			fetchSuccess: true,
			loading: false,
			userLIstOptions: [],
			platformsOptions: [{
					key: 'a-platform',
					name: 'a-platform'
				},
				{
					key: 'b-platform',
					name: 'b-platform'
				},
				{
					key: 'c-platform',
					name: 'c-platform'
				}
			],
			rules: {
				image_url: [{
					validator: validateRequire
				}],
				title: [{
					validator: validateRequire
				}],
				content: [{
					validator: validateRequire
				}]
			}
		}
	},
	computed: {
		contentShortLength() {
			return this.postForm.description.length
		},
		isEdit() {
			return this.$route.query.articleId // 根据meta判断
		},
		editorWidth() {
			let width = document.querySelector('body').offsetWidth - 700
			return width
		}
	},
	created() {
		if (this.isEdit) {
			this.statusClass = 'published';
			this.fetchData();
		} else {
			this.postForm.category_id = this.$route.query.categoryId;
		}
	},
	methods: {
		fetchData() {
			let parameter = {
				id: this.$route.query.articleId
			}
			getArticleItem(parameter).then(res => {
				if (res.data.success) {
					res.data.data.entity['conf'] = res.data.data.conf;
					this.postForm = res.data.data.entity;
					this.$set(this.postForm, 'image_url', this.postForm.imageUrl || '');
					this.$set(this.postForm, 'sub_title', this.postForm.subTitle || '');
					this.$set(this.postForm, 'category_id', this.postForm.categoryId);
					this.$set(this.postForm, 'status', this.postForm.stat + '');
					this.postForm['type'] += '';
					this.$set(this.postForm, 'description', res.data.data.entity.description || '');
					this.$delete(this.postForm, 'imageUrl');
					this.$delete(this.postForm, 'subTitle');
					this.$delete(this.postForm, 'categoryId');
					this.$delete(this.postForm, 'stat');
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
					if (this.isEdit) {
						this.postForm.content = this.postForm.content.replace(/!important/g, "")
						updateArticle(this.postForm)
							.then((res) => {
								if (res.data.success) {
									this.$notify({
										title: '成功',
										message: '发布文章成功',
										type: 'success',
										duration: 2000
									});
								} else {
									this.$notify({
										title: '失败',
										message: res.data.msg,
										type: 'error',
										offset: 45
									});
								};
								this.statusClass = 'published';
								this.loading = false;
								this.$router.go(-1);
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
						this.postForm.content = this.postForm.content.replace(/!important/g, "")
						addNewArticle(this.postForm)
							.then((res) => {
								if (res.data.success) {
									this.$notify({
										title: '成功',
										message: '发布文章成功',
										type: 'success',
										duration: 2000
									});
								} else {
									this.$notify({
										title: '失败',
										message: res.data.msg,
										type: 'error',
										offset: 45
									});
								};
								this.statusClass = 'published';
								this.loading = false;
								this.$router.go(-1);
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
		previewForm() {
			this.preview.previewTitle = this.postForm.title
			this.preview.previewContent = this.postForm.content
			this.$nextTick(() => {
				var audios = this.$refs.richText.querySelectorAll('audio')
				for (var i = 0; i < audios.length; i++) {
					var item = audios[i];
					var audioPlayer = document.createElement('div')
					var audioParent = item.parentNode;
					audioPlayer.innerHTML =
						`<div style="width: 100%;
													background-color: #fcfcfc;
													display: flex;
													justify-content:flex-start;
													align-items: center;
													border: 1px solid #e2e2e2;
													border-radius:1px;
													margin: 10px 0;
													padding: 10px 0;">
							<aside style="width: 15%;margin: 0 15px;"><img style="width: 100%;" src="http://i.s.babyfs.cn/op/1/41b0024e9fcb4f9b869c2539a9455713.png" alt="" ></aside><div style="width: 75%;text-align: left;">
								<p style="font-size: 14px;line-height: 20px;">儿歌音频</p>
								<p style="font-size: 12px;line-height: 20px;color: #bbbbbb;">来自宝宝玩英语</p>
								<p style="font-size: 14px;line-height: 20px;width: 95%;height: 1px; background-color: #ebebeb;margin: 5px 0;display: flex;align-items: center;">
									<i style="display: inline-block;width: 0;background-color: black;height: 1px;"></i>
								</p>
								<p style="font-size: 12px;line-height: 20px;color: #bbbbbb;display: flex;justify-content: space-between;padding-right: 10px;">
									<span>00:00</span>
									<span>00:00</span>
								</p>
							</div>
						  <div>`
					audioParent.replaceChild(audioPlayer, item)
				}

				var videos = this.$refs.richText.querySelectorAll('video')
				for (var i = 0; i < videos.length; i++) {
					var item = videos[i];
					var videoPlayer = document.createElement('div')
					var videoParent = item.parentNode;
					videoPlayer.innerHTML =
						`<img src="http://i.s.babyfs.cn/op/1/f9a5abf124104893a161a5d21e7672d2.jpg" alt="">`
					videoParent.replaceChild(videoPlayer, item)
				}

				var imgs = this.$refs.richText.querySelectorAll('img')
				for (var i = 0; i < imgs.length; i++) {
					let item = imgs[i]
					item.style.width = '100%'
					item.style.height = 'auto'
					item.style.margin = '10px 0';
				}
			})
		},
		draftForm() {
			if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
				this.$message({
					message: '请填写必要的标题和内容',
					type: 'warning'
				});
				return;
			}
			this.$message({
				message: '保存成功',
				type: 'success',
				showClose: true,
				duration: 1000
			});
		},
	},
	watch: {
		postForm: {
			handler(newVal, oldVal) {
				this.previewForm()
			},
			deep: true
		}
	}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
::-webkit-scrollbar{
  display:none;
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
					.mobile {
							width: 330px;
							height: 667px;
							background-image: url("../../../static/images/iphone.png");
							background-size: 100% 100%;
							position: relative;
							.article {
									position: absolute;
									top: 122px;
									left: 19px;
									background-color: #fff;
									width: 293px;
									height: 470px;
									overflow-y: scroll;
									overflow-x: hidden;
									.titLine {
											margin: 0 10px;
											border-bottom: 1px solid #dddddd;
									}

									h1.tit {
											margin: 20px 0 15px 5px;
											font-size: 18px;
											word-break: normal;
									}

									h2.tit {
											margin: 8px 15px;
											font-size: 22px;
											font-weight: normal;
											color: #A6937C;
											word-break: normal;
									}
									.rich-text {
											padding: 5px;
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
