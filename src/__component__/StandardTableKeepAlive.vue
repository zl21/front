<template>
  <keep-alive :include="keepAliveLists">
    <component :is="currentTable" />
  </keep-alive>
</template>

<script>
  import Vue from 'vue';
  import { mapState } from 'vuex';
  import mixins from '../__config__/mixins/standardTableLists';
  import { STANDARD_TABLE_COMPONENT_PREFIX } from '../constants/global';
  import StandardTableList from './StandardTableList';
  import CustomPages from '../assets/js/customComponent';

  export default {
    name: 'StandardTableKeepAlive',
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
        const componentName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
        const customPage = this.$route.fullPath.split('/')[4];
        if (Vue.component(componentName) === undefined) {
          Vue.component(componentName, Vue.extend(Object.assign({ mixins: [mixins()] }, StandardTableList)));
        }
        CustomPages.forEach((b) => {
          if (b.filePath === customPage) {
            this.currentTable = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}.${b.name}`; 
          }
        });
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
