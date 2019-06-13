<template>
  <div style="height: 100%">
    <h1>没有找到：</h1>
    <h1>{{info}}</h1>
    <h1>对应的自定义界面入口</h1>
  </div>
</template>

<script>
  import { CUSTOMIZED_MODULE_PREFIX } from '../constants/global';
  
  export default {
    data() {
      return {
        info: ''
      };
    },
    mounted() {
      const { customizedModuleName, customizedModuleId } = this.$route.params;
      this.info = `${CUSTOMIZED_MODULE_PREFIX}/${customizedModuleName}/${customizedModuleId}`;
    }
  };
</script>

<style scoped>
h1 {
  text-align: center;
  margin-top: 30px;
}
</style>
