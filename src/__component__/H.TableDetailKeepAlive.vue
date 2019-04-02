<template>
  <keep-alive
    :include="keepAliveLists"
  >
    <component
      :is="currentTable"
    />
  </keep-alive>
</template>

<script>
  import Vue from 'vue';
  import { mapState } from 'vuex';
  import mixins from '../__config__/mixins/horizontalTableDetail';
  import { HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX } from '../constants/global';
  import HorizontalTableDetail from './H.TableDetail';
  
  export default {
    name: 'HorizontalTableDetailKeepAlive',
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
        const { tableName, tableId, itemId } = this.$route.params;
        const componentName = `${HORIZONTAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${itemId}`;
        if (Vue.component(componentName) === undefined) {
          Vue.component(componentName, Vue.extend(Object.assign({ mixins: [mixins()] }, HorizontalTableDetail)));
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
