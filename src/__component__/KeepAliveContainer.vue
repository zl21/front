<template>
  <keep-alive
    :include="keepAliveLists"
  >
    <component :is="currentModule" />
  </keep-alive>
</template>

<script>
  import Vue from 'vue';
  import { mapState } from 'vuex';
  import SMixins from '../__config__/mixins/standardTableLists';
  import HMixins from '../__config__/mixins/horizontalTableDetail';
  import VMixins from '../__config__/mixins/verticalTableDetail';
  import CMixins from '../__config__/mixins/customize';
  import {
    STANDARD_TABLE_LIST_PREFIX,
    VERTICAL_TABLE_DETAIL_PREFIX,
    HORIZONTAL_TABLE_DETAIL_PREFIX,
    CUSTOMIZED_MODULE_PREFIX, CUSTOMIZED_MODULE_COMPONENT_PREFIX, PLUGIN_MODULE_PREFIX, PLUGIN_MODULE_COMPONENT_PREFIX
  } from '../constants/global';
  import StandardTableList from './StandardTableList';
  import VerticalTableDetail from './V.TableDetail';
  import HorizontalTableDetail from './H.TableDetail';
  import moduleName from '../__utils__/getModuleName';
  import PageNotFound from './PageNotFound';
  import CustomizeModule from '../__config__/customize.config';
  import PluginModule from '../__config__/plugin.config';

  const customizeModules = {};
  Object.keys(CustomizeModule).forEach((key) => {
    customizeModules[key.toUpperCase()] = CustomizeModule[key];
  });

  const pluginModules = {};
  Object.keys(PluginModule).forEach((key) => {
    pluginModules[key.toUpperCase()] = PluginModule[key];
  });
  
  export default {
    name: 'KeepAliveContainer',
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
        const { routePrefix } = this.$route.meta;
        if ([STANDARD_TABLE_LIST_PREFIX, VERTICAL_TABLE_DETAIL_PREFIX, HORIZONTAL_TABLE_DETAIL_PREFIX].indexOf(routePrefix) !== -1) {
          this.generateFrameComponent();
        } else if (routePrefix === CUSTOMIZED_MODULE_PREFIX) {
          this.generateCustomizedComponent();
        } else if (routePrefix === PLUGIN_MODULE_PREFIX) {
          this.generatePluginComponent();
        }
      },
      generateFrameComponent() {
        const componentName = moduleName();
        const { routePrefix } = this.$route.meta;
        let mixins = {};
        let component = {};
        switch (routePrefix) {
        case STANDARD_TABLE_LIST_PREFIX:
          mixins = SMixins();
          component = StandardTableList;
          break;
        case VERTICAL_TABLE_DETAIL_PREFIX:
          mixins = VMixins();
          component = VerticalTableDetail;
          break;
        case HORIZONTAL_TABLE_DETAIL_PREFIX:
          component = HorizontalTableDetail;
          mixins = HMixins();
          break;
        default:
          break;
        }
        if ([STANDARD_TABLE_LIST_PREFIX, VERTICAL_TABLE_DETAIL_PREFIX, HORIZONTAL_TABLE_DETAIL_PREFIX].indexOf(routePrefix) === -1) { return; }
        if (Vue.component(componentName) === undefined) {
          Vue.component(componentName, Vue.extend(Object.assign({ mixins: [mixins], isKeepAliveModel: true }, component)));
        }
        this.currentModule = componentName;
      },
      generateCustomizedComponent() {
        const externalModules = (window.ProjectConfig || { externalModules: undefined }).externalModules || {};
        const { customizedModuleName, customizedModuleId } = this.$route.params;
        const { routePrefix } = this.$route.meta;
        if (routePrefix !== CUSTOMIZED_MODULE_PREFIX) { return; }
        const componentName = `${CUSTOMIZED_MODULE_COMPONENT_PREFIX}.${customizedModuleName}.${customizedModuleId}`;
        if (Vue.component(componentName) === undefined) {
          const target = externalModules[customizedModuleName] || customizeModules[customizedModuleName];
          console.log('target', target);
          if (target) {
            if (typeof target.component === 'function') {
              Vue.component(componentName, target.component);
              Vue.component(componentName)().then((result) => {
                Vue.component(componentName, Vue.extend(Object.assign({ mixins: [CMixins()] }, result.default)));
              });
              this.currentModule = componentName;
            } else {
              Vue.component(componentName, Vue.extend(Object.assign({ mixins: [CMixins()] }, target.component)));
              this.currentModule = componentName;
            }
          } else {
            Vue.component(componentName, PageNotFound);
            this.currentModule = componentName;
          }
        } else {
          this.currentModule = componentName;
        }
      },
      generatePluginComponent() {
        const { pluginModuleName } = this.$route.params;
        const { routePrefix } = this.$route.meta;
        if (routePrefix !== PLUGIN_MODULE_PREFIX) { return; }
        const componentName = `${PLUGIN_MODULE_COMPONENT_PREFIX}.${pluginModuleName}`;
        if (Vue.component(componentName) === undefined) {
          const target = pluginModules[pluginModuleName] ? pluginModules[pluginModuleName] : undefined;
          Vue.component(componentName, target ? target.component : Vue.extend(Object.assign({}, PageNotFound)));
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
