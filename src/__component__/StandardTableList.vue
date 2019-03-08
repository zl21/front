<template>
  <div class="StandardTableListRootDiv">
    <AgTable
      :pageAttribute="ag.pageAttribute"
      :datas="ag.datas"
    />
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import router from '../__config__/router.config';
  import AgTable from './StandardTable';
  import { STANDARD_TABLE_COMPONENT_PREFIX } from '../constants/global';

  const getComponentName = () => {
    const { tableName, tableId } = router.currentRoute.params;
    const componentName = `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
    return componentName;
  };
  

  export default {
    components: {
      AgTable
    },
    computed: {
      ...mapState(getComponentName(), {
        ag: ({ ag }) => ag
      })
    },
    methods: {
      ...mapActions('global', ['updateAccessHistory']),
      ...mapActions(getComponentName(), ['getQueryListForAg']),
    },
    mounted() {
    },
    activated() {
      this.$nextTick(() => {
        console.log(`${getComponentName()}  activated`);
        const { tableName, tableId } = this.$route.params;
        this.getQueryListForAg({ table: tableName });
        this.updateAccessHistory({ type: 'table', id: tableId });
      });
    }
  };
</script>

<style scoped lang="less">
  .StandardTableListRootDiv {
    width: 100%;
    overflow: auto;
  }
</style>
