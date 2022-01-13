<template>
  <keep-alive
    :include="componentCacheList"
  >
    <component
      :is="currentModule"
    />
  </keep-alive>
</template>

<script>
  import Vue from 'vue';
  import { mapState } from 'vuex';
  import PageNotFound from './PageNotFound';
  import PluginModule from '../__config__/plugin.config';
  import { PLUGIN_MODULE_PREFIX, PLUGIN_MODULE_COMPONENT_PREFIX } from '../constants/global';
  
  const pluginModules = {};
  Object.keys(PluginModule).forEach((key) => {
    pluginModules[key.toUpperCase()] = PluginModule[key];
  });
  
  export default {
    name: `${PLUGIN_MODULE_COMPONENT_PREFIX}.Table.KeepAlive`,
    data() {
      return {
        currentModule: null,
        componentCacheList: []
      };
    },
    computed: {
      ...mapState('global', ['keepAliveLists'])
    },
    methods: {
      generateComponent() {
        const { pluginModuleName } = this.$route.params;
        const { routePrefix } = this.$route.meta;
        if (routePrefix !== PLUGIN_MODULE_PREFIX) { return; }
        const componentName = `${PLUGIN_MODULE_COMPONENT_PREFIX}.${pluginModuleName}`;
        if (Vue.component(componentName) === undefined) {
          const target = pluginModules[pluginModuleName] ? pluginModules[pluginModuleName] : undefined;
          Vue.component(componentName, target ? target.component : Vue.extend(Object.assign({}, PageNotFound)));
        }
        this.currentModule = componentName;
        this.componentCacheList = [...this.keepAliveLists]
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
