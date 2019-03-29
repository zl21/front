<template>
  <div style="overflow: auto">
    <horizontal-table
            v-if="tableData.isShow"
            :dataSource="tableDatas"
    />
    <horizontal-button
            :tabcmd="buttonsData.buttonsTabcmd"
            :tabwebact="buttonsData.buttonsTabwebact"
            v-if="buttonsData.isShow"></horizontal-button>
  </div>
</template>

<script>
  import horizontalTable from './TableDetailCollection';
  import horizontalButton from './SingleObjectButtons';

  export default {
    data() {
      return {};
    },
    name: 'SingleObjectTabComponent',
    components: {
      horizontalTable,
      horizontalButton
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
