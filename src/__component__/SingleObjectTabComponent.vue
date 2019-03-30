<template>
  <div style="overflow: auto">
    <horizontal-button
      v-if="buttonsData.isShow"
      :tabcmd="buttonsData.buttonsTabcmd"
      :tabwebact="buttonsData.buttonsTabwebact"
    />
    <div v-if="panelData.isShow">
      <Collapse
        class="panelForm"
        v-for="(item, index) in panelData.data"
        :key="index"
        :value="item.hrdisplay"
      >
        <Panel
          :name=getPanelName(item.hrdisplay)
          title-type="center"
        >
          {{ item.parentdesc }}
        </Panel>
      </Collapse>
    </div>
    <horizontal-table
      v-if="tableData.isShow"
      :data-source="tableData.data"
    />
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
      },
      panelData: {
        type: Object,
        default: () => ({})
      }
    },
    watch: {},
    computed: {
      getPanelName() {
        return (display) => {
          if (display === 'expand') {
            return 'expand';
          }
          return '';
        };
      }
    },
    methods: {}
  };
</script>

<style lang="less">
  .panelForm{
    margin-bottom: 10px;
  }
  .panelForm >.burgeon-collapse-header >.burgeon-collapse-header-center{
    height: 24px;
    line-height: 24px;
  }
</style>
