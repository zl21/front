<template>
  <div class="verticalTableDetail">
    <single-object-buttons
      :tabcmd="mainFormInfo.buttonsData.buttonsTabcmd"
      :tabwebact="mainFormInfo.buttonsData.buttonsTabwebact"
    />
    <composite-form
      v-if="mainFormInfo.formData.isShow"
      :master-name="$route.params.tableName"
      :master-id="$route.params.itemId"
      class="panelForm"
      module-form-type="vertical"
      :default-data="mainFormInfo.formData.data"
      type="PanelForm"
      @formChange="formChange"
      @InitializationForm="InitializationForm"
    />
    <TabPanels
      v-if="tabPanels.length > 0"
      class="tabPanel"
      :tab-margin-left="20"
      is-keep-alive
      isKeepAlive
      :type="'singleCard'"
      :tab-panels="tabPanels"
    />
    <!-- <TableDetailCollection
      :data-source="dataSource"
      @tableSearch="getRefTableSearchList"
    /> -->
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';

  // import TableDetailCollection from './TableDetailCollection';
  import tabComponent from './SingleObjectTabComponent';
  import singleObjectButtons from './SingleObjectButtons';
  import compositeForm from './CompositeForm';


  export default {
    computed: {
      ...mapState('global', {
        favorite: ({ favorite }) => favorite
      }),
      tabPanels() {
        const arr = [];

        this.tabPanel.forEach((item, index) => {
          const obj = { ...item };
          obj.componentAttribute.tableName = item.tablename;
          obj.componentAttribute.type = 'vertical';
          obj.component = tabComponent;
          obj.cilckCallback = this.tabClick;
          arr.push(obj);
        });
        return arr;
      }
    },
    components: {
      singleObjectButtons,
      compositeForm
    },
    mounted() {
    },
    created() {
      const { tableName, itemId } = this.$route.params;
      this.getObjectForMainTableForm({ table: tableName, objid: itemId });
      this.getObjectTabForMainTable({ table: tableName, objid: itemId });
    },
    methods: {
      ...mapActions('global', ['updateAccessHistory']),
      InitializationForm(val) {
        const { tableName } = this.$route.params;
        const obj = {};
        obj[tableName] = val;
        this.updateDefaultData({ tableName, value: obj });
      },
      formChange(val) {
        const { tableName, itemId } = this.$route.params;
        const obj = {};
        obj[tableName] = val;
        if (itemId === -1) {
          this.updateAddData({ tableName, value: obj });
        } else {
          this.updateModifyData({ tableName, value: obj });
        }
      },
      tabClick(index) {
        // tab点击
        if (index === this.tabCurrentIndex) {
          return;
        }
        this.updateTabCurrentIndex(index);
        const { itemId } = this.$route.params;
        const refTab = this.tabPanel[index];
        if (this.tabPanels[index].componentAttribute.refcolid !== -1) {
          // 获取子表表单
          const formParam = {
            table: refTab.tablename,
            inlinemode: refTab.tabinlinemode
          };
          this.getFormDataForRefTable(formParam);
          this.getObjectTabForRefTable({ table: refTab.tablename, objid: itemId });
        }
        if (refTab.tabrelation === '1:m') {
          this.getObjectTableItemForTableData({
            table: refTab.tablename, objid: itemId, refcolid: refTab.refcolid, searchdata: { column_include_uicontroller: true }
          });
        } else if (refTab.tabrelation === '1:1') {
          this.getObjectTabForRefTable({ table: refTab.tablename, objid: itemId });
          this.getItemObjForChildTableForm({ table: refTab.tablename, objid: itemId, refcolid: refTab.refcolid });
        }
      },
    },
    // beforeDestroy() {
    //   // this.$store.unregisterModule(this.moduleComponentName);
    // }
  };
</script>

<style lang="less" scoped>
  .verticalTableDetail {
    flex: 1;
    overflow-y: auto;
    .panelForm {
      margin: 0 20px;
    }
    .tabPanel {
      margin: 10px 20px;
    }
  }
</style>
