<template lang="html">
  <section class="addLearningLibPage">
    <el-form :model="form" :rules="formRules" ref="form" :label-width="formLabelWidth">
      <el-form-item label="类型">
        <el-select v-model="form.type" placeholder="请选择类型" style="width:300px;">
          <el-option label="单词" value="0"></el-option>
          <el-option label="儿歌循环听" value="1"></el-option>
          <el-option label="双语电台" value="2"></el-option>
          <el-option label="双语动画片" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="英文标题" prop="EnglishTitle">
        <el-input v-model="form.EnglishTitle" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label='素材标签' prop='dynamicTags' style="width:600px;">
        <div>
          <el-tag
            :key="tag"
            v-for="tag in form.dynamicTags"
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
      <el-form-item label="资料描述">
        <el-input type="textarea" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label='歌词内容'>
        <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model='form.content'></el-input>
      </el-form-item>
      <!-- 只在新增资料的时候显示选择素材方式 更新时只能选择素材库里面的素材 -->
      <el-form-item label="选择素材方式" v-if="!this.$route.query.id">
        <el-dropdown split-button type="primary" @command="handleCommand">
            选择素材方式
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="0">素材库选择</el-dropdown-item>
            <el-dropdown-item command="1">立即上传</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
      <el-form-item label="展示素材" v-if="form.selectMaterial">
        <div :class=" form.selectMaterial ? 'posterImg' : 'defaultPosterImg' ">
          <img :src=" form.selectMaterial ? form.selectMaterial.posterUrl : '../../../static/images/defaultPicInElementAudio.png'" alt="" @click="switchPlayerFunc()" class="practicalImg">
        </div>
      </el-form-item>
      <!-- 从素材库中选择 -->
      <el-form-item label="素材库" v-if="selectFromLib">
        <el-select v-model="form.selectMaterial" style="width:300px;" placeholder="请输入素材名称或ID查询" filterable clearable remote :remote-method="selectMaterialRemoteMethod" :loading='selectMaterialLoading'>
          <el-option
            v-for="item in selectMaterialOptions"
            :key="item"
            :label="'（' + item.id + '）' + item.name"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 立即上传 -->
      <div v-else>
        <el-form-item label="封面预览" v-show="this.preImg">
          <div class="posterImg">
            <img :src="preImg" alt="" class="practicalImg">
          </div>
        </el-form-item>
        <el-form-item label="选择封面" style="margin-top: 50px;">
          <el-upload
            class="upload-demo"
            ref='uploadPic'
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
        <el-form-item label='上传素材'>
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
                <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitAvUpload">上传</el-button> -->
                <div slot="tip" class="el-upload__tip">只支持单个文件上传,音频必须为mp3,视频必须为mp4</div>
            </el-upload>
        </el-form-item>
      </div>
      <el-form-item label="状态" prop='status'>
        <el-radio-group v-model="form.status">
          <el-radio class="radio" :label="1">有效</el-radio>
          <el-radio class="radio" :label="0">无效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="success" class="submitNewLearningLibrary" @click="submitNewLearningLibrary">确 定</el-button>
    </span>
    <!-- videoPlayer -->
    <el-dialog v-model="playerVisible" title="播放">
      <div id="player">
        <video-player
          ref="videoPlayer"
          :options="playerOptions"
        >
        </video-player>
      </div>
    </el-dialog>
  </section>
