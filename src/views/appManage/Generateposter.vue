<template lang="html">
  <div>
     <el-row  :gutter="20">
      <el-col :span="24">
        <el-col :span="12">
          <div class="avatar-uploader" >
              <img :src="form.img" alt="" class="back-img">
              <div style="border-style: solid;" alt=""  class="qr-code" :style='"top: " + form.yQRCoord/2 + "px;left: " + form.xQRCoord/2 + "px;" + "width:" + form.qRSize/2 + "px;height:" + form.qRSize/2 + "px"'></div>
          </div>
          <el-col >
            <el-upload
              class="upload-demo"
              name="bin"
              action="/op/material/upload_image"
              :on-success="handleAvatarSuccess"
              :show-file-list="false">
              <el-button class="change-button">更换海报图</el-button>
            </el-upload>
          </el-col>
        </el-col>
          <!-- 右边的form表单 -->
        <el-col :span="12"  >
          <el-form  :model="form" :rules="rules"  ref="RulesForm" label-width="100px" label-position="left">
            <el-form-item label="海报名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="二维码坐标" label-width="100px"  prop="xQRCoord" style="margin-left:0;">
              <el-col :span="6"  style="width:100px;margin-right:40px;padding:0">
                <el-input size="large" type="number"  v-model.number="form.xQRCoord" style="width: 100%;"></el-input>
              </el-col>
              <el-col :span="6" style="width:100px">
                <el-input size="large" type="number"  v-model.number="form.yQRCoord" style="width: 100%;"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="二维码大小" label-width="100px" prop="qRSize">
              <el-input v-model.number="form.qRSize"  type="number"   style="width:200px"></el-input>
            </el-form-item>
            <el-form-item label="是否隐藏" label-width="100px"  >
              <!-- <el-input  style="width:200px;margin-right:20px"  v-model="form.orderNum" ></el-input> -->
              <el-radio-group v-model="form.hidden">
                <el-radio :label="0">显示</el-radio>
                <el-radio :label="1">隐藏</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="'宣传文案' + (index + 1)"  v-for="(item, index) in form.items">
              <el-input type="textarea" v-model="item.name"  placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item >
              <el-col>
                <el-button class="change-button"  style="width:180px;margin-left:50px;height:50px" @click="AddnewTextarea">+ 增加一条文案</el-button>
              </el-col >
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm" style="width:100px;top:90px;margin-right:30px;height:40px" >保存</el-button>
              <el-button :disabled="!($route.query.index > -1)" @click="removeMove" style="width:60px;top:90px;height:40px" >删除</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-col>
    </el-row>
</div>
</template>

