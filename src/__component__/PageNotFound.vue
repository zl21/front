<template>
  <div class="pageNotFound" style="height: 100%">
    <h1>没有找到与如下路由：</h1>
    <h1>{{info}}</h1>
    <h1>相匹配的页面</h1>
  </div>
</template>

<script>
  import { CUSTOMIZED_MODULE_PREFIX, PLUGIN_MODULE_PREFIX } from '../constants/global';

  export default {
    data() {
      return {
        info: ''
      };
    },
    mounted() {
      const { customizedModuleName, customizedModuleId, pluginModuleName } = this.$route.params;
      if (this.$route.meta.routePrefix === CUSTOMIZED_MODULE_PREFIX) {
        this.info = `${CUSTOMIZED_MODULE_PREFIX}/${customizedModuleName}/${customizedModuleId}`;
      } else if (this.$route.meta.routePrefix === PLUGIN_MODULE_PREFIX) {
        this.info = `${PLUGIN_MODULE_PREFIX}/${pluginModuleName}`;
      }
    }
  };
</script>
