<template>
  <div style="overflow: auto">
    <horizontal-button
      v-if="buttonsData.isShow"
      :tabcmd="buttonsData.data.tabcmd"
      :tabwebact="buttonsData.data.tabwebact"
    />
    <horizontal-form
            v-if="formData.isShow"
            :defaultData="formData.data"
    ></horizontal-form>
    <horizontal-form
            v-if="panelData.isShow"
            type="PanelForm"
            :defaultData="panelData.data"
    ></horizontal-form>
    <!--<div v-if="panelData.isShow">-->
      <!--<Collapse-->
        <!--class="panelForm"-->
        <!--v-for="(item, index) in panelData.data"-->
        <!--:key="index"-->
        <!--:value="item.hrdisplay"-->
      <!--&gt;-->
        <!--<Panel-->
          <!--:name=''-->
          <!--title-type="center"-->
        <!--&gt;-->
          <!--{{ item.parentdesc }}-->
        <!--</Panel>-->
      <!--</Collapse>-->
    <!--</div>-->
    <horizontal-table
      v-if="tableData.isShow"
      :data-source="tableData.data"
      :readonly="buttonsData.data.objreadonly"
    />
  </div>
</template>

<script>
  import horizontalTable from './TableDetailCollection';
  import horizontalButton from './SingleObjectButtons';
  import horizontalForm from './CompositeForm';

  export default {
    data() {
      return {};
    },
    name: 'SingleObjectTabComponent',
    components: {
      horizontalTable,
      horizontalButton,
      horizontalForm
    },
    props: {
      tableData: {
        type: Object,
        default: () => ({})
      }, // 表格数据
      buttonsData: {
        type: Object,
        default: () => ({})
      }, // 按钮数据
      formData: {
        type: Object,
        default: () => ({})
      }, // 表单数据
      panelData: {
        type: Object,
        default: () => ({})
      } // 面板数据
    },
    watch: {},
    computed: {
    },
    methods: {}
  };
</script>

<style lang="less">
  .panelForm{
    margin-bottom: 10px;
  }
</style>
