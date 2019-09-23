<template>
  <keep-alive
    :include="keepAliveLists"
  >
    <iframe
      v-if="urlName"
      id="iframe"
      :src="urlName"
      class="urlName"
    />
    <component
      :is="currentModule"
      v-if="currentModule&&urlName===''"
    />
  </keep-alive>
</template>

<script>
  import Vue from 'vue';
  import { mapState, mapActions, mapMutations } from 'vuex';
  import PageNotFound from './PageNotFound';
  import PluginModule from '../__config__/plugin.config';
  import { LINK_MODULE_PREFIX, LINK_MODULE_COMPONENT_PREFIX } from '../constants/global';
  
  
  const pluginModules = {};
  Object.keys(PluginModule).forEach((key) => {
    pluginModules[key.toUpperCase()] = PluginModule[key];
  });
  
  export default {
    name: `${LINK_MODULE_COMPONENT_PREFIX}.Table.KeepAlive`,
    data() {
      return {
        urlName: '',
        currentModule: null
      };
    },
    computed: {
      ...mapState('global', ['keepAliveLists', 'menuLists', 'LinkUrl', 'primaryMenuIndex', 'keepAliveLabelMaps'])
    },
    methods: {
      ...mapActions('global', ['updateAccessHistory']),
      ...mapMutations('global', ['increaseLinkUrl', 'addKeepAliveLabelMaps']),
      generateComponent() {
        const { linkModuleName, linkModuleId } = this.$route.params;
        if (this.LinkUrl.length > 0) {
          this.LinkUrl.forEach((url) => {
            this.urlName = url[linkModuleId];
          });
        }
        const { routePrefix } = this.$route.meta;
        if (routePrefix !== LINK_MODULE_PREFIX) { return; }
        if (this.urlName === '') {
          Vue.component(linkModuleName, Vue.extend(Object.assign({}, PageNotFound)));
          this.currentModule = linkModuleName;
        }
      },
    },
    mounted() {
      // if (window.sessionStorage.getItem('linkInfo')) {
      //   const linkInfo = JSON.parse(window.sessionStorage.getItem('linkInfo') || null);
      //   if (Object.values(linkInfo).length > 0) {
      //     this.increaseLinkUrl({ linkId: linkInfo.linkId, linkUrl: linkInfo.linkUrl });
      //     this.addKeepAliveLabelMaps({ name: linkInfo.name, label: linkInfo.label });
      //   }
      // }
      this.generateComponent();
    },
    watch: {
      $route() {
        this.generateComponent();
      },
      LinkUrl: {
        handler(val) {
          if (val.length > 0) {
            this.generateComponent();
          }
        }
      },
      primaryMenuIndex: {
        handler(val) {
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
        }
      }
    },
    activated() {
      const { linkModuleId } = this.$route.params;
      this.$store.dispatch('global/updateAccessHistory', { type: 'action', id: linkModuleId });
    }
  };
</script>
<style lang="less" >
  .urlName{
    border:none;
    width: 100%;
    height:100%;
  }
  
</style>
