<template lang="html">

    <section class="returnUrlPage">
        <el-radio-group v-model="uploadType">
            <el-radio-button label="图片"></el-radio-button>
            <el-radio-button label="zip"></el-radio-button>
            <el-radio-button label="cdn"></el-radio-button>
        </el-radio-group >
        <div class="uploadPic"  v-if='uploadType === "图片"'>
            <el-upload
                class="upload-demo"
                ref='upload'
                drag
                name="bin"
                action="/op/material/upload_image"
                :multiple='true'
                :on-success="handleSuccess"
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <div v-for="item in data" class="showResult">
                <span class="fileName">{{ item.name }}</span>
                <el-input class="showUrl" placeholder="此处是返回的url地址" :value='item.url'></el-input>
            </div>
        </div>
        <div class="uploadZip"  v-if='uploadType === "zip"'>
            <el-form :inline='true'>
                <el-form-item label="请输入文件前缀"  class="prefixStyle">
                    <el-input v-model="prefixData.prefix"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-upload
                     class="upload-demo"
                     ref="uploadZip"
                     action="/op/material/upload_zip"
                     :on-preview="handlePreview"
                     accept="application/zip"
                     :on-success="handleSuccessZip"
                     :on-error="handleErrorZip"
                     name='bin'
                     :data='prefixData'
                     :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload('uploadZip')">上传到服务器</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="info" @click="clearInfo('uploadZip')">清空上传文件</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传zip文件</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div class="loadingDiv" v-loading='zipDataLoading' element-loading-text="拼命加载中。。。">
                <div v-for="item in zipData" class="showResult">
                    <div>
                        <p class="showZipUrl">
                            <a :href="'https://'+item" target='_blank'>{{item}}</a>
                        </p>
      					<el-button type="success" v-clipboard:copy="item">复制链接</el-button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if='uploadType === "cdn"'>
            <el-form  class="about-cdn" label-width="120px">
                <el-form-item label="请输入文件前缀">
                    <div  class="checkfile">
                        <el-input v-model="prefixData.prefix" style="width: 300px;"></el-input>
                        <el-upload
                         class="cdn-upload"
                         ref="upload_file"
                         action="/op/sys/cdn/upload"
                         :on-preview="handlePreview"
                         :on-success="handleSuccessFile"
                         :on-error="handleErrorZip"
                         :on-change="handleChangeFile"
                         name='bin'
                         :data='prefixData'
                         :auto-upload="false">
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload('upload_file')">上传到服务器</el-button>
                            <el-button style="margin-left: 10px;" size="small" type="info" @click="clearInfo('upload_file')">清空上传文件</el-button>
                        </el-upload>
                    </div>
                </el-form-item>
                <el-form-item label="请输入文件地址">
                    <el-input v-for="(item, index) in cdnUrls" :key="index" v-model="item.url" style="width: 700px;margin-bottom:10px;" ></el-input>
                    <el-button type="primary" icon='plus' :plain="true" @click='addUrl'></el-button>
                </el-form-item>
                <el-form-item>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="refreshCdnFunc">刷新CDN</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="prefetchCdnFunc">预取CDN</el-button>
                    <!-- <span style="margin-left: 10px;">||</span>
                    <el-button style="margin-left: 10px;" size="small" type="info">复制地址</el-button> -->
                </el-form-item>
            </el-form>


        </div>

    </section>
</template>

