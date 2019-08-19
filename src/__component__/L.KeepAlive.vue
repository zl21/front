<template>
  <keep-alive
    :include="keepAliveLists"
  >
    <iframe
      :src="linkUrl"
      class="linkUrl"
    />
    <!-- <component
      :is="currentModule"
      v-if="currentModule"
    /> -->
  </keep-alive>
</template>

<script>
  import Vue from 'vue';
  import { mapState } from 'vuex';
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
        linkUrl: '',
        currentModule: ''
      };
    },
    computed: {
      ...mapState('global', ['keepAliveLists', 'menuLists'])
    },
    methods: {
      generateComponent() {
        // const url = this.$route.query.url;
        let url = '';
        const { linkModuleName, linkModuleId } = this.$route.params;
        this.menuLists.forEach((ele) => {
          ele.children.forEach((c) => {
            c.children.forEach((d) => {
              if (d.url && d.url.substring(0, 4) === 'http') {
                if (linkModuleId == d.id) {
                  this.linkUrl = d.url;
                  url = d.url;
                }
              }
            });
          });
        });
        const { routePrefix } = this.$route.meta;
        if (routePrefix !== LINK_MODULE_PREFIX) { return; }
        if (url === '') {
          Vue.component(linkModuleName, Vue.extend(Object.assign({}, PageNotFound)));
        }
        this.currentModule = linkModuleName;
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
<style scoped>
  .linkUrl{
    border:none;
    width: 100%;
    height:100%;
  }
</style>
