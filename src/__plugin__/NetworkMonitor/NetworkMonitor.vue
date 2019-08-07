<template>
  <div class="NetworkMonitorContainer">
    <div style="margin: 15px;">
      <Button @click="doQuery">刷新</Button>
      <Button @click="doEmpty">清空非当日数据</Button>
    </div>
    <div style="margin-bottom: 15px;">
      <Page
        ref="page"
        size="small"
        :total="data.length"
        show-total
        show-elevator
        show-sizer
        @on-change="pageChange"
        @on-page-size-change="pageSizeChange"
      />
    </div>
    <div class="tableWrapper" >
      <Table
        size="small"
        :columns="columns"
        :data="viewData"
        disabled-hover
        :height="true"
      ></Table>
    </div>
  </div>
</template>

<script>
  import { queryAllNetwork, emptyOtherDayRecord } from '../../__utils__/indexedDB';
  
  export default {
    data: () => ({
      page: 1,
      pageSize: 10,
      viewData: [],
      data: [],
      columns: [
        { key: 'timecost', title: 'TimeCost' },
        { key: 'url', title: 'Url' },
        { key: 'method', title: 'Method' },
        { key: 'reqTime', title: 'Request Time' },
        { key: 'data', title: 'Request Params' },
      ]
    }),
    created() {
      this.doQuery();
    },
    methods: {
      pageChange(pageNum) {
        this.page = pageNum;
        this.generateViewData();
      }, // 页码改变
      pageSizeChange(pageSize) {
        this.pageSize = pageSize;
      },
      generateViewData() {
        this.viewData = this.data.slice((this.page - 1) * this.pageSize, this.page * this.pageSize);
      },
      doQuery() {
        queryAllNetwork()
          .then((res) => {
            this.data = res;
            this.generateViewData();
          });
      },
      doEmpty() {
        emptyOtherDayRecord(Date.now() - 1000 * 60)
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
