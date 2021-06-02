<template>
  <keep-alive
    :include="keepAliveLists"
  >
    <component
      :is="currentModule"
      v-if="show"
      :url-name="urlName"
      @hook:activated="handleActivated"
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
    enableOpenNewTab
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
        sameNewPage: false,
        show: true
      };
    },
   
    computed: {
      ...mapState('global', ['switchTag', 'openedMenuLists', 'keepAliveLists', 'menuLists', 'LinkUrl', 'primaryMenuIndex', 'keepAliveLabelMaps'])
    },
    methods: {
      ...mapActions('global', ['updateAccessHistory']),
      ...mapMutations('global', ['increaseLinkUrl', 'addKeepAliveLabelMaps', 'updataSwitchTag']),
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
        const vuexModuleName = this.$route.meta.moduleName;
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
          mixins = HMixins(vuexModuleName);
          mixinsCustomize = customizeMixins().horizontalTableDetailCustomize ? customizeMixins().horizontalTableDetailCustomize : {};
          break;
        default:
          break;
        }
        if ([STANDARD_TABLE_LIST_PREFIX, STANDARD_COMMONTABLE_LIST_PREFIX, VERTICAL_TABLE_DETAIL_PREFIX, HORIZONTAL_TABLE_DETAIL_PREFIX].indexOf(routePrefix) === -1) { return; }
          component.name = componentName;
        if (Vue.component(componentName) === undefined) {
          Vue.component(componentName, Vue.extend(Object.assign({ mixins: [mixins, mixinsCustomize], isKeepAliveModel: true }, component)));
        } else if (this.sameNewPage) {
          this.sameNewPage = false;
          this.show = false;
         
          Vue.component(componentName, Vue.extend(Object.assign({ mixins: [mixins, mixinsCustomize], isKeepAliveModel: true }, component)));
          this.show = true;
        }
        // else if (this.sameNewPage) {
        //   this.$store.commit('global/updataNewTagForNewTab', false);
        //   setTimeout(() => {
        //     // Vue.component(componentName, Vue.extend(Object.assign({ mixins: [mixins, mixinsCustomize], isKeepAliveModel: true }, component)));
        //     // const a = window.vm.$children[0].$children[0].$children[2].$children[1].$children;
        //     // a.map((item, i) => {
        //     //   if (item.moduleComponentName === moduleName()) {
        //     //     a.splice(i, 1);
        //     //   }
        //     // });
        //     if (!this.keepAliveLists.include(componentName)) {
        //       Vue.component(componentName, Vue.extend(Object.assign({ mixins: [mixins, mixinsCustomize], isKeepAliveModel: true }, component)));
        //     }
        //     this.currentModule = componentName;
        //     this.$forceUpdate();
        //     // this.show = false;
        //     // this.show = true;
        //   }, 500);
        // }
        this.currentModule = componentName;
      },
      generateCustomizedComponent() {
        const externalModules = (window.ProjectConfig || { externalModules: undefined }).externalModules || {};
        const { customizedModuleName, customizedModuleId } = this.$route.params;
        const { query } = this.$route;
        const { routePrefix } = this.$route.meta;
        if (routePrefix !== CUSTOMIZED_MODULE_PREFIX) { return; }
        const componentName = `${CUSTOMIZED_MODULE_COMPONENT_PREFIX}.${customizedModuleName}.${customizedModuleId}`;
        // if (customizedModuleName === 'customizeReport') {
     
        // } else 
        if (Vue.component(componentName) === undefined) {
          let target = null;
          const mixinsCustomize = customizeMixins().taskList ? customizeMixins().taskList : {};
          
          if (query.type === 'rpt') { // rpt类型特殊处理 
            // 元数据当前表type配置为rpt时，按照自定义界面逻辑执行路由逻辑，与自定义界面区别是，不再按照url内配置的"CUSTOMIZE/"后的自定义标示来加载自定义界面配置文件中的对应字段，
            // 而是根据路由的参数判断为rpt类型，则加载固定前端配置文件内的字段customizeReport字段对应的组件
            target = externalModules.CUSTOMIZEREPORT || customizeModules.CUSTOMIZEREPORT;
          } else {
            target = externalModules[customizedModuleName] || customizeModules[customizedModuleName];
          }
          if (target) {
            if (typeof target.component === 'function') {
              Vue.component(componentName, target.component);
              Vue.component(componentName)().then((result) => {
                Vue.component(componentName, Vue.extend(Object.assign({ mixins: [CMixins(), target.label === 'taskList' ? mixinsCustomize : {}] }, result.default)));
              });
              this.currentModule = componentName;
            } else {
              if (target.component && target.component.name) {
                // 修改自定义组件name
                target.component.name = componentName;
              }
              Vue.component(componentName, Vue.extend(Object.assign({ mixins: [CMixins(), target.label === 'taskList' ? mixinsCustomize : {}] }, target.component)));
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

      // 处理接口请求结束后没有关闭Loading的问题
      handleActivated() {
        const hideList = this.$store.state.global.currentLoading;
        const loadingName = this.$route.meta.moduleName.replace(/\./g, '-');
        const tpl = document.querySelector(`#${loadingName}-loading`);
        // console.log('激活拦截', hideList, loadingName);
        // loadingName可能是空字符串
        if (hideList.includes(loadingName) && loadingName && tpl) {
          // console.log('存在未关闭loading-----');
          tpl.remove();
          this.$store.commit('global/deleteLoading', loadingName);
        }
      }
    },
    mounted() {
      this.generateComponent();
    },
   
    watch: {
      
      $route(to, from) {
        if (enableOpenNewTab() && !this.switchTag) {
          if (!this.switchTag) {
            this.updataSwitchTag(false);

            if (to.params.itemId === 'New') { // 当前打开的新增界面，需要判断是否已经存在该表的新增界面,存在即开启新tab,并关闭原有存在的该表新增界面tab
              this.openedMenuLists.map((d) => {
                if ((d.itemId === to.params.itemId && d.tableName === to.params.tableName)// 模块名相同
                  && d.routeFullPath === to.fullPath
                  // (
                  //   `${d.routeFullPath}?isBack=true` === to.fullPath 
                  // || `${to.fullPath}?isBack=true` === d.routeFullPath
                  // || (`${this.$router.currentRoute.fullPath}?isBack=true` === to.fullPath 
                  // || `${to.fullPath}?isBack=true` === this.$router.currentRoute.fullPath) 
                  // || (`${this.$router.currentRoute.fullPath}?isBack=true` === to.fullPath)
                  // || (to.fullPath.includes('?isBack=true') && d.routeFullPath === to.fullPath)
                  // )// 当前处于激活状态的不是即将要打开的新增tab或者复制tab
                  // 当前激活的tab不是即将打开的tab，用于区分新增和复制
                ) {
                  const getVueCompontent = window.vm.$children[0].$children[0].$children[2].$children[1].$children;
                  getVueCompontent.map((item, i) => {
                    if (item.moduleComponentName === moduleName()) {
                      getVueCompontent.splice(i, 1);
                    }
                  });
                  this.sameNewPage = true;

                  const currentTabInfo = {
                    isActive: true,
                    itemId: to.params.itemId,
                    keepAliveModuleName: d.keepAliveModuleName,
                    label: d.label,
                    routePrefix: d.routePrefix,
                    tableName: d.tableName,
                    routeFullPath: to.fullPath
                  };
                  this.$store.commit('global/spliceMenuLists', currentTabInfo);// 更新当前ActiveTab
                }
              });
            } 
          } else {
            this.updataSwitchTag(false);
          }
        } else {
          this.updataSwitchTag(false);
        }
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
