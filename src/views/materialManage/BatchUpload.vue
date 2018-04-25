<template lang="html">
  <div class="container" v-loading="batchLoading" element-loading-text="批量上传中,请勿关闭">
    <div class="avUploadPage">
      <el-form :model='avForm' label-width='100px' :rules='avFormRules' ref='avForm'>
        <el-form-item label="素材类型" prop="type">
          <el-select v-model="avForm.type" placeholder="请选择上传素材类型" style="width:300px;" disabled>
            <el-option label="视频" value="1"></el-option>
            <el-option label="音频" value="2"></el-option>
          </el-select>
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
              style="width: 100px;"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
              @keydown.enter.native.prevent
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </div>
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
            multiple
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitAvUpload">上传</el-button>
            <div slot="tip" class="el-upload__tip">可同时批量上传最多10个音频,文件类型必须为mp3格式</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
// 引入axios实例
import {
  getUploadToken,
  goCallback
} from '../../api/api'
export default {
  data() {
    return {
      fileList: [],
      avForm: {
        type: this.$route.params.type,
        access_type: '',
        name: '',
        dynamicTags: [],
        encode_encrypt: '',
      },
      avFormRules: {
        type: [{
          required: true,
          message: '请选择上传素材类型',
          trigger: 'change'
        }],
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
      // 空对象 绑定到上传的data上
      kongObj: {},
      // tags 标签
      inputVisible: false,
      inputValue: '',
      /*
        批量上传绑定
        batchLimit 限制可同时上传的最大长度
        batchFilelist 队列的长度
        batchLoading loading
        batchCount 批量上传返回结果的个数
       */
      batchLimit: 10,
      batchFilelist: 0,
      batchLoading: false,
      batchCount: 0
    }
  },
  methods: {
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
    //on-change 对应的函数 文件状态改变的时候触发
    handleChange(file, fileList) {
      if (fileList.length > this.batchLimit) {
        fileList.splice(this.batchLimit, fileList.length - this.batchLimit)
      }
      this.batchCount = 0
      this.batchFilelist = fileList.length
    },
    // 提交
    submitAvUpload() {
      // 判断上传规则是否全部满足
      this.$refs.avForm.validate((valid) => {
        if (valid) {
          // 判断点击上传按钮之前是否选择了素材 是 => 上传 否 => 提示
          if (this.$refs.upload.uploadFiles.length > 0) {
            this.$refs.upload.uploadFiles.forEach((item, index) => {
              try {
                this.getTokenThenSubmit(index);
              } catch (e) {
                console.log(e);
              } finally {}
            })
          } else {
            this.$notify({
              title: '错误',
              message: '请选择素材',
              type: 'error'
            });
          }
        }
      })
    },
    getTokenThenSubmit(index) {
      let fileArr = this.$refs.upload.uploadFiles;
      let filename = fileArr[index].name;
      let filesize = fileArr[index].size;
      let fileraw = fileArr[index].raw;
      // 批量上传loading开启
      this.batchLoading = true;
      let para = {
        type: this.avForm.type,
        access_type: this.avForm.access_type,
        name: filename
      };
      getUploadToken(para)
        .then((res) => {
          // formData封装
          let data = new FormData();
          data.append('file', fileraw);
          data.append('token', res.data.data.token);
          data.append('key', res.data.data.key);
          data.append('name', this.avForm.name ? this.avForm.name : filename);
          data.append('type', this.avForm.type);
          data.append('access_type', this.avForm.access_type);
          // 七牛云上传
          this.$ajax.post('https://upload.qbox.me', data, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            .then((res) => {
              // 上传七牛成功
              if (res.status == 200) {
                let para = {
                  key: res.data.key,
                  name: this.avForm.name ? this.avForm.name : filename,
                  type: this.avForm.type,
                  size: filesize,
                  tags: this.avForm.dynamicTags.join(','),
                  content_type: fileraw.type,
                  access_type: this.avForm.access_type,
                  encode_encrypt: this.avForm.encode_encrypt,
                }
                // 回调素材库
                goCallback(para)
                  .then((res) => {
                    if (res.data.success) {
                      // status赋值success 可以改变el-upload里面的文件上传状态
                      this.$refs.upload.uploadFiles[index].status = 'success';
                      // console.log(index);
                      // this.$refs.upload.uploadFiles.splice(index, 1);
                    } else {
                      this.$notify({
                        title: '失败',
                        message: filename + '上传失败, 错误原因' + res.data.msg,
                        type: 'error',
                        duration: 0
                      });
                    }
                    // 返回了全部结果后 批量上传loading关闭
                    this.batchCount += 1;
                    if (this.batchCount >= this.batchFilelist) {
                      this.batchLoading = false;
                    }
                  })
                  .catch((error) => {
                    console.log(error);
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
              } else {
                this.$notify({
                  title: '错误',
                  message: filename + '上传失败七牛云上传失败',
                  type: 'error',
                  duration: 0
                });
              }
            })
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
  }
}
</script>
<style lang="less" scoped>
.container {
    margin-top: 30px;
    overflow-y: scroll;
    .avUploadPage {
        width: 40%;
        margin-top: 30px;
        .preImg {
            width: 400px;
            height: 200px;
            img {
                width: 100%;
                height: 200px;
            }
        }
        .upload-demo {
            width: 400px;
        }
    }
}
</style>
