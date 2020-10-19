<template>
  <keep-alive
    :include="keepAliveLists"
  >
    <component
      :is="currentModule"
      :url-name="urlName"
    />
  </keep-alive>
</template>

<script>
  import Vue from 'vue';
  import { mapState, mapActions, mapMutations } from 'vuex';
  import SMixins from '../__config__/mixins/standardTableLists';
  import HMixins from '../__config__/mixins/horizontalTableDetail';
  import VMixins from '../__config__/mixins/verticalTableDetail';
  import CMixins from '../__config__/mixins/customize';
  import {
    STANDARD_TABLE_LIST_PREFIX,
    STANDARD_COMMONTABLE_LIST_PREFIX,
    VERTICAL_TABLE_DETAIL_PREFIX,
    HORIZONTAL_TABLE_DETAIL_PREFIX,
    LINK_MODULE_COMPONENT_PREFIX,
    CUSTOMIZED_MODULE_PREFIX, CUSTOMIZED_MODULE_COMPONENT_PREFIX, PLUGIN_MODULE_PREFIX, PLUGIN_MODULE_COMPONENT_PREFIX,
    LINK_MODULE_PREFIX,
    customizeMixins,
  } from '../constants/global';
  import StandardTableList from './StandardTableList.vue';
  import VerticalTableDetail from './V.TableDetail.vue';
  import HorizontalTableDetail from './H.TableDetail.vue';
  import moduleName from '../__utils__/getModuleName';
  import getUserenv from '../__utils__/getUserenv';

  import PageNotFound from './PageNotFound.vue';
  import LinkPage from './linkPage.vue';

  import CustomizeModule from '../__config__/customize.config';
  import PluginModule from '../__config__/plugin.config';

  const customizeModules = {};
  Object.keys(CustomizeModule).forEach((key) => {
    customizeModules[key.toUpperCase()] = CustomizeModule[key];
  });

  let pluginModules = {};
  Object.keys(PluginModule).forEach((key) => {
    pluginModules[key.toUpperCase()] = PluginModule[key];
  });
  
  
  export default {
    name: 'KeepAliveContainer',
    data() {
      return {
        currentModule: null,
        urlName: '',
      };
    },
   
    computed: {
      ...mapState('global', ['keepAliveLists', 'menuLists', 'LinkUrl', 'primaryMenuIndex', 'keepAliveLabelMaps'])
    },
    methods: {
      ...mapActions('global', ['updateAccessHistory']),
      ...mapMutations('global', ['increaseLinkUrl', 'addKeepAliveLabelMaps']),
      generateComponent() {
        const { routePrefix } = this.$route.meta;
        if ([STANDARD_TABLE_LIST_PREFIX, STANDARD_COMMONTABLE_LIST_PREFIX, VERTICAL_TABLE_DETAIL_PREFIX, HORIZONTAL_TABLE_DETAIL_PREFIX].indexOf(routePrefix) !== -1) {
          this.generateFrameComponent();
        } else if (routePrefix === CUSTOMIZED_MODULE_PREFIX) {
          this.generateCustomizedComponent();
        } else if (routePrefix === PLUGIN_MODULE_PREFIX) {
          this.generatePluginComponent();
        } else if (routePrefix === LINK_MODULE_PREFIX) {
          this.generateLinkComponent();
        }
      },
      generateFrameComponent() {
        const componentName = moduleName();
        const { routePrefix } = this.$route.meta;
        let mixins = {};
        let component = {};
        let mixinsCustomize = {};
        switch (routePrefix) {
        case STANDARD_TABLE_LIST_PREFIX:
          mixins = SMixins();
          component = StandardTableList;
          mixinsCustomize = customizeMixins().standardTableListsCustomize ? customizeMixins().standardTableListsCustomize : {};
          break;
        case STANDARD_COMMONTABLE_LIST_PREFIX:
          mixins = SMixins();
          component = StandardTableList;
          mixinsCustomize = customizeMixins().standardTableListsCustomize ? customizeMixins().standardTableListsCustomize : {};
          break;
        case VERTICAL_TABLE_DETAIL_PREFIX:
          mixins = VMixins();
          component = VerticalTableDetail;
          mixinsCustomize = customizeMixins().verticalTableDetailCustomize ? customizeMixins().verticalTableDetailCustomize : {};
          break;
        case HORIZONTAL_TABLE_DETAIL_PREFIX:
          component = HorizontalTableDetail;
          mixins = HMixins();
          mixinsCustomize = customizeMixins().horizontalTableDetailCustomize ? customizeMixins().horizontalTableDetailCustomize : {};
          break;
        default:
          break;
        }
        if ([STANDARD_TABLE_LIST_PREFIX, STANDARD_COMMONTABLE_LIST_PREFIX, VERTICAL_TABLE_DETAIL_PREFIX, HORIZONTAL_TABLE_DETAIL_PREFIX].indexOf(routePrefix) === -1) { return; }
        if (Vue.component(componentName) === undefined) {
          Vue.component(componentName, Vue.extend(Object.assign({ mixins: [mixins, mixinsCustomize], isKeepAliveModel: true }, component)));
        }
        this.currentModule = componentName;
      },
      generateCustomizedComponent() {
        const externalModules = (window.ProjectConfig || { externalModules: undefined }).externalModules || {};
        const { customizedModuleName, customizedModuleId } = this.$route.params;
        const { routePrefix } = this.$route.meta;
        if (routePrefix !== CUSTOMIZED_MODULE_PREFIX) { return; }
        const componentName = `${CUSTOMIZED_MODULE_COMPONENT_PREFIX}.${customizedModuleName}.${customizedModuleId}`;
        // if (customizedModuleName === 'customizeReport') {
     
        // } else 
        if (Vue.component(componentName) === undefined) {
          const target = externalModules[customizedModuleName] || customizeModules[customizedModuleName];
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
          if (window.ProjectConfig && window.ProjectConfig.externalPluginModules) {
            pluginModules = Object.assign({}, pluginModules, window.ProjectConfig.externalPluginModules);
          }
          const target = pluginModules[pluginModuleName] ? pluginModules[pluginModuleName] : undefined;
          if (target && target.component) {
            Vue.component(componentName, target.component);
          } else {
            Vue.component(componentName, Vue.extend(Object.assign({}, PageNotFound)));
          }
        }
        this.currentModule = componentName;
      },
      generateLinkComponent() {
        const { linkModuleName } = this.$route.params;
        const componentName = `${LINK_MODULE_COMPONENT_PREFIX}.${linkModuleName}`;
        if (this.LinkUrl.length > 0) {
          this.LinkUrl.forEach((url) => {
            if (url[linkModuleName]) {
              this.urlName = getUserenv({ url: url[linkModuleName] });
              if (Vue.component(componentName) === undefined) {
                Vue.component(componentName, LinkPage);
              }
              this.currentModule = componentName;

              // this.urlName = url[linkModuleId];
            }
          });
        }
        const { routePrefix } = this.$route.meta;
        if (routePrefix !== LINK_MODULE_PREFIX) { return; }
        if (!this.urlName) {
          if (Vue.component(componentName) === undefined) {
            Vue.component('PageNotFound', PageNotFound);
          }
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
      },
      LinkUrl: {
        handler(val) {
          if (val && val.length > 0) {
            const { routePrefix } = this.$route.meta;
            if (routePrefix === LINK_MODULE_PREFIX) {
              this.generateComponent();
            }
          }
        }
      },
      primaryMenuIndex: {
        handler(val) {
          const { routePrefix } = this.$route.meta;
          if (routePrefix === LINK_MODULE_PREFIX) {
            const iFrameForLinkPage = document.createElement('div');
            if (val !== -1) {
              iFrameForLinkPage.id = 'iFrameForLinkPage';
              iFrameForLinkPage.style.width = '100%';
              iFrameForLinkPage.style.height = '100%';
              iFrameForLinkPage.style.zIndex = '10';
              iFrameForLinkPage.style.position = 'absolute';
              iFrameForLinkPage.style.top = '0';
              iFrameForLinkPage.style.left = '0';
              document.getElementById('content').appendChild(iFrameForLinkPage);
            } else if (val === -1) {
              const elem = document.getElementById('iFrameForLinkPage');
              if (elem) {
                document.getElementById('content').removeChild(elem);
              }
            }
          } else {
            const elem = document.getElementById('iFrameForLinkPage');
            if (elem) {
              document.getElementById('content').removeChild(elem);
            }
          }
        }
      }
    },
  };
</script>
