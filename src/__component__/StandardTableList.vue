<template>
  <div class="StandardTableListRootDiv">
    <AgTable
      :page-attribute="pageAttribute"
      :datas="ag.datas"
      :on-page-change="onPageChange"
      :on-page-size-change="onPageSizeChange"
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
    data() {
      return {
        searchData: {
          table: this.$route.params.tableName,
          startIndex: 0,
          range: 10
        }
      };
    },
    components: {
      AgTable
    },
    computed: {
      ...mapState(getComponentName(), {
        ag: ({ ag }) => ag,
        pageAttribute: ({ ag }) => ({
          current: (ag.datas.start + ag.datas.defaultrange) / ag.datas.defaultrange,
          total: ag.datas.totalRowCount,
          'page-size-opts': ag.datas.selectrange,
          'show-elevator': true,
          'show-sizer': true,
        })
      })
    },
    methods: {
      ...mapActions('global', ['updateAccessHistory']),
      ...mapActions(getComponentName(), ['getQueryListForAg']),
      onPageChange(page) {
        const { range } = this.searchData;
        this.searchData.startIndex = range * (page - 1);
        this.getQueryListForAg(this.searchData);
      },
      onPageSizeChange(pageSize) {
        this.searchData.startIndex = 0;
        this.searchData.range = pageSize;
        this.getQueryListForAg(this.searchData);
      },
    },
    mounted() {
      this.getQueryListForAg(this.searchData);
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
