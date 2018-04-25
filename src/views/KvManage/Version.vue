<template lang="html">
  <div class="versionPage">
    <section class="versionEdit" style="width: 500px;" >
      <el-form :model='editForm' label-width='100px' :rules='editFormRules' ref='editForm'>
        <el-form-item label='平台类型' prop='platformType'>
          <el-radio-group v-model="editForm.platformType" @change="platFormTypeChange(editForm.platformType)">
            <el-radio class="radio" :label="1">IOS</el-radio>
  	        <el-radio class="radio" :label="2">Andriod</el-radio>
	        </el-radio-group>
        </el-form-item>

        <el-form-item label="版本号" prop='versionNum'>
				  <el-input v-model='editForm.versionNum' style="width: 130px;"></el-input>
			  </el-form-item>

        <el-form-item label='版本名称' prop='name'>
          <el-input v-model='editForm.name'></el-input>
        </el-form-item>

        <el-form-item label='更新类型' prop='updateType'>
          <el-radio-group v-model="editForm.updateType">
            <el-radio class="radio" :label="0">不提示更新</el-radio>
	          <el-radio class="radio" :label="1">建议更新</el-radio>
            <el-radio class="radio" :label="2">强制更新</el-radio>
		      </el-radio-group>
        </el-form-item>

        <el-form-item label='更新说明' prop='description'>
          <el-input type='textarea' :autosize="{ minRows: 2, maxRows: 4}" v-model='editForm.description' style="width: 400px;"></el-input>
        </el-form-item>

        <el-form-item label='下载地址' prop='downloadUrl'>
          <el-input v-model='editForm.downloadUrl' style="width: 400px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="float: right">
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </section>
  </div>
</template>

<script>
// 引入axios实例
import {
  getVersionConf,
  editVersionConf
} from '../../api/api'

export default {
  data() {
    return {
      /*
          编辑
      */
      editLoading: false, //编辑界面是否显示加载
      editFormRules: { //编辑界面表单规则
        versionNum: [{
          required: true,
          message: '请输入版本号'
        }],
        name: [{
          required: true,
          message: '请输入版本名称'
        }],
        updateType: [{
          required: true,
          message: '请选择更新类型'
        }],
        platformType: [{
          required: true,
          message: '请选择平台类型'
        }],
        description: [{
          required: true,
          message: '请输入更新说明',
          trigger: 'blur'
        }],
        downloadUrl: [{
          required: true,
          message: '请输入下载地址',
          trigger: 'blur'
        }]
      },
      editForm: {
        versionNum: '',
        name: '',
        updateType: '',
        platformType: 1,
        description: '',
        downloadUrl: '',
      },
    }
  },
  methods: {
    loadData(name) {
      getVersionConf()
        .then((res) => {
          if (res.data.success) {
            if (name && res.data.data[name]) {
              this.editForm = res.data.data[name]
            } else if (name && res.data.data['ios']) {
              this.editForm = res.data.data['ios']
            }
          } else {
            this.$notify({
              title: '错误',
              message: '请求数据失败',
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
    // 编辑页面提交
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.editForm['platformType'] == 'android' && parseInt(this.editForm.versionNum) != this.editForm.versionNum) {
            this.$notify({
              title: '错误',
              message: 'Andriod版本号必须是整数',
              type: 'error'
            })
          } else {
            this.$confirm('确认提交吗?', '提示', {})
              .then(() => {
                this.editLoading = true;
                let temp = Object.assign({}, this.editForm);
                let para = {
                  platform_type: this.editForm['platformType'],
                  value: '',
                }
                para['value'] = JSON.stringify(temp);
                editVersionConf(para).then((res) => {
                  this.editLoading = false;
                  if (res.data.success) {
                    this.$notify({
                      title: '成功',
                      message: '编辑成功',
                      type: 'success'
                    });
                  } else {
                    this.$notify({
                      title: '错误',
                      message: res.data.msg,
                      type: 'error'
                    })
                  }
                })
              })
              .catch(() => {
                this.$notify({
                  title: '提示',
                  message: '取消操作',
                  type: 'info'
                })
              });
          }
        }
      })
    },
    platFormTypeChange(value) {
      if (value == 1) {
        name = 'ios';
      } else if (value == 2) {
        name = 'android';
      }
      this.loadData(name);
      // console.log(this.editForm);
    }
  },
  mounted() {
    this.loadData(1);
  }
}
</script>

<style lang="less" scoped>
.versionPage {
    .versionEdit {
        margin-top: 20px;
    }
}
</style>
