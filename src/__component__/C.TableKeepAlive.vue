<template>
  <keep-alive
    :include="keepAliveLists"
  >
    <component
      :is="currentModule"
    />
  </keep-alive>
</template>

<script>
  import Vue from 'vue';
  import { mapState } from 'vuex';
  import CustomizeModule from '../__config__/customize.config';
  import { CUSTOMIZED_MODULE_PREFIX, CUSTOMIZED_MODULE_COMPONENT_PREFIX } from '../constants/global';
  
  const customizeModules = {};
  Object.keys(CustomizeModule).forEach((key) => {
    customizeModules[key.toUpperCase()] = CustomizeModule[key];
  });
  
  export default {
    name: `${CUSTOMIZED_MODULE_COMPONENT_PREFIX}.Table.KeepAlive`,
    data() {
      return {
        currentModule: null
      };
    },
    computed: {
      ...mapState('global', ['keepAliveLists'])
    },
    methods: {
      generateComponent() {
        const { customizedModuleName, customizedModuleId } = this.$route.params;
        const { routePrefix } = this.$route.meta;
        if (routePrefix !== CUSTOMIZED_MODULE_PREFIX) { return; }
        const componentName = `${CUSTOMIZED_MODULE_COMPONENT_PREFIX}.${customizedModuleName}.${customizedModuleId}`;
        if (Vue.component(componentName) === undefined) {
          Vue.component(componentName, customizeModules[customizedModuleName].component);
        }
        this.currentModule = componentName;
      }
    },
    mounted() {
      this.generateComponent();
    },
    watch: {
      $route() {
        this.generateComponent();
      },
    }
  };
</script>