<script>
import {
  posterUpdate,
  getPosterList
} from '../../api/api'
export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        name: '',
        xQRCoord: 0,
        yQRCoord: 0,
        qRSize: '',
        orderNum: '',
        hidden: 0,
        items: '',
        items: [{
            name: ""
          },
          {
            name: ""
          }
        ],
      },
      posterList: [],
      rules: {
        name: [{
            required: true,
            message: '请输入活动名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '长度在 1到 50个字符',
            trigger: 'blur'
          }
        ],
        xQRCoord: [{
          required: true,
          message: '请输入left值',
          trigger: 'change',
          type: 'number'
        }],
        yQRCoord: [{
          required: true,
          message: '请输入left值',
          trigger: 'change',
          type: 'number'
        }],
        qRSize: [{
          type: 'number',
          required: true,
          message: '请输入大小',
          trigger: 'change'
        }],
        orderNum: [{
          type: 'number',
          required: true,
          message: '请输入顺序码',
          trigger: 'change'
        }],
        items: [{
            required: true,
            message: '请输入文案',
            trigger: 'change',
            type: "string"
          },
          {
            required: true,
            message: '请输入文案',
            trigger: 'change',
            type: "string"
          }
        ]
      }
    };
  },
  methods: {
    //图片上传成功
    handleAvatarSuccess(res, file) {
      this.$set(this.form, 'img', res.data)
    },
    // 获取海报列表
    getList() {
      getPosterList().then(res => {
          if (res.data.success) {
            if (Object.keys(res.data.data).length > 0) {
              this.posterList = res.data.data.posters;
              // method: true -> 修改   false -> 新增
              if (this.$route.query.index > -1) {
                this.form = res.data.data.posters[this.$route.query.index];
                this.$set(this.form, 'items', [])
                this.form.copyWriters.forEach((item, index) => {
                  this.$set(this.form.items, index, {
                    name: item
                  });
                })
              } else {
                this.form = {
                  name: '',
                  xQRCoord: 0,
                  yQRCoord: 0,
                  qRSize: '',
                  orderNum: '',
                  hidden: 0,
                  items: '',
                  posterList: [],
                  items: [{
                      name: ""
                    },
                    {
                      name: ""
                    }
                  ],
                }
              }
              console.log(this.form);
            } else {
              this.posterList = [];
            }
          } else {
            this.$notify({
              title: '错误',
              message: res.data.msg,
              type: 'error'
            })
          }
        })
        .catch(error => {
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
    //保存并且提交数据
    submitForm(RulesForm) {
      //console.log('成功调起提交方法');    测试再次点击修改时是否走这个方法
      this.$refs.RulesForm.validate((valid) => {
        if (valid) {
          if (!this.form.img) {
            this.$notify({
              title: '错误',
              message: '请上传一张图片作为海报的背景图',
              type: 'error'
            })
            return;
          }
          if (!this.form.xQRCoord) {
            this.$notify({
              title: '错误',
              message: '请填写二维码横坐标（px）',
              type: 'error'
            })
            return;
          }
          if (!this.form.yQRCoord) {
            this.$notify({
              title: '错误',
              message: '请填写二维码纵坐标（px）',
              type: 'error'
            })
            return;
          }
          if (!this.form.qRSize) {
            this.$notify({
              title: '错误',
              message: '请填写二维码尺寸（px）',
              type: 'error'
            })
            return;
          }
          // alert('submit!');
          let paraObj = {
            name: this.form.name,
            img: this.form.img,
            xQRCoord: this.form.xQRCoord,
            yQRCoord: this.form.yQRCoord,
            qRSize: this.form.qRSize,
            hidden: this.form.hidden,
            copyWriters: []
          }
          if (this.form.items && this.form.items.length) {
            this.form.items.forEach((item, index) => {
              this.$set(paraObj.copyWriters, index, item.name)
            })
          }
          // method: true -> 修改   false -> 新增
          if (this.$route.query.index > -1) {
            paraObj['id'] = this.form.id;
            paraObj['ct'] = this.form.ct;
            this.posterList[this.$route.query.index] = paraObj
          } else {
            this.posterList.push(paraObj);
          }
          let para = {
            posters: this.posterList
          }
          posterUpdate({
              values: JSON.stringify(para)
            })
            .then(res => {
              if (res.data.success) {
                this.$router.push({
                  path: '/Billlist'
                })
              } else {
                this.$notify({
                  title: '失败',
                  message: res.data.msg,
                  type: 'error'
                })
              }
            })
            .catch(error => {
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
          console.log('error submit!!');
          return false;
        }
      });
    },
    //点击删除，删除当前点击对象
    removeMove(index) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(1);
          this.posterList.splice(this.$route.query.index, 1);   //删除当前列表
          let para = {
            posters: this.posterList
          }
          posterUpdate({ values: JSON.stringify(para) })
            .then(res => {
              if (res.data.success) {
                this.$router.push({
                  path: '/Billlist'
                })
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              } else {
                this.$notify({
                  title: '失败',
                  message: res.data.msg,
                  type: 'error'
                })
              }
            })
            .catch(error => {
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
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    //点击增加按钮增加文本
    AddnewTextarea() {
      this.form.items.push({
        name: ''
      })
    }
  },
  mounted() {
    this.getList();
  }
}
</script>

<style lang="less" scoped>
.avatar-uploader {
    height: 667px;
    width: 375px;
    background: #999;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    position: relative;
    .back-img {
        width: 100%;
        height: 100%;
    }
    .qr-code {
        position: absolute;
    }
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.el-upload-list__item-name {
    color: rgb(72, 102, 106);
    display: none;
    margin-right: 40px;
    overflow: hidden;
    padding-left: 4px;
    text-overflow: ellipsis;
    transition: color 0.3s;
    white-space: nowrap;
}
.el-upload-list__item .el-icon-upload-success {
    color: #0000;
}
.avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 375px;
    height: 667px;
    line-height: 667px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
.el-col-24 {
    width: 100%;
    /*margin-top: 40px;*/
}
.el-upload-dragger {
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;
    width: 375px;
    height: 667px;
    text-align: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
button {
    position: relative;
    top: 20px;
}
.change-button {
    width: 371px;
    height: 52px;
    background-color: #e6e6e6;
}
.calculate-button {
    width: 371px;
    height: 52px;
    background-color: #e3f0d4;
}
.ErcoordP {
    width: 80px;
    height: 80px;
    position: relative;
    top: -400px;
    left: 150px;
}
.ErcoordP img {
    width: 100%;
    height: 100%;
    position: absolute;
}
</style>
