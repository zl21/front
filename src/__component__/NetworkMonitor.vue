<template>
  <div class="NetworkMonitorContainer">
    <h1>
      Network Monitor
    </h1>
    <div class="tableWrapper" >
      <Table size="small" :columns="columns" :data="data" disabled-hover :height="true"></Table>
    </div>
  </div>
</template>

<script>
  import { queryAllNetwork } from '../__utils__/indexedDB';
  
  export default {
    data: () => ({
      data: [],
      columns: [
        { key: 'timecost', title: '请求耗时' },
        { key: 'url', title: 'Url' },
        { key: 'method', title: '请求Method' },
        { key: 'reqTimeString', title: '请求时间' },
        { key: 'data', title: '请求参数' },
      ]
    }),
    name: 'NetworkMonitor',
    created() {
      const intervalTime = 5000;
      this.doQuery();
      setInterval(() => {
        this.doQuery();
      }, intervalTime);
    },
    methods: {
      doQuery() {
        console.log('NetWork Monitor Refresh.');
        queryAllNetwork().then((res) => {
          this.data = res;
        });
      }
    }
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
