<template lang="html">
  <section class="avUploadPage">
    <el-form :model='avForm' label-width='100px' :rules='avFormRules' ref='avForm' >
      <el-form-item label="素材类型">
        <el-input v-model="avForm.type" disabled style="width:300px;"></el-input>
      </el-form-item>
      <el-form-item label="访问类型" prop="access_type" >
        <el-select v-model="avForm.access_type" placeholder="请选择素材访问类型" style="width:300px;">
          <el-option label="公开" value="0"></el-option>
          <el-option label="私有" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="加密类型">
        <el-select v-model="avForm.encode_encrypt" placeholder="请选择素材加密类型" style="width:300px;">
          <el-option label="非加密" value="0"></el-option>
          <el-option label="加密" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='素材名称' prop='name' style="width:400px;">
        <el-input v-model='avForm.name' placeholder='请输入素材名称' @keydown.enter.native.prevent></el-input>
      </el-form-item>
      <el-form-item label='歌词内容' v-if="$route.query.type == 2">
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model='avForm.content'></el-input>
      </el-form-item>
      <el-form-item label='素材标签' prop='dynamicTags' style="width:600px;">
        <div>
          <el-tag
            :key="tag"
            v-for="tag in avForm.dynamicTags"
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
            style="width: 100px;"
            @keydown.enter.native.prevent
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
        </div>
      </el-form-item>
      <el-form-item label='封面预览'>
        <div v-loading="preImgLoading" :class="preImg != '../../../static/images/defaultPostAudioImg.png' ? 'preImg' : 'defaultImg'">
          <img :src="preImg" alt="" ref="preImg">
        </div>
      </el-form-item>
      <el-form-item label="选择封面" style="margin-top: 50px;">
        <el-upload
          class="upload-demo"
          ref='uploadPoster'
          name="bin"
          action="/op/material/upload_image"
          :multiple='false'
          :on-success="handlePosterSuccess"
        >
          <el-button size="small" type="primary">选择文件</el-button>
          <div class="el-upload__tip" slot="tip">只能选择jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label='上传音视频'>
        <el-upload
        class="upload-demo"
        ref="upload"
        action='https://upload.qbox.me'
        :data='kongObj'
        :on-change="handleChange"
        :file-list="fileList"
        :auto-upload="false"
        :on-success='handleSuccess'>
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitAvUpload">上传</el-button>
          <div slot="tip" class="el-upload__tip">只支持单个文件上传,音频必须为mp3,视频必须为mp4</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </section>
