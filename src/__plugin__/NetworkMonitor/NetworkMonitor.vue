<template>
  <div :class="classes" >
    <div style="margin: 15px;">
      <Button @click="doQuery">
        刷新
      </Button>
      <Button @click="doEmpty">
        清空所有数据
      </Button>
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
    <div class="tableWrapper">
      <Table
        v-if="enableNetworkMonitor"
        size="small"
        :columns="columns"
        :data="viewData"
        disabled-hover
        :height="true"
      />
      <div v-else>
        <h4>当前系统未启动网络监视器功能，请联系开发人员开启此功能！</h4>
      </div>
    </div>
  </div>
</template>

<script>
  import { queryAllNetwork, emptyRecord } from '../../__utils__/indexedDB';
  import { ENABLE_NETWORK_MONITOR, classFix } from '../../constants/global';

  export default {
    data() {
      return ({
        page: 1,
        pageSize: 10,
        viewData: [],
        data: [],
        columns: [
          {
            key: 'serialId',
            title: this.$t('table.index'),
            render: (createElement, data) => createElement('span', data.index + 1 + (this.page - 1) * this.pageSize)
          },
          { key: 'timecost', title: 'TimeCost' },
          { key: 'url', title: 'Url' },
          { key: 'method', title: 'Method' },
          {
            key: 'reqTime',
            title: 'Request Time',
            render: (createElement, data) => {
              const date = new Date(data.row[data.column.key]);
              const format = `${date.toLocaleDateString()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
              return createElement('span', format);
            }
          },
          {
            key: 'data',
            title: 'Request Params',
            // minWidth: 300,
            maxWidth: 500,
            ellipsis: false,
            render: (createElement, data) => {
              const format = data.row.isJson ? JSON.stringify(data.row[data.column.key] || {}, null, 4) : decodeURIComponent(data.row[data.column.key] || '');
              return createElement('span', format);
            }
          },
          {
            key: 'isJson',
            title: 'Content-Type',
            render: (createElement, data) => createElement('span', data.row[data.column.key] ? 'application/json' : 'application/x-www-form-urlencoded')
          }
        ],
        enableNetworkMonitor: ENABLE_NETWORK_MONITOR()
      });
    },
    created() {
      if (this.enableNetworkMonitor) {
        this.doQuery();
      }
    },
    computed: {
      classes: () => `${classFix}NetworkMonitorContainer`,
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
        if (this.enableNetworkMonitor) {
          queryAllNetwork()
            .then((res) => {
              this.data = res.sort((a, b) => b.reqTime - a.reqTime);
              this.generateViewData();
            });
        }
      },
      doEmpty() {
        if (this.enableNetworkMonitor) {
          emptyRecord(Date.now())
            .then(() => {
              this.doQuery();
            });
        }
      }
    },
  };
</script>