<script>
import {
    refreshCdn,
    prefetchCdn,
} from '../../api/api'
export default {
	data() {
		return {
			data: [
				// {
				//     name: '',
				//     url: ''
				// }
			],
			zipData: [],
			uploadType: '图片',
			zipDataLoading: false,
			prefixData: {
				prefix: ''
			},
            cdnUrls: [{
                url: ''
            }]
		}
	},
	methods: {
		handleSuccess(response, file) {
			if (response.success) {
				let obj = {
					url: response.data,
					name: file.name
				}
				this.data.push(obj);
			} else {
				this.$notify({
					title: '错误',
					message: response.msg,
					type: 'error'
				})
			}
		},
		handlePreview(file) {},
		//清空操作
		clearInfo(name) {
			this.$confirm('是否清空文件列表', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$refs[name].clearFiles()
				this.zipData = [];
			})
		},
		handleChangeFile(file, fileList) {
            this.$set(fileList, 0, file);
            fileList.length = 1;
        },
        submitUpload(name) {
			if (this.$refs[name].uploadFiles && this.$refs[name].uploadFiles.length > 0) {
				this.$confirm('是否上传到服务器', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.zipDataLoading = true;
					Object.assign(this.$refs[name].data, this.prefixData); // 发送请求附带参数的补充
					this.$refs[name].submit()
				}).catch(() => {
					this.$refs[name].clearFiles()
				});
			} else {
				this.$notify({
					title: '失败',
					message: '文件列表为空',
					type: 'error'
				})
			}
		},
		handleSuccessZip(response, file) {
			if (response.success) {
				this.zipData = response.data;
				this.$notify({
					title: '成功',
					message: '上传成功',
					type: 'success'
				})
				this.zipDataLoading = false;
			} else {
				this.$notify({
					title: '错误',
					message: response.msg,
					type: 'error'
				})
				this.zipDataLoading = false;
			}
		},
        handleSuccessFile(response, file) {
            if (response.success) {
                this.$set(this.cdnUrls, 0, { url: response.data });
				this.$notify({
					title: '成功',
					message: '上传成功',
					type: 'success'
				})
			} else {
				this.$notify({
					title: '错误',
					message: response.msg,
					type: 'error'
				})
			}
            this.zipDataLoading = false;
        },
		handleErrorZip(res, file) {
			this.$notify({
				title: '错误',
				message: '上传文件过大',
				type: 'error'
			})
			this.zipDataLoading = false;
		},
        addUrl() {
            this.cdnUrls.push({
                url: ''
            });
        },
        refreshCdnFunc() {
            let params = {
                urls: ''
            }
            for (var i = 0; i < this.cdnUrls.length; i++) {
                params.urls += this.cdnUrls[i].url + ','
            }
            refreshCdn(params)
                .then(res => {
                    if (res.data.success) {
                        this.$message({
                            type: 'success',
                            message: '刷新成功'
                        })
                    } else {
                        this.$notify({
                            type: 'error',
                            message: res.data.msg
                        })
                    }
                })
                .catch(err => {
                    this.catchFunc(err);
                })
        },
        prefetchCdnFunc() {
            let params = {
                urls: ''
            }
            for (var i = 0; i < this.cdnUrls.length; i++) {
                params.urls += this.cdnUrls[i].url + ','
            }
            prefetchCdn(params)
                .then(res => {
                    if (res.data.success) {
                        this.$message({
                            type: 'success',
                            message: '预取成功'
                        })
                    } else {
                        this.$notify({
                            type: 'error',
                            message: res.data.msg
                        })
                    }
                })
                .catch(err => {
                    this.catchFunc(err);
                })
        },
        catchFunc(error) {
            if (error.response) {
                this.$notify({
                    title: error.response.status,
                    message: "网络请求错误",
                    type: "error"
                });
            } else if (error.request) {
                this.$notify({
                    title: error.request,
                    message: "网络请求错误",
                    type: "error"
                });
            } else {
                this.$notify({
                    title: "错误",
                    message: error.message,
                    type: "error"
                });
            }
        }
	},
    watch: {
        cdnUrls: {
            handler(n, o) {
                console.log(n);
            },
            deep: true
        }
    }
}
</script>

<style lang="less">
.returnUrlPage {
    // width: 50%;
    .upload-demo {
        margin: 30px 0 0 50px;
    }
    .uploadPic {
        width: 50%;
    }
    .showResult {
        margin: 10px 0 0 50px;
        width: 92%;
        .fileName {
            display: inline-block;
            margin: 5px 0 10px;
        }
    }
}
.showZipUrl {
    width: 70%;
    height: 40px;
    line-height: 40px;
    border: 1px solid #ccc;
    padding-left: 10px;
    display: inline-block;
    float: left;
    margin-right: 15px;
    a {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

}
.about-cdn {
    margin-top: 30px;
    .checkfile {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        .cdn-upload {
            display: inline-block;
            margin-left: 50px;
        }
    }
}
.prefixStyle {
    margin: 30px 0 50px;
}

</style>
