<template lang="html">
  <section class="updateContainer" style="width: 400px;">
    <el-form :model="avUpdateForm">
      <el-form-item label="标题" :label-width="avUpdateWidth">
        <el-input v-model="avUpdateForm.name" auto-complete="off" style="width:340px;"></el-input>
      </el-form-item>
      <el-form-item label='封面' class="preImg" :label-width="avUpdateWidth">
        <section v-loading="preImgLoading">
          <img :src="preImg" ref="preImg" :class="preImg == '../../../static/images/defaultPostAudioImg.png'?'defaultPoster':'noDefaultPoster'">
        </section>
      </el-form-item>
      <el-form-item label='上传' :label-width="avUpdateWidth">
        <el-upload
          class="upload-demo"
          ref='upload'
          drag
          name="bin"
          action="/op/material/upload_image"
          :multiple='false'
          :on-success="picSuccess"
          :on-change="picChange"
          :file-list="fileList"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label='标签' :label-width="avUpdateWidth" style="width:400px;">
        <el-tag
          :key="tag"
          v-for="tag in avUpdateForm.dynamicTags"
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
          style="width:100px;"
          @keydown.enter.native.prevent
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      </el-form-item>
      <el-form-item label='歌词' v-if="$route.query.type == 2" :label-width="avUpdateWidth">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model='avUpdateForm.content' style="width: 360px;"></el-input>
      </el-form-item>
      <el-form-item label="状态" :label-width="avUpdateWidth">
        <el-radio v-model="avUpdateForm.status" label="1">有效</el-radio>
        <el-radio v-model="avUpdateForm.status" label="0">无效</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="float: right">
      <el-button @click="goback">返回</el-button>
      <el-button type="success" @click="handleUpdate">确认更新</el-button>
    </div>
  </section>
</template>

<script>
import util from '../../common/js/util'
// 引入axios实例
import {
	getMaterialsList,
	updateMaterial
} from '../../api/api'

export default {
	data() {
		return {
			resource: '',
			// 更新表单
			avUpdateForm: {
				id: '',
				name: '',
				dynamicTags: [],
				status: '',
				content: ''
			},
			inputVisible: false,
			inputValue: '',
			avUpdateWidth: '100px',
			// 封面
			// src
			preImg: '',
			// preImg是否加载
			preImgLoading: false,
			// 文件队列
			fileList: []
		}
	},
	methods: {
		loadData() {
			let para = {
				id: this.$route.query.id
			}
			getMaterialsList(para)
				.then((res) => {
					if (res.data.success) {
						let resource = res.data.data.items[0];
						this.avUpdateForm = {
							id: this.$route.query.id,
							name: resource.entity.name,
							dynamicTags: [],
							status: resource.entity.stat + '',
							content: resource.entity.content
						}
						if (resource.entity.tags) {
							this.avUpdateForm.dynamicTags = resource.entity.tags.split(',');
						}
						if (resource.conf.posterImgUrl) {
							this.preImg = resource.conf.posterImgUrl;
						} else if (this.$route.query.type == 2) {
							this.preImg = '../../../static/images/defaultPostAudioImg.png';
						}
					} else {
						this.$notify({
							title: '错误',
							message: res.data.msg,
							type: 'error'
						})
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
		// 标签
		handleClose(tag) {
			this.avUpdateForm.dynamicTags.splice(this.avUpdateForm.dynamicTags.indexOf(tag), 1);
		},
		handleInputConfirm() {
			let inputValue = this.inputValue;
			if (inputValue) {
				this.avUpdateForm.dynamicTags.push(inputValue);
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
		handleUpdate() {
			let para = Object.assign({}, this.avUpdateForm);
			para['tags'] = para['dynamicTags'].join(',');
			delete para['dynamicTags'];
			if (this.preImg != '../../../static/images/defaultPostAudioImg.png') {
				para['poster_url'] = this.preImg;
			}
			para['content'] = this.avUpdateForm.content ? util.ReplaceSeperatorByEnter(this.avUpdateForm.content) : '';
			this.$confirm('确认并提交更新', '提示', {
					type: 'warning'
				})
				.then(() => {
					updateMaterial(para)
						.then((res) => {
							if (res.data.success) {
								this.$notify({
									title: '成功',
									message: '更新成功',
									type: 'success'
								});
								this.$router.go(-1);
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
				})
				.catch(() => {
					this.$notify({
						title: '提示',
						type: 'info',
						message: '取消上传'
					});
				})
		},
		goback() {
			this.$router.go(-1);
		},
		// 选择封面包含的方法
		picChange(file, fileList) {
			this.preImgLoading = true;
			if (fileList.length > 1) {
				fileList[0] = fileList[fileList.length - 1]
				fileList.length = 1;
			}
		},
		picSuccess(response, file) {
			if (response.success) {
				this.preImg = response.data;
				let self = this;
				this.$refs['preImg'].onload = function () {
					self.preImgLoading = false;
				}
			} else {
				this.$notify({
					title: '错误',
					message: response.msg,
					type: 'error'
				})
			}
		}
	},
	mounted() {
		this.loadData();
	}
}
</script>
<style lang="less" scoped>
.updateContainer {
    margin-top: 30px;
    position: relative;
    .preImg {
        width: 400px;
        height: 200px;
        section {
            width: 100%;
            height: 200px;
            display: flex;
            justify-content: center;
            align-items: center;
            .defaultPoster {
                width: 50%;
                height: 150px;
            }
            .noDefaultPoster {
                width: 100%;
                height: 200px;
            }
        }
    }
    .upload-demo {
        width: 400px;
    }
}
</style>
