<template>
  <keep-alive>
    <component
      :is="currentTable"
      :ref="currentTable"
      :include="keepAliveLists"
    />
  </keep-alive>
</template>

<script>
  import Vue from 'vue';
  import { mapState } from 'vuex';
  import { STANDARD_TABLE_COMPONENT_PREFIX } from '../constants/global';
  
  const StandardTableList = () => import('./StandardTableList');
  
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
        Vue.component(componentName, StandardTableList);
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
