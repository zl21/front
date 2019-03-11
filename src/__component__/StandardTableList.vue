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
    return `${STANDARD_TABLE_COMPONENT_PREFIX}.${tableName}.${tableId}`;
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
      const { tableName } = this.$route.params;
      this.getQueryListForAg({ table: tableName });
    },
    activated() {
      const { tableId } = this.$route.params;
      this.updateAccessHistory({ type: 'table', id: tableId });
    }
  };
</script>

<style scoped lang="less">
  .StandardTableListRootDiv {
    width: 100%;
    overflow: auto;
  }
</style>
