<template>
  <keep-alive
    :include="componentCacheList"
  >
    <component :is="currentTable" />
  </keep-alive>
</template>

<script>
  import Vue from 'vue';
  import { mapState } from 'vuex';
  import mixins from '../__config__/mixins/standardTableLists';
  import { STANDARD_TABLE_LIST_PREFIX, STANDARD_TABLE_COMPONENT_PREFIX, STANDARD_COMMONTABLE_COMPONENT_PREFIX } from '../constants/global';
  import StandardTableList from './StandardTableList.vue';
  import moduleName from '../__utils__/getModuleName';

  export default {
    name: `${this.name}`,
    data() {
      return {
        currentTable: null,
        componentCacheList: []
      };
    },
    computed: {
      ...mapState('global', ['keepAliveLists']),
      name() {
        if (this.$route.meta.routePrefix === '/SYSTEM/COMMONTABLE') {
          return `${STANDARD_COMMONTABLE_COMPONENT_PREFIX}.Table.KeepAlive`;
        } if (this.$route.meta.routePrefix === '/SYSTEM/TABLE') {
          return `${STANDARD_TABLE_COMPONENT_PREFIX}.Table.KeepAlive`;
        }
        return null;
      }
    },
    methods: {
      generateComponent() {
        const { routePrefix } = this.$route.meta;
        if (routePrefix !== STANDARD_TABLE_LIST_PREFIX) { return; }
        const componentName = moduleName();
        if (Vue.component(componentName) === undefined) {
          Vue.component(componentName, Vue.extend(Object.assign({ mixins: [mixins()], isKeepAliveModel: true }, StandardTableList)));
        }
     
        this.currentTable = componentName;
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
