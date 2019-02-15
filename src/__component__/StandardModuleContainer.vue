<template>
  <div>
    <keep-alive>
      <component :is="currentTable" :ref="currentTable"></component>
    </keep-alive>
  </div>
</template>

<script>
  import Vue from 'vue';
  import StandardTableList from './StandardTableList';
  
  export default {
    data() {
      return {
        currentTable: undefined
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
      currentTable(n, o) {
        console.log({ n, o });
      },
    }
  };
</script>

<style scoped>

</style>
