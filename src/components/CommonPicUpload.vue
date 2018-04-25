<template lang="html">
  <!-- 图片上传 -->
  <div class="picUploadPage">
    <el-form :model='picForm' label-width='100px' :rules='picFormRules' ref='picForm'>
      <el-form-item label='素材名称' prop='name'>
        <el-input v-model='picForm.name' placeholder="请输入素材名称"  @keydown.enter.native.prevent></el-input>
      </el-form-item>
      <el-form-item label='素材标签'>
        <el-tag
          :key="tag"
          v-for="tag in picForm.dynamicTags"
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
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      </el-form-item>
      <el-form-item label='上传图片'>
        <el-upload
        class="upload-demo"
        ref="upload"
        action="/op/material/upload_image_lib"
        :data='kongObj'
        name="bin"
        list-type="picture"
        :on-change="handleChange"
        :file-list="fileList"
        :auto-upload="false"
        :multiple=true
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { uploadPicToLib } from "../api/api";
export default {
  data() {
    return {
      picForm: {
        name: "",
        dynamicTags: []
      },
      picFormRules: {
        name: [{ required: false, message: "请输入素材名称", trigger: "blur" }]
      },
      // 空对象 绑定到上传的data上
      kongObj: {},
      // tags 标签
      inputVisible: false,
      inputValue: "",
      fileList: [],
      successCount: 0
    };
  },
  methods: {
    //on-change 对应的函数 文件状态改变的时候触发
    handleChange(file, fileList) {
      let reg = /\.(png|jpg|jpeg|gif)$/
      // console.log(this.fileList)
      for (let i = 0; i < fileList.length; i++) {
        if (!reg.test(fileList[i].name)) {
          this.$notify({
            type: "error",
            message: fileList[i].name + "是错误的文件类型",
            title: "错误"
          });
          fileList.splice(i, 1)
        }
      }
      this.fileList = fileList
    },
    submitUpload() {
      let self = this;
      this.$refs.picForm.validate(valid => {
        if (valid) {
          if (self.fileList.length > 0) {
            for (let i = 0; i < self.fileList.length; i++) {
              console.log(self.fileList);
              var testUplopad = async function() {
                let t = await self.upload(self.fileList[i].raw, i);
                // console.log(t)
              };
              testUplopad();
            }
          } else {
            this.$notify({
              title: "错误",
              message: "请选择图片",
              type: "error"
            })
          }
        }
      })
    },
    handleSuccess(response, file, fileList) {
      if (response.success) {
        this.$notify({
          title: "成功",
          message: "上传成功",
          type: "success"
        });
        this.$refs["picForm"].resetFields();
        this.$refs["upload"].uploadFiles.length = 0;
        this.picForm.dynamicTags = [];
        this.$emit("tellParentChangeFlag"); // 调用父组件里面的方法改变flag值
        // window.location.reload(); // 重新加载一次页面
      } else {
        this.$notify({
          title: "错误",
          message: response.msg,
          type: "error"
        })
      }
    },
    // tags标签
    handleClose(tag) {
      this.picForm.dynamicTags.splice(this.picForm.dynamicTags.indexOf(tag), 1);
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
        this.picForm.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    upload(fileraw, index) {
      return new Promise((resolve, reject) => {
        let para = {
          name: this.picForm.name ? this.picForm.name : fileraw.name,
          tags: this.picForm.dynamicTags.join(",")
        };
        let data = new FormData();
        data.append("bin", fileraw);
        data.append("name", para.name);
        data.append("tags", para.tags);
        this.$ajax
          .post("/op/material/upload_image_lib", data, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          .then(res => {
            if (res.data.success) {
              resolve("第" + index + "张图片上传成功");
              // this.$notify({
              //   title: "成功",
              //   type: "success",
              //   message: "第" + index + "张图片上传成功"
              // })
              this.successCount++;
            } else {
              reject("第" + index + "张图片上传失败,错误原因:" + res.data.msg);
              this.$notify({
                title: "失败",
                type: "error",
                message: "第" + index + "张图片上传失败,错误原因:" + res.data.msg,
                duration: 0
              })
            }
            if (this.successCount == this.fileList.length) {
              // console.log(this.successCount)
              // console.log(this.fileList.length)
              this.$notify({
                title: "成功",
                type: "success",
                message: "图片全部上传成功,1s后会刷新页面"
              })
              this.$refs["picForm"].resetFields();
              this.picForm.dynamicTags = [];
              this.$emit("tellParentChangeFlag"); // 调用父组件里面的方法改变flag值
              setTimeout(function() {
                window.location.reload(); // 重新加载一次页面
              }, 1500);
            }
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
