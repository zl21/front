<template>
  <div :class="classes">
    <Page
      v-if="showPage"
      class="page"
      :total="total"
      show-total
      show-sizer
      show-elevator
      transfer
      :page-size="pageSize"
      :current="currentPage"
      :page-size-opts="pageSizeOpts"
      v-on="standardTableEvent"
    />

    <div
      v-if="showTable"
      class="table"
    >
      <Table
        ref="table"
        class="table"
        :total="total"
        :columns="columns"
        :height="true"
        :data="data"
        highlight-row
        v-on="standardTableEvent"
      />
    </div>
  </div>
</template>
<script>
  import { classFix } from '../../src/constants/global';

  export default {
    name: 'StandardTable',
    props: {
      // 事件回调
      standardTableEvent: {
        type: Object,
        default() {
          return {};
        }
      },
      // 分页属性
      showPage: { // 控制分页是否展示
        type: Boolean,
        default: true
      },
      total: {
        type: Number,
        default: 0
      },
      currentPage: {
        type: Number,
        default: 1
      },
      pageSize: {
        type: Number,
        default: 10
      },
      pageSizeOpts: {
        type: Array,
        default() {
          return [10, 20, 30, 40];
        }
      },

      // 表格属性
      showTable: { // 控制表格是否展示
        type: Boolean,
        default: true
      },
      columns: {
        type: Array,
        default() {
          return [];
        }
      },
      data: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    computed: {
      classes() {
        return [
          `${classFix}StandardTable`,
        ];
      },
    },
    methods: {
    }
  };
</script>
