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
  import { mapState, mapActions } from 'vuex';
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
        currentModule: null
      };
    },
    computed: {
      ...mapState('global', ['keepAliveLists'])
    },
    methods: {
      ...mapActions('global', ['updateAccessHistory']),
      generateComponent() {
        const externalModules = (window.ProjectConfig || { externalModules: undefined }).externalModules || {};
        const { customizedModuleName, customizedModuleId } = this.$route.params;
        const { routePrefix } = this.$route.meta;
        if (routePrefix !== CUSTOMIZED_MODULE_PREFIX) { return; }
        const componentName = `${CUSTOMIZED_MODULE_COMPONENT_PREFIX}.${customizedModuleName}.${customizedModuleId}`;
        if (Vue.component(componentName) === undefined) {
          const target = externalModules[customizedModuleName] || customizeModules[customizedModuleName];
          if (target) {
            Vue.component(componentName, target.component);
            Vue.component(componentName)().then((result) => {
              Vue.component(componentName, Vue.extend(Object.assign({ mixins: [mixins()] }, result.default)));
            });
          } else {
            Vue.component(componentName, PageNotFound);
          }
        }
        this.currentModule = componentName;
      }
    },
    mounted() {
      this.generateComponent();
      // const { customizedModuleId } = this.$route.params;
      // this.updateAccessHistory({ type: 'action', id: customizedModuleId });
    },
    watch: {
      $route() {
        this.generateComponent();
      },
    }
  };
</script>