</template>
<script>
// util工具包
import util from '../../common/js/util'
// axios
import {
  // 获取素材
  getMaterialsList,
  // 增加新的learninglib
  addLearLib,
  // 更新新的learninglib
  editLearLib,
  // 获取learninglib列表
  getLearLibList,
  // 获取token
  getUploadToken,
  // 上传素材的回调
  goCallback
} from '../../api/api'
export default {
  data() {
    return {
      // tags 标签
      inputVisible: false,
      inputValue: '',
      // 新增表单 的表头宽度
      formLabelWidth: '100px',
      // 新增 表单
      form: {
        title: '',
        EnglishTitle: '',
        type: '',
        description: '',
        content: '',
        dynamicTags: [],
        selectMaterial: '',
        status: 1,
        youkuUrl: '',
        ref_type: "0"
      },
      formRules: {
        title: [{
          required: true,
          message: '标题为必填项',
          trigger: 'blur'
        }],
        EnglishTitle: [{
          required: true,
          message: '英文标题为必填项',
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: '请选择状态'
        }]
      },
      // 选择素材项的 加载 与 选项
      selectMaterialLoading: false,
      selectMaterialOptions: [],
      // 当前id的learninglib对象
      currentObj: {},
      // videojs
      playerVisible: false,
      playerOptions: {
        // component options
        start: 0,
        playsinline: false,
        // videojs options
        muted: false,
        language: 'en',
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: "video/mp4",
          src: '',
        }],
        poster: "",
        height: 540,
        loop: false,
      },
      /**
       * [选择素材的方式]
       * true 素材库
       * false 立即上传
       */
      selectFromLib: true,
      // 封面
      preImg: '',
      // 立即上传
      kongObj: {}, // 空对象 绑定到上传的data上
      fileList: [],
      // 立即上传时的素材id
      currentMeterialId: '',
      // 封面的文件队列
      picList: []
    }
  },
  computed: {
    getMaterialType() {
      if (this.form.type == '3') {
        return '1'
      } else {
        return '2'
      }
    }
  },
  methods: {
    // 首次进去确认来自添加还是更新
    makeSureFromWhere() {
      this.$route.query.type ? this.makeSureAddWhich() : this.loadData();
    },
    // 确认添加的类型
    makeSureAddWhich() {
      this.form.type = this.$route.query.type + '';
    },
    // 确认是更新 请求当前id的数据
    loadData() {
      getLearLibList({
          id: this.$route.query.id
        })
        .then((res) => {
          this.currentObj = res.data.data.items[0];
          this.form = {
            title: this.currentObj.entity.title,
            EnglishTitle: this.currentObj.entity.englishTitle,
            description: this.currentObj.entity.description,
            content: this.currentObj.entity.content ? util.ReplaceSeperatorByEnter(this.currentObj.entity.content) : '',
            dynamicTags: this.currentObj.entity.tags ? this.currentObj.entity.tags.split(',') : '',
            status: this.currentObj.entity.stat,
            type: this.currentObj.entity.type + '',
            selectMaterial: this.currentObj.materialEntity ? this.currentObj.materialEntity.entity.id : ''
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
    // tags标签
    handleClose(tag) {
      this.form.dynamicTags.splice(this.form.dynamicTags.indexOf(tag), 1);
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
        this.form.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    // 选择素材的方法
    selectMaterialRemoteMethod(query) {
      if (query !== '') {
        this.selectMaterialLoading = true;
        let temp = Number(query);
        let parameter = {
          access_type: 0
        };
        if (this.$route.query.type != '3') {
          parameter['type'] = 2;
        } else {
          parameter['type'] = 1;
        }
        temp ? parameter['id'] = temp : parameter['name'] = query;
        getMaterialsList(parameter).then((res) => {
          if (res.data.success && res.data.data.items) {
            this.selectMaterialOptions = res.data.data.items.map((item) => {
              let tempObj = {
                id: item.entity.id,
                name: item.entity.name,
                url: item.entity.url,
                posterUrl: item.conf.posterImgUrl,
                type: item.entity.type,
                accessType: item.entity.accessType
              }
              return tempObj;
            });
          }
          this.selectMaterialLoading = false;
        });
      } else if (this.$route.query.id) {
        this.selectMaterialLoading = true;
        let parameter = {
          type: 2,
          id: this.currentObj.materialEntity.entity.id
        }
        getMaterialsList(parameter).then((res) => {
          if (res.data.success) {
            this.selectMaterialOptions = res.data.data.items.map((item) => {
              let tempObj = {
                id: item.entity.id,
                name: item.entity.name,
                url: item.entity.url,
                posterUrl: item.conf.posterImgUrl,
                type: item.entity.type,
                accessType: item.entity.accessType
              }
              return tempObj;
            });
          } else {
            this.$message.error(res.data.msg || '未知错误，请联系管理员');
          };
          this.selectMaterialLoading = false;
        })
      } else {
        this.selectMaterialOptions = [];
      };
    },
    // 显示播放器
    switchPlayerFunc(item) {
      if (this.form.selectMaterial.url) {
        this.playerVisible = true;
        let posterUrl = this.form.selectMaterial.posterUrl
        if (posterUrl) {
          this.playerOptions.poster = posterUrl;
        } else {
          this.playerOptions.poster = '../../../static/images/defaultPostVideoImg.png';
        }
        this.playerOptions.sources[0].src = this.form.selectMaterial.url;
      } else {
        this.playerOptions.sources[0].src = this.form.youkuUrl;
      }
    },
    // 新增确认
    submitNewLearningLibrary() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 判断证明是从素材库里面选择
          if (this.selectFromLib) {
            this.$confirm('确认提交吗？', '提示', {
                type: 'warning'
              })
              .then(() => {
                this.addLoading = true;
                let para = {
                  title: this.form.title,
                  english_title: this.form.EnglishTitle,
                  description: this.form.description,
                  content: this.form.content ? util.ReplaceSeperatorByEnter(this.form.content) : '',
                  tags: this.form.dynamicTags.length ? this.form.dynamicTags.join(',') : '',
                  type: this.form.type,
                  sub_type: 0,
                  ref_type: 0,
                  status: this.form.status,
                  material_id: this.form.selectMaterial.id
                }
                if (this.$route.query.id) {
                  para['id'] = this.$route.query.id
                }
                this.sendAxios(para)
              })
              .catch((e) => {
                this.$notify({
                  title: '提示',
                  message: e.message,
                  type: 'info'
                });
              });
          } else {
            this.submitAvUpload();
          }
        }
      })
    },
    // 上传素材
    //素材提交on-change 对应的函数 文件状态改变的时候触发
    handleChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.length = 1;
        this.$notify({
          title: '错误',
          message: '只支持单个文件上传',
          type: 'error'
        })
      }
    },
    submitAvUpload() {
      // 判断点击上传按钮之前是否选择了素材 是 => 上传 否 => 提示
      if (this.$refs.upload.uploadFiles[0]) {
        var reg;
        if (this.form.type == '3') {
          reg = /\.mp4$/
        } else {
          reg = /\.mp3$/
        }
        var str = this.$refs.upload.uploadFiles[0].name;
        if (reg.test(str) == true) {
          if (true) {
            if (this.preImg !== '') {
              this.$confirm('确认即上传?', '提示', {
                type: 'warning'
              }).then(() => {
                this.getTokenThenSubmit();
              })
            } else {
              this.$notify({
                title: '提示',
                message: '必须选择封面',
                type: 'warning'
              });
            }
          }
        } else {
          this.$notify({
            title: '提示',
            message: '动画片只能上传mp4格式,其余资料只能上传mp3格式',
            type: 'warning'
          });
        }
      } else {
        this.$notify({
          title: '错误',
          message: '请选择素材',
          type: 'error'
        })
      }
    },
    getTokenThenSubmit() {
      let para = {
        type: this.getMaterialType,
        access_type: 0,
        name: this.$refs.upload.uploadFiles[0].name
      };
      getUploadToken(para)
        .then((res) => {
          let tempObj = {
            token: res.data.data.token,
            key: res.data.data.key,
            type: this.getMaterialType,
            access_type: 0,
          }
          Object.assign(this.$refs.upload.data, tempObj); // 发送请求附带参数的补充
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
    handleSuccess(response, file, fileList) {
      let para = {
        name: this.$refs.upload.uploadFiles[0].name,
        key: response.key,
        access_type: 0,
        encode_encrypt: 0,
        type: this.getMaterialType,
        content_type: file.raw.type,
        size: file.size
      }
      para['poster_url'] = this.preImg;
      goCallback(para)
        .then((res) => {
          if (res.data.success) {
            // 素材上传成功
            this.$refs['upload'].uploadFiles.length = 0;
            this.currentMeterialId = res.data.data.entity.id;
            this.addLoading = true;
            let para = {
              title: this.form.title,
              english_title: this.form.EnglishTitle,
              description: this.form.description,
              content: this.form.content ? util.ReplaceSeperatorByEnter(this.form.content) : '',
              tags: this.form.dynamicTags.length ? this.form.dynamicTags.join(',') : '',
              type: this.form.type,
              sub_type: 0,
              ref_type: 0,
              status: this.form.status,
              material_id: this.currentMeterialId
            }
            if (this.$route.query.id) {
              para['id'] = this.$route.query.id
            }
            this.sendAxios(para);
          } else {
            // 素材上传失败
            this.$notify({
              title: '错误',
              message: res.data.msg,
              type: 'error'
            });
          }
        })
    },
    // 上传封面
    picChange(file, fileList) {
      if (fileList.length > 1) {
        fileList[0] = fileList[fileList.length - 1]
        fileList.length = 1;
      }
    },
    picSuccess(response, file) {
      if (response.success) {
        this.preImg = response.data;
      } else {
        this.$notify({
          title: '错误',
          message: response.msg,
          type: 'error'
        })
      }
    },
    // 选择素材的方式
    handleCommand(command) {
      if (command == '0') {
        // 0 是素材库
        this.selectFromLib = true;
      } else if (command == '1') {
        // 1 表示立即上传
        this.selectFromLib = false;
      }
    },
    // axios提交数据 分两种情况 新增或者更新
    sendAxios(para) {
      if (this.$route.query.id) {
        editLearLib(para)
          .then((res) => {
            if (res.data.success) {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success'
              })
              this.$router.go(-1);
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
      } else if (this.$route.query.type) {
        addLearLib(para)
          .then((res) => {
            if (res.data.success) {
              this.$notify({
                title: '成功',
                message: '提交成功',
                type: 'success'
              })
              this.$router.go(-1);
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
      }
    }
  },
  mounted() {
    this.makeSureFromWhere();
  },
  watch: {
    playerVisible: {
      handler(newValue, oldValue) {
        if (!newValue) {
          // 这里解决 关闭video页面以后视频还继续播放的问题
          this.$refs.videoPlayer.player.pause();
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.addLearningLibPage {
    margin-top: 20px;
    position: relative;
    width: 50%;
    .defaultPosterImg {
        width: 50%;
        text-align: center;
    }
    .posterImg {
        width: 100%;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #e1e1e1;
        overflow: hidden;
        .practicalImg {
            width: 100%;
        }
    }
    .submitNewLearningLibrary {
        position: absolute;
        right: -100px;
        bottom: 0;
    }
}
</style>
