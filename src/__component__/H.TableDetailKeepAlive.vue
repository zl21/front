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
  import { HORIZONTAL_TABLE_DETAIL_PREFIX } from '../constants/global';
  import HorizontalTableDetail from './H.TableDetail';
  import moduleName from '../__utils__/getModuleName';
  
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
        const { routePrefix } = this.$route.meta;
        if (routePrefix !== HORIZONTAL_TABLE_DETAIL_PREFIX) { return; }
        const componentName = moduleName();

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
