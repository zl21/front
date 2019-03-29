<template>
  <div style="overflow: auto">
    <horizontal-table
            v-if="tableData.isShow"
            :dataSource="tableDatas"
    />
  </div>
</template>

<script>
  import horizontalTable from './TableDetailCollection';

  export default {
    data() {
      return {};
    },
    name: 'SingleObjectTabComponent',
    components: {
      horizontalTable
    },
    props: {
      tableData: {
        type: Object,
        default: () => ({})
      },
      buttonsData: {
        type: Object,
        default: () => ({})
      },
      formData: {
        type: Object,
        default: () => ({})
      }
    },
    watch: {},
    computed: {
      tableDatas() {
        return this.tableData.data;
      }
    },
    methods: {}
  };
</script>

<style lang="less">
</style>
