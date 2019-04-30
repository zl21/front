<template>
  <keep-alive :include="keepAliveLists">
    <component :is="currentTable" />
  </keep-alive>
</template>

<script>
  import Vue from 'vue';
  import { mapState } from 'vuex';
  import mixins from '../__config__/mixins/standardTableLists';
  import { STANDARD_TABLE_LIST_PREFIX, STANDARD_TABLE_COMPONENT_PREFIX } from '../constants/global';
  import StandardTableList from './StandardTableList';
  import moduleName from '../__utils__/getModuleName';


  export default {
    name: `${STANDARD_TABLE_COMPONENT_PREFIX}.Table.KeepAlive`,
    data() {
      return {
        currentTable: null
      };
    },
    computed: {
      ...mapState('global', ['keepAliveLists'])
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
