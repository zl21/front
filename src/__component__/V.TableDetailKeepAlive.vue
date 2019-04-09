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
  import mixins from '../__config__/mixins/verticalTableDetail';
  import { VERTICAL_TABLE_DETAIL_COMPONENT_PREFIX, VERTICAL_TABLE_DETAIL_PREFIX } from '../constants/global';
  import VerticalTableDetail from './V.TableDetail';
  
  export default {
    name: 'VerticalTableDetailKeepAlive',
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
        if (Vue.component(componentName) === undefined) {
          Vue.component(componentName, Vue.extend(Object.assign({ mixins: [mixins()] }, VerticalTableDetail)));
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
