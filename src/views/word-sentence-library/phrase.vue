<template>
  <Obase :TYPE="TYPE"></Obase>
</template>

<script>
import Obase from "../../components/word-sentence-library/obase";
export default {
  components: { Obase },
  data() {
    return {
      TYPE: 1
    };
  }
};
</script>

<style lang="less" scoped>

</style>


