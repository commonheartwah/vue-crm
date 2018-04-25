<template lang="html">
  <!-- 新增 -->
  <div class="page">
    <el-form :model='addForm' :rules='addFormRules' ref="addForm" label-width="80px" label-position="right">
      <el-form-item label='字段名' prop='name'>
        <el-input v-model='addForm.name'></el-input>
      </el-form-item>
      <el-form-item label='描述' prop='desc'>
        <el-input v-model='addForm.desc'></el-input>
      </el-form-item>
      <el-form-item label="类型" prop='type'>
        <el-radio-group v-model="addForm.type">
          <el-radio class="radio" v-for='item in allTypes' :label="item.index" :key='item.index'>{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态" prop='status'>
        <el-radio-group v-model="addForm.status">
          <el-radio class="radio" :label="1">有效</el-radio>
          <el-radio class="radio" :label="0">无效</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label='标签' prop='dynamicTags'>
        <div>
          <el-tag
            :key="tag"
            v-for="tag in addForm.dynamicTags"
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
      <div class="container">
        <div class="block">
          <span class="demonstration">新增</span>
          <el-cascader
            expand-trigger="hover"
            placeholder="元数据类型"
            :options="options"
            @change="handleChange"
          >
          </el-cascader>
        </div>
        <div v-for="(item, index) in addForm.meta_data" class="piece">
          <metaData :meta_data='item'></metaData>
        </div>
      </div>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import {
  addTemp,
  updateTemp,
  getTempById,
  getTempList,
  getKvList
} from '../../api/api'
import metaData
from './meta-data'
export default {
  components: {
    metaData
  },
  data() {
    return {
      /*
        addForm 表单字段类型
       */
      addForm: {
        name: '',
        desc: '',
        meta_data: [
          // {
          //   label: '',
          //   name: '',
          //   required: '',
          //   type: '',
          //   subMeta: [{
          //     label: '',
          //     name: '',
          //     required: '',
          //     type: '',
          //     subMeta: []
          //   }]
          // },
          // {
          //   label: '',
          //   name: '',
          //   required: '',
          //   type: '',
          //   subMeta: []
          // }
        ],
        dynamicTags: [],
        status: 1,
        type: 1
      },
      /*
        addFormRules 表单字段类型
       */
      addFormRules: {
        name: [{
          required: true,
          message: '请输入名称',
          trigger: 'blur'
        }],
        desc: [{
          required: true,
          message: '请输入描述',
          trigger: 'blur'
        }],
        label: [{
          required: true,
          message: '请输入描述',
          trigger: 'blur'
        }],
        meta_data: [{
          required: true
        }]
      },
      /*
        tags 标签
       */
      inputVisible: false,
      inputValue: '',
      /*
        下拉菜单相关
       */
      options: [{
          value: '0',
          label: '字符串',
        },
        {
          value: '1',
          label: '整数',
        },
        {
          value: '2',
          label: '小数',
        },
        {
          value: '3',
          label: '布尔值',
        },
        {
          value: '4',
          label: '数组',
          children: [{
            value: '4_0',
            label: '字符串',
          }, {
            value: '4_1',
            label: '整数',
          }, {
            value: '4_2',
            label: '小数',
          }, {
            value: '4_3',
            label: '布尔值'
          }]
        },
        {
          value: '5',
          label: '键值对',
          children: [{
            value: '5_0',
            label: '字符串',
          }, {
            value: '5_1',
            label: '整数',
          }, {
            value: '5_2',
            label: '小数',
          }, {
            value: '5_3',
            label: '布尔值',
          }]
        },
        {
          value: '6',
          label: 'JSON',
        },
      ],
      selectedOptions: [],
      // 存储所有的type类型
      allTypes: ''
    }
  },
  methods: {
    /**
     * 初始化请求获取模板的type类型
     */
    initType() {
      getKvList({
        name: '_sys.template_sub_type'
      }).then((res) => {
        if (res.data.success) {
          this.allTypes = JSON.parse(res.data.data.items[0].content).types
        } else {
          this.$notify({
            title: '错误',
            type: 'error',
            message: res.data.msg
          })
        }
      })
    },
    /*
      tags标签
     */
    handleClose(tag) {
      this.addForm.dynamicTags.splice(this.addForm.dynamicTags.indexOf(tag), 1)
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue
      if (inputValue) {
        this.addForm.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    /*
      下拉菜单
     */
    handleChange(value) {
      let flag = value[value.length - 1];
      let obj = {
        label: '',
        name: '',
        required: 1,
        type: value
      }
      if (flag == '6') {
        obj['subMeta'] = []
      }
      this.addForm.meta_data.push(obj)
    },
    /*
      提交
     */
    onSubmit() {
      let para = JSON.parse(JSON.stringify(this.addForm));
      para['description'] = para.desc
      delete para.desc
      para['tags'] = para.dynamicTags.join(',')
      delete para.dynamicTags
      // type为1 代表type里面的第一个类型 这个值是加conf里面配置的
      para.type = '1'
      // 递归循环数组
      this.recursionArr(para.meta_data)
      // 检验表单规则并提交
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          console.log(para);
          para['meta_data'] = JSON.stringify(para['meta_data'])
          addTemp(para).then((res) => {
            console.log(res);
            if (res.data.success) {
              this.$notify({
                title: '成功',
                type: 'success',
                message: '新增成功'
              })
            } else {
              this.$notify({
                title: '错误',
                type: 'error',
                message: res.data.msg
              })
            }
          })
        } else {
          return
        }
      })
    },
    /*
      type 值
     */
    transformType(type) {
      let len = type.length
      if (len > 1) {
        return type[1]
      } else {
        return type[0]
      }
    },
    /*
      递归循环数组
     */
    recursionArr(arr) {
      let self = this
      arr.forEach((item, index) => {
        arr[index].type = self.transformType(item.type)
        //  如果subMeta存在 校验必须为非空
        if (item.subMeta) {
          if (item.subMeta.length) {
            self.recursionArr(item.subMeta)
          } else {
            this.$notify({
              title: '错误',
              type: 'error',
              message: '元数据类型为JSON时,必须新增一个元数据'
            })
            return false
          }
        }
      })
    }
  },
  created() {
    this.initType();
  }
}
</script>

<style lang="less" scoped>
.page {
    width: 100%;
    margin: 20px;
    padding: 20px;
    border: 1px solid #000;
}
.container {
    margin: 20px;
    padding: 20px;
    .demonstration {
        margin-right: 10px;
    }
    .piece {
        margin: 20px;
        padding: 20px;
        border: 1px solid #000;
    }
}
</style>