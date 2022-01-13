<template>
  <keep-alive
    :include="componentCacheList"
  >
    <component
      :is="currentTable"
    />
  </keep-alive>
</template>

<script>
  import Vue from 'vue';
  import { mapState } from 'vuex';
  import { getSessionObject, deleteFromSessionObject } from '../__utils__/sessionStorage';
  import mixins from '../__config__/mixins/horizontalTableDetail';
  import { HORIZONTAL_TABLE_DETAIL_PREFIX, HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX, HAS_BEEN_DESTROYED_MODULE } from '../constants/global';
  import HorizontalTableDetail from './H.TableDetail';
  import moduleName from '../__utils__/getModuleName';
  
  export default {
    name: `${HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX}.Table.KeepAlive`,
    data() {
      return {
        currentTable: null,
        componentCacheList: []
      };
    },
    computed: {
      ...mapState('global', ['keepAliveLists'])
    },
    methods: {
      generateComponent() {
        const { routePrefix } = this.$route.meta;
        if (routePrefix !== HORIZONTAL_TABLE_DETAIL_PREFIX) { return; }
        const componentName = moduleName();
        const hasBeenDestroyed = getSessionObject(HAS_BEEN_DESTROYED_MODULE)[componentName];
        if (Vue.component(componentName) === undefined || hasBeenDestroyed) {
          Vue.component(componentName, Vue.extend(Object.assign({ mixins: [mixins()], isKeepAliveModel: true }, HorizontalTableDetail)));
          deleteFromSessionObject(HAS_BEEN_DESTROYED_MODULE, componentName);
        }
        this.currentTable = componentName;
      }
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