</template>
<script>
// util工具包
import util from '../../common/js/util'
// 引入axios实例
import {
	getUploadToken,
	goCallback
} from '../../api/api'
// 引入vue-core-image-upload
import VueCoreImageUpload from 'vue-core-image-upload';
export default {
	components: {
		VueCoreImageUpload
	},
	data() {
		return {
			fileList: [],
			avForm: {
				type: '',
				access_type: '',
				name: '',
				dynamicTags: [],
				encode_encrypt: '',
				content: ''
			},
			avFormRules: {
				access_type: [{
					required: true,
					message: '请选择素材访问类型',
					trigger: 'change'
				}],
				name: [{
					required: false,
					message: '请输入素材名称',
					trigger: 'blur'
				}],
			},
			picUpLoading: false,

			kongObj: {}, // 空对象 绑定到上传的data上
			// tags 标签
			inputVisible: false,
			inputValue: '',
			// vue-core-image-upload src
			preImg: '../../../static/images/defaultPostAudioImg.png',
			// preImg是否加载
			preImgLoading: false,
		}
	},
	methods: {
		makeSureFromWhere() {
			switch (this.$route.query.type) {
			case '1':
				this.avForm.type = '视频';
				break;
			case '2':
				this.avForm.type = '音频';
				break;
			}
		},
		// tags标签
		handleClose(tag) {
			this.avForm.dynamicTags.splice(this.avForm.dynamicTags.indexOf(tag), 1);
		},
		showInput() {
			this.inputVisible = true;
			this.$nextTick(_ => {
				this.$refs.saveTagInput.$refs.input.focus();
			});
		},
		handleInputConfirm() {
			let inputValue = this.inputValue;
			if (inputValue) {
				this.avForm.dynamicTags.push(inputValue);
			}
			this.inputVisible = false;
			this.inputValue = '';
		},
		handlePosterSuccess(response, file) {
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
		},
		//素材提交on-change 对应的函数 文件状态改变的时候触发
		handleChange(file, fileList) {
			if (fileList.length > 1) {
				fileList[0] = fileList[1]
				fileList.length = 1;
				this.$notify({
					title: '警告',
					message: '只支持单个文件上传，文件被替换',
					type: 'warning'
				})
			}
			var reg
			console.log(this.$route.query.type);
			if (this.$route.query.type == '1') {
				reg = /\.mp4$/
			} else {
				reg = /\.mp3$/
			}
			var str = fileList[0].name;
			if (!reg.test(str)) {
				this.$notify({
					type: 'error',
					message: fileList[0].name + '不符合上传规则',
					title: '错误'
				})
				fileList.splice(0, 1);
			}
		},
		// 素材上传提交
		submitAvUpload() {
			// 判断上传规则是否全部满足
			this.$refs.avForm.validate((valid) => {
				if (valid) {
					// 判断点击上传按钮之前是否选择了素材 是 => 上传 否 => 提示
					if (this.$refs.upload.uploadFiles[0]) {
						// 判断是否使用默认的封面图片 已经选择封面的画直接提交
						if (this.preImg == '../../../static/images/defaultPostAudioImg.png') {
							this.$confirm('确认使用默认封面吗', '提示', {
								type: 'warning'
							}).then(() => {
								this.getTokenThenSubmit();
							}).catch(() => {
								this.$notify({
									title: '提示',
									message: '取消上传',
									type: 'info'
								});
							})
						} else {
							this.$confirm('再次确认您选择的封面和素材?', '提示', {
								type: 'warning'
							}).then(() => {
								this.getTokenThenSubmit();
							}).catch(() => {
								this.$notify({
									title: '提示',
									message: '取消上传',
									type: 'info'
								});
							})
						}
					} else {
						this.$notify({
							title: '错误',
							message: '请选择素材',
							type: 'error'
						})
					}

				}
			})
		},
		getTokenThenSubmit() {
			let para = {
				type: this.$route.query.type,
				access_type: this.avForm.access_type,
				name: this.$refs.upload.uploadFiles[0].name
			};
			getUploadToken(para)
				.then((res) => {
					let tempObj = {
						token: res.data.data.token,
						key: res.data.data.key,
						name: this.avForm.name ? this.avForm.name : this.$refs.upload.uploadFiles[0].name,
						type: this.$route.query.type,
						access_type: this.avForm.access_type,
					}
					Object.assign(this.$refs.upload.data, tempObj); // 发送请求附带参数的补充
					// console.log(this.$refs.upload.data); //查看请求附带参数
					this.$refs.upload.submit();
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
		// 提交成功后
		handleSuccess(response, file, fileList) {
			let para = {
				key: response.key,
				name: this.avForm.name ? this.avForm.name : this.$refs.upload.uploadFiles[0].name,
				type: this.$route.query.type,
				size: file.size,
				tags: this.avForm.dynamicTags.join(','),
				content_type: file.raw.type,
				access_type: this.avForm.access_type,
				encode_encrypt: this.avForm.encode_encrypt,
			}

			if (this.preImg != '../../../static/images/defaultPostAudioImg.png') {
				para['poster_url'] = this.preImg;
			}

			if (this.$route.query.type == 2) {
				console.log('是音频');
				para['content'] = this.avForm.content ? util.ReplaceSeperatorByEnter(this.avForm.content) : '';
			}

			goCallback(para)
				.then((res) => {
					if (res.data.success) {
						this.$notify({
							title: '成功',
							message: '上传成功',
							type: 'success'
						});
						this.$refs['avForm'].resetFields();
						this.$refs['upload'].uploadFiles.length = 0;
						this.avForm.dynamicTags.length = [];
						let self = this;
						setTimeout(function () {
							self.$router.go(-1);
						}, 500)
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
		}
	},
	mounted() {
		this.makeSureFromWhere();
	}
}
</script>

<style lang="less" scoped>
.avUploadPage {
    width: 40%;
    margin-top: 30px;
    .preImg {
        width: 100%;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }
    .defaultImg {
        width: 70%;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .upload-demo {
        width: 400px;
    }
}
</style>
