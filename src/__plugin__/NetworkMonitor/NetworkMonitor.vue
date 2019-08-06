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
  import { queryAllNetwork } from '../../__utils__/indexedDB';
  
  export default {
    data: () => ({
      interval: -1,
      data: [],
      columns: [
        { key: 'timecost', title: '请求耗时' },
        { key: 'url', title: 'Url' },
        { key: 'method', title: '请求Method' },
        { key: 'reqTimeString', title: '请求时间' },
        { key: 'data', title: '请求参数' },
      ]
    }),
    created() {
      const intervalTime = 1000 * 60;
      this.doQuery();
      this.interval = setInterval(() => {
        this.doQuery();
      }, intervalTime);
    },
    methods: {
      doQuery() {
        console.log('NetWork Monitor Refresh.');
        queryAllNetwork()
          .then((res) => {
            this.data = res;
          });
      }
    },
    beforeDestroy() {
      clearInterval(this.interval);
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
