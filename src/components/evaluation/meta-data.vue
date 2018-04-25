<template lang="html">
  <div>
    <el-form-item label='字段名'>
      <el-input v-model='meta_data.name'></el-input>
    </el-form-item>
    <el-form-item label='描述'>
      <el-input v-model='meta_data.label'></el-input>
    </el-form-item>
    <el-form-item label="必须">
      <el-radio-group v-model="meta_data.required">
        <el-radio class="radio" :label="1">必须</el-radio>
        <el-radio class="radio" :label="0">非必须</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="新增" v-if="meta_data.type[0] == '6'">
      <!-- <el-button @click='addSub()'>点击选择类型即可添加新的元数据</el-button> -->
      <el-cascader
        expand-trigger="hover"
        placeholder="元数据类型"
        :options="options"
        @change="handleChange_add"
      >
      </el-cascader>
    </el-form-item>
    <el-form-item label="类型">
      <el-cascader
        expand-trigger="hover"
        placeholder="元数据类型"
        :options="options"
        v-model="meta_data.type"
        @change="handleChange_pro"
      >
      </el-cascader>
    </el-form-item>
    <repeat v-for="(item, index) in meta_data.subMeta" :key="item" :meta_data="item" class="piece"></repeat>
  </div>
</template>

<script>
export default {
  name: 'repeat',
  props: ['meta_data'],
  data() {
    return {
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
      selectedOptions: []
    }
  },
  methods: {
    addSub() {
      this.meta_data.subMeta.push({
        label: '',
        name: '',
        required: '',
        type: '',
        subMeta: []
      })
    },
    /*
      下拉菜单
     */
    //  新增
    handleChange_add(value) {
      console.log(value);
      console.log(value[value.length - 1])
      let flag = value[value.length - 1]
      let obj = {
        label: '',
        name: '',
        required: 1,
        type: value
      }
      if (flag == '6') {
        obj['subMeta'] = []
      }
      this.meta_data.subMeta.push(obj)
    },
    // 改变自身的类型
    handleChange_pro(value) {
      let flag = value[value.length - 1]
      console.log(flag);
      console.log(this.meta_data.type);
      if (flag == '6') {
        // this.meta_data['subMeta'] = [];
        this.$set(this.meta_data, 'subMeta', [])
      } else {
        this.$delete(this.meta_data, 'subMeta')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.piece {
    border: 1px solid #000;
    margin: 20px;
    padding: 20px;
}
.block {
    border: 1px solid #000;
    padding: 10px;
}
</style>
