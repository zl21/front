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
  import { mapState, mapActions, mapMutations } from 'vuex';
  import PageNotFound from './PageNotFound';
  import CustomizeModule from '../__config__/customize.config';
  import { CUSTOMIZED_MODULE_PREFIX, CUSTOMIZED_MODULE_COMPONENT_PREFIX } from '../constants/global';
  import mixins from '../__config__/mixins/customize';
  
  const customizeModules = {};
  Object.keys(CustomizeModule).forEach((key) => {
    customizeModules[key.toUpperCase()] = CustomizeModule[key];
  });
  
  export default {
    name: `${CUSTOMIZED_MODULE_COMPONENT_PREFIX}.Table.KeepAlive`,
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
      ...mapActions('global', ['updateAccessHistory']),
      ...mapMutations('global', ['addKeepAliveLabelMaps']),

      generateComponent() {
        const externalModules = (window.ProjectConfig || { externalModules: undefined }).externalModules || {};
        const { customizedModuleName, customizedModuleId } = this.$route.params;
        const { routePrefix } = this.$route.meta;
        if (routePrefix !== CUSTOMIZED_MODULE_PREFIX) { return; }
        const componentName = `${CUSTOMIZED_MODULE_COMPONENT_PREFIX}.${customizedModuleName}.${customizedModuleId}`;
        if (Vue.component(componentName) === undefined) {
          const target = externalModules[customizedModuleName] || customizeModules[customizedModuleName];
          if (target) {
            if (typeof target.component === 'function') {
              Vue.component(componentName, target.component);
              Vue.component(componentName)().then((result) => {
                Vue.component(componentName, Vue.extend(Object.assign({ mixins: [mixins()] }, result.default)));
              });
              this.currentModule = componentName;
            } else {
              Vue.component(componentName, Vue.extend(Object.assign({ mixins: [mixins()] }, target.component)));
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
    },
    mounted() {
      this.generateComponent();
    },
    watch: {
      $route() {
        this.generateComponent();
        this.componentCacheList = [...this.keepAliveLists]
      },
    }
  };
</script>
