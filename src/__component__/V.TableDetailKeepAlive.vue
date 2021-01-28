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
  import { getSessionObject, deleteFromSessionObject } from '../__utils__/sessionStorage';
  import mixins from '../__config__/mixins/verticalTableDetail';
  import { VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX, VERTICAL_TABLE_DETAIL_PREFIX, HAS_BEEN_DESTROYED_MODULE } from '../constants/global';
  import VerticalTableDetail from './V.TableDetail';
  
  export default {
    name: `${VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX}.Table.KeepAlive`,
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
        const { routePrefix } = this.$route.meta;
        if (routePrefix !== VERTICAL_TABLE_DETAIL_PREFIX) { return; }
        const componentName = `${VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX}.${tableName}.${tableId}.${itemId}`;
        const hasBeenDestroyed = getSessionObject(HAS_BEEN_DESTROYED_MODULE)[componentName];
        if (Vue.component(componentName) === undefined || hasBeenDestroyed) {
          Vue.component(componentName, Vue.extend(Object.assign({}, { mixins: [mixins()], isKeepAliveModel: true }, VerticalTableDetail)));
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
      },
    },
 
  };
</script>
