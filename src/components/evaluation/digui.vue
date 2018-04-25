<template lang="html" id="digui">
    <div>
      <span style="color: red">{</span>
      <h1>元数据的标签是--------{{ meta_data.label }}</h1>
      <h2 style="color: red" @click="addSub()">SubMeta</h2>
      <div style="margin-left: 30px;">
        <abc v-for='(item, index) in meta_data.begin' :meta_data='item' :meta_data_index='index' :key='index'></abc>
      </div>
      <span style="color: red">},</span>
    </div>
</template>

<script>
export default {
  name: 'abc',
  props: ['meta_data', 'meta_data_index'],
  data() {
    return {}
  },
  methods: {
    addSub() {
      this.meta_data.begin.push({
        label: `新技能get`,
        begin: []
      })
      console.log(this.meta_data.label);
    }
  },
  computed: {
    haveSub: function() {
      return this.meta_data.begin && this.meta_data.begin.length
    }
  },
}
</script>

<style lang="css">
</style>
