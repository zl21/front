<template>
  <keep-alive>
    <component :is="currentTable" :ref="currentTable"></component>
  </keep-alive>
</template>

<script>
  import Vue from 'vue';
  
  const StandardTableList = () => import('./StandardTableList');
  
  export default {
    name: 'StandardTableKeepAlive',
    data() {
      return {
        currentTable: null
      };
    },
    methods: {
      generateComponent() {
        const { tableName, tableId } = this.$route.params;
        const componentName = `StandardTable.${tableName}.${tableId}`;
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

<style scoped>

</style>
