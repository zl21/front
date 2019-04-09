<template>
  <keep-alive :include="keepAliveLists">
    <component :is="currentTable" />
  </keep-alive>
</template>

<script>
  import Vue from 'vue';
  import { mapState } from 'vuex';
  import mixins from '../__config__/mixins/standardTableLists';
  import { STANDARD_TABLE_COMPONENT_PREFIX, STANDARD_TABLE_LIST_PREFIX } from '../constants/global';
  import StandardTableList from './StandardTableList';
  import CustomPages from '../assets/js/customComponent';

  const _import_custom = file => require(`../__component__/${file}.vue`).default;
  export default {
    name: 'S.Table.KeepAlive',
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
        const { tableName, tableId } = this.$route.params;
        const { routePrefix } = this.$route.meta;
        if (routePrefix !== STANDARD_TABLE_LIST_PREFIX) { return; }
        const componentName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
        // const customPage = this.$route.fullPath.split('/')[4];
        // if (this.$children.map(d => d.$vnode.data.ref).indexOf(componentName) === -1) {
        const customPage = this.$route.fullPath.split('/')[4];
        if (Vue.component(componentName) === undefined) {
          Vue.component(componentName, Vue.extend(Object.assign({ mixins: [mixins()] }, StandardTableList)));
        }
        // CustomPages.forEach((b) => {
        //   if (b.filePath === customPage) {
        //     const componentName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${b.name}`;
        //     this.currentTable = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}.${b.name}`; 
        //     Vue.component(componentName, Vue.extend(Object.assign({ mixins: [mixins()] },)));
        //   }
        // });
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
