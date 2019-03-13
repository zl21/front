<template>
  <keep-alive
    :include="keepAliveLists"
  >
    <component
      :is="currentTable"
      :ref="currentTable"
    />
  </keep-alive>
</template>

<script>
  import Vue from 'vue';
  import { mapState } from 'vuex';
  import mixins from '../__config__/mixins/standardTableLists';
  import { STANDARD_TABLE_COMPONENT_PREFIX } from '../constants/global';
  import StandardTableList from './StandardTableList';
  
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
        if (this.$children.map(d => d.$vnode.data.ref).indexOf(componentName) === -1) {
          Vue.component(componentName, Vue.extend(Object.assign({ mixins: [mixins()] }, StandardTableList)));
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
