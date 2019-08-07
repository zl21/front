<template>
  <div class="NetworkMonitorContainer">
    <div style="margin: 15px;">
      <Button @click="doQuery">刷新</Button>
      <Button @click="doEmpty">清空非当日数据</Button>
    </div>
    <div class="tableWrapper" >
      <Table size="small" :columns="columns" :data="data" disabled-hover :height="true"></Table>
    </div>
  </div>
</template>

<script>
  import { queryAllNetwork, emptyOtherDayRecord } from '../../__utils__/indexedDB';
  
  export default {
    data: () => ({
      data: [],
      columns: [
        { key: 'timecost', title: '请求耗时(ms)' },
        { key: 'url', title: 'Url' },
        { key: 'method', title: '请求Method' },
        { key: 'reqTimeString', title: '请求时间' },
        { key: 'data', title: '请求参数' },
      ]
    }),
    created() {
      this.doQuery();
    },
    methods: {
      doQuery() {
        queryAllNetwork()
          .then((res) => {
            this.data = res;
          });
      },
      doEmpty() {
        emptyOtherDayRecord()
          .then(() => {
            this.doQuery();
          });
      }
    },
  };
</script>

<style lang="less">
  .NetworkMonitorContainer {
    height: 100%;
    overflow: scroll;
    display: flex;
    flex-direction: column;
    h1 {
      text-align: center;
      margin: 15px auto;
    }
    .tableWrapper {
      /*border: 1px solid lightgrey;*/
      width: 100%;
      flex: 1;
      overflow: hidden;
      .burgeon-table-cell span {
        font-weight: 400;
      }
    }
  }
</style>
