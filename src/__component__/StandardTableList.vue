<template>
  <div>
    <h1>Router Info: {{ $route.path }}</h1>
    <!-- 按钮栏组件 -->
    <h2>按钮栏组件</h2>

    <!-- Form 表单组件 -->
    <h2>Form 表单组件</h2>

    <!-- 表格组件 -->
    <h2>表格组件</h2>
    <StandardTable
      :page-attribute="pageAttribute"
      :legend="legend"
      :datas="datas"
      :isShowAgLoading="isShowAgLoading"
    ></StandardTable>
  </div>
</template>

<script>
  import StandardTable from './StandardTable';

  export default {
    name: 'StandardTableList',
    data() {
      return {
        pageAttribute: {
          total: 0,
          'show-total': true,
          'page-size-opts': [10, 20, 30, 50, 100],
          'show-elevator': true,
          'show-sizer': true
        },
        datas: {},
        legend: [],
        isShowAgLoading: false
      };
    },
    components: {
      StandardTable
    },
    created() {
    },
    mounted() {
    },
    methods: {
    }
  };
</script>

<style scoped>

</style>
