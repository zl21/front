<template>
  <div class="verticalTableDetail">
    <component
      :is="currentSingleButtonComponentName"
      :tabcmd="mainFormInfo.buttonsData.data.tabcmd"
      object-type="vertical"
      :item-table-check-func="itemTableCheckFunc"
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
      :objreadonly="mainFormInfo.buttonsData.data.objreadonly || mainFormInfo.formData.data.isdefault"
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
      ref="tabPanel"
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
  /* eslint-disable consistent-return */


  import Vue from 'vue';
  import getComponentName from '../__utils__/getModuleName';
  import tabComponent from './SingleObjectTabComponent';
  import verticalMixins from '../__config__/mixins/verticalTableDetail';
  import singleObjectButtons from './SingleObjectButtons';
  import compositeForm from './CompositeForm';


  export default {
    // name: 'VTableDetail',
    data() {
      return {
        currentSingleButtonComponentName: null
      };
    },
    computed: {
      tabPanels() {
        const arr = [];
        this.tabPanel.forEach((item) => {
          const obj = { ...item };
          obj.componentAttribute.itemInfo = item;
          obj.componentAttribute.tableName = item.tablename;
          obj.componentAttribute.changeData = this.updateData[item.tablename].changeData;
          obj.componentAttribute.isreftabs = this.mainFormInfo.buttonsData.data.isreftabs;
          obj.componentAttribute.objreadonly = this.mainFormInfo.buttonsData.data.objreadonly || this.childReadonly;
          obj.componentAttribute.status = this.mainFormInfo.buttonsData.data.status;
          obj.componentAttribute.childTableNames = this.childTableNames;
          obj.componentAttribute.mainFormPaths = this.formPaths;
          obj.componentAttribute.tooltipForItemTable = this.tooltipForItem;
          obj.componentAttribute.type = 'vertical';
          if (obj.vuedisplay === 'TabItem') {
            Vue.component(`tapComponent.${item.tablename}`, Vue.extend(tabComponent));
            obj.componentAttribute.componentName = obj.webact.substring(obj.webact.lastIndexOf('/') + 1, obj.webact.length);
          } else {
            Vue.component(`tapComponent.${item.tablename}`, Vue.extend(tabComponent));
          }
          obj.component = `tapComponent.${item.tablename}`;
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
    created() {
      const singleButtonComponentName = `${getComponentName()}.SingleObjectButtons`;
      if (Vue.component(singleButtonComponentName) === undefined) {
        Vue.component(singleButtonComponentName, Vue.extend(Object.assign({ mixins: [verticalMixins()] }, singleObjectButtons)));
      }
      this.currentSingleButtonComponentName = singleButtonComponentName;

      const { tableName, itemId } = this.$route.params;
      this.getObjectForMainTableForm({ table: tableName, objid: itemId });
      this.getObjectTabForMainTable({ table: tableName, objid: itemId, tabIndex: this.tabCurrentIndex });
    },
    methods: {
      itemTableCheckFunc() {
        if (this.$refs.tabPanel) {
          return this.$refs.tabPanel.$children[3].itemTableCheckFunc();
        }
      }, // 按钮点击保存的回调
      InitializationForm(val) {
        const { tableName, itemId } = this.$route.params;
        const obj = {};
        obj[tableName] = val;
        if (itemId) {
          if (itemId === 'New') {
            this.updateAddData({ tableName, value: obj });
          }
          this.updateDefaultData({ tableName, value: obj });
        }
      },
      formChange(val, changeVal) {
        const { tableName, itemId } = this.$route.params;
        const obj = {};
        obj[tableName] = val;
        if (itemId) {
          this.updateChangeData({ tableName, value: changeVal });
          if (itemId === 'New') {
            this.updateAddData({ tableName, value: obj });
          } else {
            this.updateModifyData({ tableName, value: obj });
          }
        }
      },
      verifyFormPanelMain(data) {
        const { tableName, itemId } = this.$route.params;
        if (itemId) {
          this.updateCheckedInfoData({ tableName, value: data });
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
        let getButtonDataPromise = null;
        if (this.tabPanels[index].componentAttribute.refcolid !== -1) {
          // 获取子表表单
          getButtonDataPromise = new Promise((rec, rej) => {
            this.getObjectTabForRefTable({
              table: refTab.tablename, objid: itemId, tabIndex: index, rec, rej
            });
          });
          const formParam = {
            table: refTab.tablename,
            inlinemode: refTab.tabinlinemode,
            tabIndex: index
          };
          this.getFormDataForRefTable(formParam);
        }
        if (refTab.tabrelation === '1:m') {
          getButtonDataPromise.then(() => {
            this.getObjectTableItemForTableData({
              table: refTab.tablename,
              objid: itemId,
              refcolid: refTab.refcolid,
              searchdata: {
                column_include_uicontroller: true,
                startindex: (this.tablePageInfo.currentPageIndex - 1) * this.tablePageInfo.pageSize,
                range: this.tablePageInfo.pageSize,
                fixedcolumns: refTab.tableSearchData.selectedValue ? { [refTab.tableSearchData.selectedValue]: `${refTab.tableSearchData.inputValue}` } : {}
              },
              tabIndex: index
            });
          });
        } else if (refTab.tabrelation === '1:1') {
          this.getObjectTabForRefTable({ table: refTab.tablename, objid: itemId, tabIndex: index });
          this.getItemObjForChildTableForm({
            table: refTab.tablename, objid: itemId, refcolid: refTab.refcolid, tabIndex: index
          });
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
