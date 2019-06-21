<template>
  <div class="verticalTableDetail">
    <single-object-buttons
      :tabcmd="mainFormInfo.buttonsData.data.tabcmd"
      object-type="vertical"
      :itemTableCheckFunc="itemTableCheckFunc"
      :isreftabs="mainFormInfo.buttonsData.data.isreftabs"
      :isactive="mainFormInfo.buttonsData.data.isactive"
      :watermarkimg="mainFormInfo.buttonsData.data.watermarkimg?mainFormInfo.buttonsData.data.watermarkimg:''"
      :item-name-group="childTableNames"
      :item-info="tabPanel[tabCurrentIndex]"
      :tabwebact="mainFormInfo.buttonsData.data.tabwebact"
      :item-name="getItemName"
    />
    <composite-form
      v-if="mainFormInfo.formData.isShow"
      object-type="vertical"
      :is-main-table="true"
      :objreadonly="mainFormInfo.buttonsData.data.objreadonly"
      :default-set-value="updateData[this.$route.params.tableName]? updateData[this.$route.params.tableName].changeData:{}"
      :master-name="$route.params.tableName"
      :master-id="$route.params.itemId"
      module-form-type="vertical"
      :default-data="Object.keys(defaultDataForCopy).length>0?defaultDataForCopy.data:mainFormInfo.formData.data"
      :paths="formPaths"
      :isreftabs="mainFormInfo.buttonsData.data.isreftabs"
      :child-table-name="getItemName"
      type="PanelForm"
      @formChange="formChange"
      @InitializationForm="InitializationForm"
      @VerifyMessage="verifyFormPanelMain"
    />
    <TabPanels
      v-if="tabPanels.length > 0"
      class="tabPanel"
      :tab-margin-left="20"
      is-keep-alive
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

  import Vue from 'vue';
  import tabComponent from './SingleObjectTabComponent';
  import verticalMixins from '../__config__/mixins/verticalTableDetail';
  import singleObjectButtons from './SingleObjectButtons';
  import compositeForm from './CompositeForm';


  export default {
    // name: 'VTableDetail',
    computed: {
      tabPanels() {
        const arr = [];
        this.tabPanel.forEach((item) => {
          const obj = { ...item };
          obj.componentAttribute.itemInfo = item;
          obj.componentAttribute.tableName = item.tablename;
          obj.componentAttribute.changeData = this.updateData[item.tablename].changeData;
          obj.componentAttribute.isreftabs = this.mainFormInfo.buttonsData.data.isreftabs;
          obj.componentAttribute.objreadonly = this.mainFormInfo.buttonsData.data.objreadonly;
          obj.componentAttribute.status = this.mainFormInfo.buttonsData.data.status;
          obj.componentAttribute.childTableNames = this.childTableNames;
          obj.componentAttribute.mainFormPaths = this.formPaths;
          obj.componentAttribute.tooltipForItemTable = this.tooltipForItem;
          obj.componentAttribute.type = 'vertical';
          Vue.component(`${item.tablename}_TapComponent`, Vue.extend(tabComponent));
          obj.component = `${item.tablename}_TapComponent`;
          obj.cilckCallback = this.tabClick;
          arr.push(obj);
        });
        return arr;
      },
      formPaths() {
        if (this.mainFormInfo.buttonsData.data && this.mainFormInfo.buttonsData.data.tabcmd && this.mainFormInfo.buttonsData.data.tabcmd.paths) {
          return this.mainFormInfo.buttonsData.data.tabcmd.paths;
        }
        return [];
      },
      getItemName() {
        if (this.tabPanel.length > 0) {
          return this.tabPanel[this.tabCurrentIndex].tablename;
        }
        return '';
      },
    },
    components: {
      compositeForm
    },
    mounted() {

    },
    created() {
      Vue.component('SingleObjectButtons', Vue.extend(Object.assign({ mixins: [verticalMixins()] }, singleObjectButtons)));
      const { tableName, itemId } = this.$route.params;
      this.getObjectForMainTableForm({ table: tableName, objid: itemId });
      this.getObjectTabForMainTable({ table: tableName, objid: itemId, tabIndex: this.tabCurrentIndex });
    },
    methods: {
      itemTableCheckFunc() {

      }, // 按钮点击保存的回调
      InitializationForm(val) {
        const { tableName, itemId } = this.$route.params;
        const obj = {};
        obj[tableName] = val;
        if (itemId === 'New') {
          this.updateAddData({ tableName, value: obj });
        }
        this.updateDefaultData({ tableName, value: obj });
      },
      formChange(val, changeVal) {
        const { tableName, itemId } = this.$route.params;
        const obj = {};
        obj[tableName] = val;
        this.updateChangeData({ tableName, value: changeVal });
        if (itemId === 'New') {
          this.updateAddData({ tableName, value: obj });
        } else {
          this.updateModifyData({ tableName, value: obj });
        }
      },
      verifyFormPanelMain(data) {
        const { tableName } = this.$route.params;
        this.updateCheckedInfoData({ tableName, value: data });
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
            inlinemode: refTab.tabinlinemode,
            tabIndex: index
          };
          this.getFormDataForRefTable(formParam);
          this.getObjectTabForRefTable({ table: refTab.tablename, objid: itemId, tabIndex: index });
        }
        if (refTab.tabrelation === '1:m') {
          this.getObjectTableItemForTableData({
            table: refTab.tablename, objid: itemId, refcolid: refTab.refcolid, searchdata: { column_include_uicontroller: true }, tabIndex: index
          });
        } else if (refTab.tabrelation === '1:1') {
          this.getObjectTabForRefTable({ table: refTab.tablename, objid: itemId, tabIndex: index });
          this.getItemObjForChildTableForm({ table: refTab.tablename, objid: itemId, refcolid: refTab.refcolid, tabIndex: index });
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .verticalTableDetail {
    flex: 1;
    overflow-y: auto;
    .tabPanel {
      margin: 10px 0;
    }
  }
</style>
